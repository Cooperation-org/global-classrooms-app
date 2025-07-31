import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not defined');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment service is not configured' },
        { status: 503 }
      );
    }

    const { 
      amount, 
      currency = 'usd',
      donorName,
      donorEmail,
      purpose,
      recipientName,
      recipientEmail,
      message,
      sendECard
    } = await request.json();

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      );
    }

    // Build metadata for dedication and donor info
    const metadata: Record<string, string> = {
      purpose: 'donation',
      source: 'global-classrooms-app',
      donor_name: donorName || '',
      donor_email: donorEmail || '',
      payment_method: 'card',
      donation_purpose: 'general',
    };

    if (purpose) metadata.dedication_purpose = purpose;
    if (recipientName) metadata.recipient_name = recipientName;
    if (recipientEmail) metadata.recipient_email = recipientEmail;
    if (message) metadata.message = message;
    if (sendECard) metadata.send_ecard = sendECard.toString();

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Global Classrooms Donation',
              description: 'Supporting environmental education and student projects',
            //   images: ['https://your-domain.com/logo.png'], // Add your logo URL
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/dashboard/donate?canceled=true`,
      metadata,
      customer_email: recipientEmail || undefined, // Pre-fill email if provided
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 