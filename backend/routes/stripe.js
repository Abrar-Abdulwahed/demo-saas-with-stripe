const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create a Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
    const { plan } = req.body; 
  
    // Map the plans to Stripe Price IDs
    const priceMap = {
      basic: 'prod_RRjsqbA79ajVzQ',   
      standard: 'prod_RRmlhECuCc762m',
    };
  
    const priceId = priceMap[plan];
  
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });
  
      res.json({ sessionId: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Handle Stripe Webhooks
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
        console.log('Checkout Session Completed:', event.data.object);
        break;
        case 'invoice.payment_failed':
        console.log('Payment Failed:', event.data.object);
        break;
        // Add more cases as needed
        default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});  

app.get('/get-prices', async (req, res) => {
    try {
        const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product'], // Expand to include product details
        });
        res.json(prices.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
