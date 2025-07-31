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
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment service is not configured' },
        { status: 503 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Send donation data to your API
        await sendDonationToAPI(session);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function sendDonationToAPI(session: Stripe.Checkout.Session) {
  try {
    const metadata = session.metadata;
    const amount = session.amount_total || 0;

    const donationData = {
      donor_name: metadata?.donor_name || 'Anonymous',
      donor_email: metadata?.donor_email || '',
      amount: (amount / 100).toString(), // Convert from cents to dollars
      payment_method: metadata?.payment_method || 'card',
      purpose: metadata?.donation_purpose || 'general',
      recipient_name: metadata?.recipient_name || '',
      send_ecard: metadata?.send_ecard === 'true',
      recipient_email: metadata?.recipient_email || '',
      message: metadata?.message || '',
      stripe_session_id: session.id,
    };

    // Send to your donations API
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:8000'}/donations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers
        // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify(donationData),
    });

    if (!response.ok) {
      console.error('Failed to send donation to API:', await response.text());
    } else {
      console.log('Donation successfully sent to API');
    }
  } catch (error) {
    console.error('Error sending donation to API:', error);
  }
} 