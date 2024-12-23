const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.get('/get-prices', async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    res.json(prices.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/is-subscribed/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
    });

    const isSubscribed = subscriptions.data.length > 0;

    res.json({ isSubscribed });
  } catch (err) {
    res.status(500).json({ error: "Failed to check subscription status" });
  }
});

router.post('/create-checkout-session', async (req, res) => {
  const { priceId, customerId } = req.body;
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
  });

  // Check if there is an active subscription
  if (subscriptions.data.length > 0) {
    return res.status(400).json({
      message: 'You already have an active subscription. Please wait until the current billing period ends.',
    });
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId, 
      billing_address_collection: 'auto',
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
    res.json({ sessionId: session.id, customerId: session.customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create-portal-session', async (req, res) => {
    try {
      const { customerId } = req.body;
  
      if (!customerId) {
        return res.status(400).json({ error: 'Customer ID is required' });
      }
  
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.FRONTEND_URL}/account`,
      });
  
      res.json({ url: portalSession.url });
    } catch (err) {
      console.error('Error creating portal session:', err.message);
      res.status(500).json({ error: 'Failed to create portal session' });
    }
  });
  

  
router.get('/get-subscriptions/:customerId', async (req, res) => {
    const { customerId } = req.params;
  
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.plan.product'],
      });
  
      res.json(subscriptions.data);
    } catch (err) {
      console.error('Error fetching subscriptions:', err.message);
      res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

router.post('/cancel-subscription', async (req, res) => {
const { subscriptionId } = req.body;

try {
    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

    res.json(canceledSubscription);
} catch (err) {
    console.error('Error canceling subscription:', err.message);
    res.status(500).json({ error: 'Failed to cancel subscription' });
}
});
  
// router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
//   let event;

//   try {
//     const signature = req.headers['stripe-signature'];
//     event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
//   } catch (err) {
//     console.error('⚠️  Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Process the event
//   switch (event.type) {
//     case 'customer.subscription.created':
//       handleSubscriptionCreated(event.data.object);
//       break;
//     case 'customer.subscription.updated':
//       handleSubscriptionUpdated(event.data.object);
//       break;
//     case 'customer.subscription.deleted':
//       handleSubscriptionDeleted(event.data.object);
//       break;
//     case 'customer.subscription.trial_will_end':
//       handleSubscriptionTrialEnding(event.data.object);
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// });

// Event Handlers
const handleSubscriptionCreated = (subscription) => {
  console.log(`Subscription created: ${subscription.id}`);
  // Store subscription details in your database
};

const handleSubscriptionUpdated = (subscription) => {
  console.log(`Subscription updated: ${subscription.id}`);
  // Update subscription details in your database
};

const handleSubscriptionDeleted = (subscription) => {
  console.log(`Subscription deleted: ${subscription.id}`);
  // Mark the subscription as canceled in your database
};

const handleSubscriptionTrialEnding = (subscription) => {
  console.log(`Subscription trial ending: ${subscription.id}`);
  // Notify the customer that the trial is about to end
};


module.exports = router;
