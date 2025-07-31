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

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Fetch the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Generate a simple HTML receipt (in a real app, you'd use a PDF library like puppeteer or jsPDF)
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Donation Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #4caf50; }
          .receipt { border: 1px solid #ddd; padding: 30px; max-width: 600px; margin: 0 auto; }
          .amount { font-size: 24px; font-weight: bold; color: #4caf50; }
          .details { margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin: 10px 0; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">EGR</div>
            <h1>Donation Receipt</h1>
            <p>Thank you for your generous contribution</p>
          </div>
          
          <div class="details">
            <div class="row">
              <strong>Date:</strong>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
            <div class="row">
              <strong>Transaction ID:</strong>
              <span>${sessionId}</span>
            </div>
            <div class="row">
              <strong>Amount:</strong>
              <span class="amount">$${(session.amount_total! / 100).toFixed(2)}</span>
            </div>
            <div class="row">
              <strong>Payment Method:</strong>
              <span>Credit Card</span>
            </div>
            ${session.metadata?.recipient_name ? `
            <div class="row">
              <strong>Dedicated To:</strong>
              <span>${session.metadata.recipient_name}</span>
            </div>
            ` : ''}
            ${session.metadata?.dedication_purpose ? `
            <div class="row">
              <strong>Purpose:</strong>
              <span>${session.metadata.dedication_purpose}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>This receipt serves as proof of your charitable donation to EGR.</p>
            <p>Your contribution supports environmental education and student projects worldwide.</p>
            <p>For questions, contact: support@globalclassrooms.org</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // For now, return HTML (in production, you'd convert this to PDF)
    return new NextResponse(receiptHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
} 