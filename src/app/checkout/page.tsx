'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart, getEffectiveUnitPrice } from '@/contexts/CartContext';
import { ShoppingBag, ArrowLeft, Loader2, Lock } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
}

function PaymentForm({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !isReady) return;

    setIsProcessing(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed. Please try again.');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setError('Payment was not successful. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <PaymentElement onReady={() => setIsReady(true)} />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total</span>
          <span>${amount.toFixed(2)} AUD</span>
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing || !isReady}
          className="w-full py-3 bg-primary text-primary-foreground hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed font-bold rounded-lg transition-opacity flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Pay ${amount.toFixed(2)} AUD
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Your payment is secured by Stripe. We do not store your card details.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  const total = getCartTotal();

  const handleShippingChange = useCallback(
    (field: keyof ShippingInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setShipping((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate all fields are filled
    const emptyFields = Object.entries(shipping).filter(([, v]) => !v.trim());
    if (emptyFields.length > 0) {
      setFormError('Please fill in all fields.');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsCreatingIntent(true);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          customerEmail: shipping.email,
          shippingInfo: {
            name: shipping.name,
            address: shipping.address,
            city: shipping.city,
            state: shipping.state,
            postcode: shipping.postcode,
          },
        }),
      });

      if (!response.ok) {
        const data: unknown = await response.json();
        const errorMessage =
          data !== null &&
          typeof data === 'object' &&
          'error' in data &&
          typeof (data as { error: unknown }).error === 'string'
            ? (data as { error: string }).error
            : 'Failed to initialize payment';
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as {
        clientSecret: string;
        paymentIntentId: string;
      };
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setStep('payment');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setFormError(message);
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handlePaymentSuccess = (piId: string) => {
    const orderId = piId.slice(-8).toUpperCase();
    clearCart();
    router.push(`/order-confirmation?orderId=${orderId}&email=${encodeURIComponent(shipping.email)}`);
  };

  if (items.length === 0 && !paymentIntentId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some products to your cart before checking out.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main form area */}
        <div className="lg:col-span-3">
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={shipping.name}
                  onChange={handleShippingChange('name')}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={shipping.email}
                  onChange={handleShippingChange('email')}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={shipping.address}
                  onChange={handleShippingChange('address')}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={shipping.city}
                    onChange={handleShippingChange('city')}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={shipping.state}
                    onChange={handleShippingChange('state')}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div className="w-1/2">
                <label htmlFor="postcode" className="block text-sm font-medium mb-1">
                  Postcode
                </label>
                <input
                  id="postcode"
                  type="text"
                  value={shipping.postcode}
                  onChange={handleShippingChange('postcode')}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{formError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isCreatingIntent}
                className="w-full py-3 bg-primary text-primary-foreground hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed font-bold rounded-lg transition-opacity flex items-center justify-center gap-2"
              >
                {isCreatingIntent ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Preparing Payment...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </form>
          )}

          {step === 'payment' && clientSecret && (
            <div>
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to shipping
              </button>

              <div className="mb-6 p-4 bg-muted rounded-lg text-sm">
                <p className="font-medium">{shipping.name}</p>
                <p className="text-muted-foreground">{shipping.email}</p>
                <p className="text-muted-foreground">
                  {shipping.address}, {shipping.city}, {shipping.state} {shipping.postcode}
                </p>
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: 'stripe' },
                }}
              >
                <PaymentForm amount={total} onSuccess={handlePaymentSuccess} />
              </Elements>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-muted/50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const unitPrice = getEffectiveUnitPrice(item.product.price, item.quantity);
                return (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)} AUD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
