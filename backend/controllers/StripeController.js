const stripe = require('../config/stripe');
const stripeService = require('../services/StripeService');

exports.getPrices = async (req, res) => {
  try {
    const prices = await stripeService.fetchPrices();
    res.json(prices.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.isSubscribed = async (req, res) => {
  const { customerId } = req.params;

  try {
    const subscriptions = await stripeService.fetchSubscriptions(customerId, 'active');
    const isSubscribed = subscriptions.data.length > 0;

    res.json({ isSubscribed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
};

exports.createCheckoutSession = async (req, res) => {
  const { priceId, customerId } = req.body;

  try {
    const subscriptions = await stripeService.fetchSubscriptions(customerId, 'active');

    if (subscriptions.data.length > 0) {
      return res.status(400).json({
        message: 'You already have an active subscription.',
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      billing_address_collection: 'auto',
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPortalSession = async (req, res) => {
    const { customerId } = req.body;
  
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }
  
    try {
      const portalSession = await stripeService.createPortalSession(customerId);
      res.json({ url: portalSession.url });
    } catch (err) {
      console.error('Error creating portal session:', err.message);
      res.status(500).json({ error: 'Failed to create portal session' });
    }
  };

exports.getSubscriptions = async (req, res) => {
    const { customerId } = req.body;

    try {
        const subscriptions = await stripeService.fetchSubscriptions(customerId, 'all');
        res.json(subscriptions.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
};

exports.cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.body;

  try {
    const canceledSubscription = await stripeService.cancelSubscription(subscriptionId);
    res.json(canceledSubscription);
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};
