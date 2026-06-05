const nodemailer = require('nodemailer');

// Create reusable transporter using SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465', // true for port 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send Order Confirmation Email
 */
exports.sendOrderConfirmation = async (email, order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('⚠️ Email credentials not configured. Skipping confirmation email.');
    return;
  }

  const itemsList = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"HerbsEra Care" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your HerbsEra Order #${order.orderNumber} is Confirmed! 🌿`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; background-color: #fcfcfc;">
        <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="color: #064e3b; margin: 0; font-size: 24px; font-family: serif;">Herbs<span style="color: #a3e635;">Era</span></h1>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Crystallizing nature's healing essence</p>
        </div>
        
        <h2 style="color: #111827; font-size: 20px; font-weight: bold;">Thank you for your order!</h2>
        <p style="color: #4b5563; line-height: 1.6;">Hi ${order.shippingAddress.name},</p>
        <p style="color: #4b5563; line-height: 1.6;">We have received your order <strong>#${order.orderNumber}</strong>. We are packaging your handmade herbal selections with love and care, and we'll let you know when they ship.</p>
        
        <h3 style="color: #064e3b; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-top: 25px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left; font-size: 13px; color: #374151;">Product</th>
              <th style="padding: 10px; text-align: center; font-size: 13px; color: #374151;">Qty</th>
              <th style="padding: 10px; text-align: right; font-size: 13px; color: #374151;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 10px; text-align: right;">₹${order.pricing.subtotal}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">GST (18%):</td>
              <td style="padding: 10px; text-align: right;">₹${order.pricing.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
              <td style="padding: 10px; text-align: right;">${order.pricing.shippingCost === 0 ? 'Free' : `₹${order.pricing.shippingCost}`}</td>
            </tr>
            <tr style="font-size: 16px; font-weight: bold; color: #064e3b; background-color: #ecfdf5;">
              <td colspan="2" style="padding: 10px; text-align: right; border-top: 2px solid #10b981;">Total:</td>
              <td style="padding: 10px; text-align: right; border-top: 2px solid #10b981;">₹${order.pricing.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #f0f0f0;">
          <h4 style="color: #374151; margin: 0 0 5px 0; font-size: 14px;">Shipping Details:</h4>
          <p style="color: #4b5563; font-size: 13px; margin: 0; line-height: 1.5;">
            <strong>${order.shippingAddress.name}</strong><br/>
            ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>

        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
          This is an automated transaction receipt. For questions or support, please reply to this email or visit our website.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Order confirmation email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
  }
};

/**
 * Send Order Status Update Email
 */
exports.sendOrderStatusUpdate = async (email, order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('⚠️ Email credentials not configured. Skipping status update email.');
    return;
  }

  let statusMessage = '';
  switch (order.status) {
    case 'processing':
      statusMessage = 'is currently being prepared and processed.';
      break;
    case 'shipped':
      statusMessage = 'has been shipped and is on its way to you!';
      break;
    case 'delivered':
      statusMessage = 'has been successfully delivered! We hope you love your gemstone selection.';
      break;
    case 'cancelled':
      statusMessage = 'has been cancelled.';
      break;
    case 'refunded':
      statusMessage = 'has been refunded.';
      break;
    default:
      statusMessage = `status has been updated to: ${order.status.toUpperCase()}.`;
  }

  const mailOptions = {
    from: `"HerbsEra Care" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Update on your HerbsEra Order #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; background-color: #fcfcfc;">
        <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="color: #064e3b; margin: 0; font-size: 24px; font-family: serif;">Herbs<span style="color: #a3e635;">Era</span></h1>
        </div>

        <h2 style="color: #111827; font-size: 20px; font-weight: bold; text-align: center;">Order Status Update</h2>
        
        <p style="color: #4b5563; line-height: 1.6; font-size: 15px;">Hi ${order.shippingAddress.name},</p>
        <p style="color: #4b5563; line-height: 1.6; font-size: 15px;">
          We are writing to let you know that your order <strong>#${order.orderNumber}</strong> ${statusMessage}
        </p>

        ${order.trackingNumber ? `
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #d1fae5; margin: 20px 0;">
            <p style="margin: 0; color: #064e3b; font-size: 14px;">
              <strong>Delivery tracking number:</strong> ${order.trackingNumber}
            </p>
          </div>
        ` : ''}

        <p style="color: #4b5563; line-height: 1.6; font-size: 15px;">
          To view your order details, you can log in to your HerbsEra account at any time.
        </p>

        <br/>
        <p style="color: #4b5563; margin: 0;">Warm regards,</p>
        <p style="color: #064e3b; font-weight: bold; margin: 5px 0 0 0;">The HerbsEra Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Order status update email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
  }
};
