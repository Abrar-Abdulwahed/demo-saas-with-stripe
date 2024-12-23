const express = require('express');
const stripe = require('../config/stripe');
const stripeController = require('../controllers/StripeController');
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

router.get('/is-subscribed/:customerId', stripeController.isSubscribed);

router.post('/create-checkout-session', stripeController.createCheckoutSession);

router.post('/create-portal-session', stripeController.createPortalSession);
  
router.get('/get-subscriptions/:customerId', stripeController.getSubscriptions);

router.post('/cancel-subscription', stripeController.cancelSubscription);
  
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
