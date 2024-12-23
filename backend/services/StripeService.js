const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const fetchPrices = async () => {
  return await stripe.prices.list({
    active: true,
    expand: ['data.product'],
  });
};

const fetchSubscriptions = async (customerId, status = 'all') => {
  return await stripe.subscriptions.list({
    customer: customerId,
    status,
    expand: ['data.plan.product'],
  });
};

const createPortalSession = async (customerId) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL}/account`,
  });
};

const cancelSubscription = async (subscriptionId) => {
  return await stripe.subscriptions.cancel(subscriptionId);
};

module.exports = {
  fetchPrices,
  fetchSubscriptions,
  createPortalSession,
  cancelSubscription,
};
