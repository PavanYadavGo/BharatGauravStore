// app/api/send-email/route.ts

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const body = await req.json();
  const { order } = body;

  if (!order || !order.email) {
    return NextResponse.json({ message: 'Missing order data' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const customerMailOptions = {
    from: `"Your Shop" <${process.env.GMAIL_USER}>`,
    to: order.email,
    subject: `Order Confirmation - ${order.id || 'No ID'}`,
    html: `
      <h2>Hi ${order.name},</h2>
      <p>Thank you for your order! Your order ID is <strong>${order.id}</strong>.</p>
      <p>Total: ₹${order.total}</p>
      <p>Payment Method: ${order.paymentMethod}</p>
      <p>We will contact you at ${order.contact} and ship to ${order.address}, ${order.zip}.</p>
    `,
  };

  const adminMailOptions = {
    from: `"Your Shop" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Order Received - ${order.id || 'No ID'}`,
    html: `
      <h2>New Order Received</h2>
      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      <p><strong>Shipping:</strong> ${order.address}, ${order.zip}</p>
      <p><strong>Items:</strong></p>
      <ul>
        ${order.items.map((item: any) => `<li>${item.name} x ${item.quantity}</li>`).join('')}
      </ul>
    `,
  };

  try {
    await transporter.sendMail(customerMailOptions);
    await transporter.sendMail(adminMailOptions);
    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Failed to send emails:', error);
    return NextResponse.json({ message: 'Email sending failed' }, { status: 500 });
  }
}
