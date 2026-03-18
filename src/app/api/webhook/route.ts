import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmationEmail, sendNewOrderNotificationEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

interface LineItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  quantity: number;
  price: number;
}

// Admin client without typed RLS restrictions
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { customerEmail, customerName, shippingAddress, shippingCity, shippingState, shippingPostcode } = paymentIntent.metadata;
    const itemsJson = paymentIntent.metadata.items;

    if (!customerEmail || !itemsJson) {
      console.error('Missing metadata on payment intent:', paymentIntent.id);
      return NextResponse.json({ received: true });
    }

    try {
      const items = JSON.parse(itemsJson) as LineItem[];
      const shippingCents = parseInt(paymentIntent.metadata.shippingCents || '0', 10);
      const shippingCost = shippingCents / 100;
      const total = paymentIntent.amount / 100;
      const subtotal = total - shippingCost;

      const supabase = getAdminClient();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          stripe_payment_intent_id: paymentIntent.id,
          customer_email: customerEmail,
          customer_name: customerName || customerEmail.split('@')[0],
          shipping_address: shippingAddress || '',
          shipping_city: shippingCity || '',
          shipping_state: shippingState || '',
          shipping_postcode: shippingPostcode || '',
          subtotal,
          shipping_cost: shippingCost,
          total,
          status: 'paid',
        })
        .select('id, order_number')
        .single();

      if (orderError) {
        console.error('Failed to create order:', orderError);
      }

      // Insert order items – resolve slug-based IDs to DB UUIDs
      if (order) {
        const slugIds = items
          .map((i) => i.productId)
          .filter((id) => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

        let slugToUuid: Record<string, string> = {};
        if (slugIds.length > 0) {
          const { data: matched } = await supabase
            .from('products')
            .select('id, slug')
            .in('slug', slugIds);
          if (matched) {
            slugToUuid = Object.fromEntries(matched.map((p) => [p.slug as string, p.id as string]));
          }
        }

        const orderItems = items.map((item) => {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.productId);
          return {
            order_id: order.id as string,
            product_id: isUuid ? item.productId : (slugToUuid[item.productId] ?? null),
            variant_id: item.variantId ?? null,
            product_name: item.name,
            variant_name: item.variantName ?? null,
            quantity: item.quantity,
            unit_price: item.price,
          };
        });

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Failed to insert order items:', itemsError);
        }
      }

      const orderNumber = (order?.order_number as string) ?? paymentIntent.id.slice(-8).toUpperCase();

      // Send confirmation email
      await sendOrderConfirmationEmail(customerEmail, {
        orderId: orderNumber,
        items: items.map((item) => ({
          name: item.variantName ? `${item.name} (${item.variantName})` : item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping: shippingCost,
        total,
        customerName: customerName || customerEmail.split('@')[0],
      });

      // Notify business of new order
      await sendNewOrderNotificationEmail({
        orderId: orderNumber,
        items: items.map((item) => ({
          name: item.variantName ? `${item.name} (${item.variantName})` : item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping: shippingCost,
        total,
        customerName: customerName || customerEmail.split('@')[0],
        customerEmail,
        shippingAddress: `${shippingAddress || ''}, ${shippingCity || ''}, ${shippingState || ''} ${shippingPostcode || ''}`,
      });
    } catch (err) {
      console.error('Error processing payment_intent.succeeded:', err);
    }
  }

  return NextResponse.json({ received: true });
}
