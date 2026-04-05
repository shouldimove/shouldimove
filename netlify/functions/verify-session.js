// Netlify Function: verify-session
// Called from activate.html after Stripe redirects back post-payment.
// Verifies the Stripe session is real and paid, then issues a Pro token.
//
// Required env vars in Netlify dashboard:
//   STRIPE_SECRET_KEY — from Stripe Dashboard → Developers → API Keys

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const SECRET = process.env.STRIPE_SECRET_KEY;

  if (!SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error.' }),
    };
  }

  let session_id;
  try {
    const body = JSON.parse(event.body || '{}');
    session_id = body.session_id;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  if (!session_id || !session_id.startsWith('cs_')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid session ID.' }) };
  }

  try {
    // Retrieve the checkout session from Stripe
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session_id)}?expand[]=subscription`,
      {
        headers: { 'Authorization': `Bearer ${SECRET}` },
      }
    );

    const session = await response.json();

    if (session.error) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Could not retrieve session: ' + session.error.message }),
      };
    }

    // Accept: paid sessions OR trialing subscriptions (no payment collected yet)
    const isPaid    = session.payment_status === 'paid';
    const isTrial   = session.subscription?.status === 'trialing';
    const isActive  = session.subscription?.status === 'active';

    if (!isPaid && !isTrial && !isActive) {
      return {
        statusCode: 402,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Payment not completed. Please try subscribing again.' }),
      };
    }

    // Issue a 35-day Pro token stored in the user's localStorage.
    // Token is base64-encoded JSON — readable client-side for expiry checks.
    // Note: a determined user can fake this token in their own browser.
    // That's acceptable for an early-stage product; upgrade to server-side
    // session verification later if needed.
    const email          = session.customer_details?.email || session.customer_email || '';
    const subscriptionId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id || '';
    const customerId     = session.customer || '';

    const payload = {
      email,
      customerId,
      subscriptionId,
      expires: Date.now() + (35 * 24 * 60 * 60 * 1000), // 35 days
      issuedAt: Date.now(),
    };

    const token = Buffer.from(JSON.stringify(payload)).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ token, email }),
    };

  } catch (err) {
    console.error('verify-session error:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Verification failed. Please contact support.' }),
    };
  }
};
