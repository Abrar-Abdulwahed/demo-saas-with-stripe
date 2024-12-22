"use client";
import React, { useState, useEffect } from 'react';
import CheckoutButton from '@/components/CheckoutButton';

const fetchPrices = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-prices`);
    if (!res.ok) throw new Error('Failed to fetch prices');
    return res.json();
};

const SubscriptionsPage = () => {
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month'); // Default to monthly
    const [plans, setPlans] = useState<any[]>([]); // Store plans fetched from the backend
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const loadPrices = async () => {
            try {
                const prices = await fetchPrices();

                // Group prices by product and categorize by interval
                const groupedPlans = prices.reduce((acc: any, price: any) => {
                    const product = acc[price.product.id] || { ...price.product, prices: {} };
                    product.prices[price.recurring.interval] = price;
                    acc[price.product.id] = product;
                    return acc;
                }, {});

                setPlans(Object.values(groupedPlans));
                setLoading(false); // Finish loading
            } catch (error) {
                console.error('Error fetching plans:', error);
                setLoading(false); // Finish loading even on error
            }
        };

        loadPrices();
    }, []); // Fetch prices only once on component mount

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-700 text-lg">Loading plans...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Choose Your Plan</h1>

            {/* Switcher for Billing Interval */}
            <div className="flex space-x-4 mb-8">
                <button
                    className={`px-4 py-2 rounded-lg ${billingInterval === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => setBillingInterval('month')}
                >
                    Monthly
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${billingInterval === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => setBillingInterval('year')}
                >
                    Yearly
                </button>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center border border-gray-200"
                    >
                        <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
                        <p className="text-gray-600 mt-2">
                            <span className="text-2xl font-bold text-gray-900">
                                ${plan.prices[billingInterval]?.unit_amount / 100 || 'N/A'}
                            </span>{' '}
                            / {billingInterval}
                        </p>
                        {plan.prices[billingInterval] ? (
                            <CheckoutButton priceId={plan.prices[billingInterval].id} />
                        ) : (
                            <p className="text-red-500 mt-2">No pricing available for this interval</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionsPage;
