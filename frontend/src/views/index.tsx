"use client"
import { stripePromise } from '../utils/stripe';

const Home = () => {
  const handleCheckout = async (priceId: string) => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error('Stripe failed to initialize.');
      return;
    }

    // Create a checkout session via the backend
    const res = await fetch('http://localhost:5000/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    const { url } = await res.json();

    if (url) {
      window.location.href = url; // Redirect to Stripe Checkout
    } else {
      console.error('Failed to get a checkout URL');
    }
  };

  return (
    <div>
      <h1>Subscribe to a Plan</h1>
      <button onClick={() => handleCheckout('price_xxx')}>Basic Plan - $10/month</button>
      <button onClick={() => handleCheckout('price_yyy')}>Pro Plan - $20/month</button>
    </div>
  );
};

export default Home;
