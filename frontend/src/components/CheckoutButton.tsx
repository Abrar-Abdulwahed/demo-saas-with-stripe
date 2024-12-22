import React from 'react';
import axios from "axios";
import getStripe from '@/lib/getStripe';

const CheckoutButton: React.FC<{ priceId: string }> = ({ priceId }) => {
    const handleCheckout = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/create-checkout-session`,
                { priceId, customerId: 'cus_RRpKEh7at0YMnd' },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const { sessionId } = response.data;
            const stripe = await getStripe();
            await stripe?.redirectToCheckout({ sessionId });
        } catch (error: any) {
            console.error('Error creating checkout session:', error);
            alert(error.response.data.message);
        }
    };

    return <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-200" onClick={handleCheckout}> Subscribe </button>;
};

export default CheckoutButton;