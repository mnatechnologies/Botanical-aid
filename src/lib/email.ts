import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({
  region: process.env.AWS_SES_REGION ?? 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const fromEmail = process.env.SES_FROM_EMAIL ?? 'orders@botanicalaid.com.au';
const businessEmail = process.env.BUSINESS_EMAIL ?? 'info@botanicalaid.com.au';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  orderId: string;
  items: OrderItem[];
  shipping: number;
  total: number;
  customerName: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderDetails: OrderDetails
): Promise<void> {
  const itemRows = orderDetails.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(item.name)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 24px; text-align: center;">
        <img src="https://www.botanicalaid.com.au/assets/faq-botanicalaid.png" alt="Botanical Aid" style="max-width: 280px; height: auto;" />
      </div>
      <div style="padding: 0 24px 24px;">
        <h2>Thank you for your order, ${orderDetails.customerName}!</h2>
        <p>Your order <strong>#${orderDetails.orderId}</strong> has been confirmed.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 8px; text-align: left;">Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 8px; color: #6b7280;">Shipping</td>
              <td style="padding: 8px; text-align: right; color: #6b7280;">${orderDetails.shipping === 0 ? 'Free' : `$${orderDetails.shipping.toFixed(2)}`}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px 8px; font-weight: bold;">Total</td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold;">$${orderDetails.total.toFixed(2)} AUD</td>
            </tr>
          </tfoot>
        </table>
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions about your order, please contact us at ${businessEmail}.
        </p>
      </div>
    </div>
  `;

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: `Order Confirmation #${orderDetails.orderId} - Botanical Aid` },
      Body: {
        Html: { Data: html },
        Text: {
          Data: `Thank you for your order, ${orderDetails.customerName}! Order #${orderDetails.orderId}. Total: $${orderDetails.total.toFixed(2)} AUD.`,
        },
      },
    },
  });

  await ses.send(command);
}

interface NewOrderNotification {
  orderId: string;
  items: OrderItem[];
  shipping: number;
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
}

export async function sendNewOrderNotificationEmail(
  details: NewOrderNotification
): Promise<void> {
  const itemRows = details.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(item.name)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 24px; text-align: center;">
        <img src="https://www.botanicalaid.com.au/assets/faq-botanicalaid.png" alt="Botanical Aid" style="max-width: 280px; height: auto;" />
      </div>
      <div style="padding: 0 24px 24px;">
        <h2 style="margin-top: 0;">New Order Received</h2>
        <p>Order <strong>#${details.orderId}</strong> has been placed.</p>
        <div style="background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0 0 4px;"><strong>Customer:</strong> ${escapeHtml(details.customerName)}</p>
          <p style="margin: 0 0 4px;"><strong>Email:</strong> ${escapeHtml(details.customerEmail)}</p>
          <p style="margin: 0;"><strong>Ship to:</strong> ${escapeHtml(details.shippingAddress)}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 8px; text-align: left;">Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 8px; color: #6b7280;">Shipping</td>
              <td style="padding: 8px; text-align: right; color: #6b7280;">${details.shipping === 0 ? 'Free' : `$${details.shipping.toFixed(2)}`}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px 8px; font-weight: bold;">Total</td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold;">$${details.total.toFixed(2)} AUD</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: { ToAddresses: [businessEmail] },
    Message: {
      Subject: { Data: `New Order #${details.orderId} - $${details.total.toFixed(2)}` },
      Body: {
        Html: { Data: html },
        Text: {
          Data: `New order #${details.orderId} from ${details.customerName} (${details.customerEmail}). Total: $${details.total.toFixed(2)} AUD.`,
        },
      },
    },
  });

  await ses.send(command);
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 24px; text-align: center;">
        <img src="https://www.botanicalaid.com.au/assets/faq-botanicalaid.png" alt="Botanical Aid" style="max-width: 280px; height: auto;" />
      </div>
      <div style="padding: 0 24px 24px;">
        <h2 style="margin-top: 0;">Contact Form Submission</h2>
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      </div>
    </div>
  `;

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: { ToAddresses: [businessEmail] },
    ReplyToAddresses: [email],
    Message: {
      Subject: { Data: `[Contact Form] ${subject}` },
      Body: {
        Html: { Data: html },
        Text: { Data: `From: ${name} (${email})\nSubject: ${subject}\n\n${message}` },
      },
    },
  });

  await ses.send(command);
}
