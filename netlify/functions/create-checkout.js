// Netlify Function: create-checkout
// Called when user clicks "Start Trial" in the Pro modal.
// Creates a Stripe Checkout session and returns the URL to redirect to.
//
// Required env vars in Netlify dashboard:
//   STRIPE_SECRET_KEY  — from Stripe Dashboard → Developers → API Keys
//   STRIPE_PRICE_ID    — from Stripe Dashboard → Products → Should I Move Pro → Price ID

exports.handler = async (event) => {
  // Allow CORS preflight
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

  const SECRET   = process.env.STRIPE_SECRET_KEY;
  const PRICE_ID = process.env.STRIPE_PRICE_ID;

  if (!SECRET || !PRICE_ID) {
    console.error('Missing env vars: STRIPE_SECRET_KEY or STRIPE_PRICE_ID');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error. Please contact support.' }),
    };
  }

  try {
    const params = new URLSearchParams({
      mode: 'subscription',
      'payment_method_types[0]': 'card',
      'line_items[0][price]': PRICE_ID,
      'line_items[0][quantity]': '1',
      'subscription_data[trial_period_days]': '7',
      success_url: 'https://shouldimoveapp.com/activate.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://shouldimoveapp.com/',
      // Collect email during checkout so we can verify subscriptions later
      customer_creation: 'always',
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await response.json();

    if (session.error) {
      console.error('Stripe error:', session.error);
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: session.error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ url: session.url }),
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};
