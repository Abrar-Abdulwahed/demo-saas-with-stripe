import React from 'react';
import getStripe from '@/lib/getStripe';

const CheckoutButton: React.FC<{ priceId: string }> = ({ priceId }) => {
    const handleClick = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId }),
        });

        const { sessionId } = await response.json();
        const stripe = await getStripe();
        await stripe?.redirectToCheckout({ sessionId });
    };

    return <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-200" onClick={handleClick}> Subscribe </button>;
};

export default CheckoutButton;