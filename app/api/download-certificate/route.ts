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

    // Generate a beautiful certificate HTML
    const certificateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Certificate of Honor</title>
        <style>
          body { 
            font-family: 'Georgia', serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
          }
          .certificate { 
            background: white; 
            border: 20px solid #4caf50; 
            padding: 60px; 
            max-width: 800px; 
            margin: 0 auto; 
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            position: relative;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid #4caf50;
            pointer-events: none;
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #4caf50; 
            margin-bottom: 20px;
            font-family: 'Arial', sans-serif;
          }
          .title { 
            font-size: 36px; 
            font-weight: bold; 
            color: #333; 
            margin: 30px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 40px;
          }
          .content {
            font-size: 16px;
            line-height: 1.8;
            color: #333;
            margin: 40px 0;
          }
          .dedication {
            font-size: 20px;
            font-weight: bold;
            color: #4caf50;
            margin: 30px 0;
            font-style: italic;
          }
          .amount {
            font-size: 24px;
            font-weight: bold;
            color: #4caf50;
            margin: 20px 0;
          }
          .date {
            font-size: 14px;
            color: #666;
            margin-top: 40px;
          }
          .footer {
            margin-top: 50px;
            font-size: 12px;
            color: #999;
          }
          .ornament {
            font-size: 24px;
            color: #4caf50;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="logo">EGR</div>
          
          <div class="ornament">❋ ❋ ❋</div>
          
          <div class="title">Certificate of Honor</div>
          
          <div class="subtitle">This certificate is presented in recognition of a generous donation</div>
          
          <div class="content">
            <p>This certificate acknowledges a charitable contribution of</p>
            <div class="amount">$${(session.amount_total! / 100).toFixed(2)}</div>
            <p>made to support environmental education and student projects worldwide.</p>
          </div>
          
          ${session.metadata?.recipient_name ? `
          <div class="dedication">
            ${session.metadata.dedication_purpose === 'memorial' ? 'In Memory Of' : 
              session.metadata.dedication_purpose === 'honor' ? 'In Honor Of' : 
              session.metadata.dedication_purpose === 'celebration' ? 'In Celebration Of' : 'Dedicated To'}<br>
            <strong>${session.metadata.recipient_name}</strong>
          </div>
          ` : ''}
          
          ${session.metadata?.message ? `
          <div class="content">
            <p><em>"${session.metadata.message}"</em></p>
          </div>
          ` : ''}
          
          <div class="content">
            <p>This contribution will help empower students to create environmental change and build a sustainable future for our planet.</p>
          </div>
          
          <div class="ornament">❋ ❋ ❋</div>
          
          <div class="date">
            Presented on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          <div class="footer">
            <p>EGR | Educating Global Resilience</p>
            <p>Transaction ID: ${sessionId}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Return the certificate as HTML (in production, you'd convert this to PDF)
    return new NextResponse(certificateHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
} 