import { loadStripe, Stripe } from '@stripe/stripe-js';

export const stripePromise: Promise<Stripe | null> = loadStripe('your-publishable-key');
