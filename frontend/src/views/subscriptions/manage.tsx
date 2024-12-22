"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Manage = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const customerId = 'cus_RRpKEh7at0YMnd';
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/get-subscriptions/${customerId}`
                );

                setSubscriptions(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    const handleCancel = async (subscriptionId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/cancel-subscription`, {
                subscriptionId,
            });
            alert('Subscription canceled successfully');
            setSubscriptions((prev) => prev.filter((sub) => sub.id !== subscriptionId));
        } catch (error) {
            console.error('Error canceling subscription:', error);
            alert('Failed to cancel subscription');
        }
    };

    const handleRefund = async (chargeId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/refund`, { chargeId });
            alert('Refund processed successfully');
        } catch (error) {
            console.error('Error processing refund:', error);
            alert('Failed to process refund');
        }
    };

    if (loading) {
        return <p>Loading subscriptions...</p>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Manage Subscriptions</h1>
            {subscriptions.map((sub) => (
                <div
                    key={sub.id}
                    className="bg-white p-4 mb-4 rounded-lg shadow-md border border-gray-200"
                >
                    <h2 className="text-lg font-semibold">{sub.plan.product.name}</h2>
                    <p>Status: {sub.status}</p>
                    <p>
                        Price: ${(sub.plan.amount / 100).toFixed(2)} / {sub.plan.interval}
                    </p>
                    <p>Start Date: {new Date(sub.start_date * 1000).toLocaleDateString()}</p>

                    {sub.status === 'active' && (
                        <button
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                            onClick={() => handleCancel(sub.id)}
                        >
                            Cancel Subscription
                        </button>
                    )}

                    {sub.latest_invoice?.payment_intent?.charges?.data?.[0]?.id && (
                        <button
                            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg ml-4"
                            onClick={() =>
                                handleRefund(sub.latest_invoice.payment_intent.charges.data[0].id)
                            }
                        >
                            Request Refund
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Manage;
