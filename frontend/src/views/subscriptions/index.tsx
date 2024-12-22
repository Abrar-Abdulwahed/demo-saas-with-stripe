"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CheckoutButton from "@/components/CheckoutButton";

const fetchPrices = async () => {
  const res = await axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/get-prices`)
    .then()
    .catch(() => {
      throw new Error("Failed to fetch prices");
    });
  return res.data;
};

const fetchUserSubscriptions = async (customerId: string) => {
  const res = await axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/get-subscriptions/${customerId}`)
    .then()
    .catch(() => {
      throw new Error("Failed to fetch subscriptions");
    });
  return res.data;
};

const Subscriptions = () => {
  const [billingInterval, setBillingInterval] = useState<string>("month");
  const [plans, setPlans] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const customerId = "cus_RRrCyKHYt4cX6f"; 
  useEffect(() => {
    const loadPricesAndSubscriptions = async () => {
      try {
        const prices = await fetchPrices();
        const userSubscriptions = await fetchUserSubscriptions(customerId);

        const groupedPlans = prices.reduce((acc: any, price: any) => {
          const product = acc[price.product.id] || { ...price.product, prices: {} };
          product.prices[price.recurring.interval] = price;
          acc[price.product.id] = product;
          return acc;
        }, {});

        setPlans(Object.values(groupedPlans));
        setSubscriptions(userSubscriptions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    loadPricesAndSubscriptions();
  }, [customerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Loading plans...</p>
      </div>
    );
  }

  const isCurrentPlan = (productId: string, interval: string) => {
    return subscriptions.some(
      (subscription) =>
        subscription.plan.product.id === productId &&
        subscription.plan.interval === interval
    );
  };

  const isSamePlanDifferentInterval = (productId: string, interval: string) => {
    return subscriptions.some(
      (subscription) =>
        subscription.plan.product.id === productId &&
        subscription.plan.interval !== interval
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Choose Your Plan</h1>

      {/* Switcher for Billing Interval */}
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-4 py-2 rounded-lg ${billingInterval === "month" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setBillingInterval("month")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${billingInterval === "year" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setBillingInterval("year")}
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
                ${plan.prices[billingInterval]?.unit_amount / 100 || "N/A"}
              </span>{" "}
              / {billingInterval}
            </p>
            {isCurrentPlan(plan.id, billingInterval) ? (
              <p className="mt-4 text-lg text-gray-600 font-semibold">Current Plan</p>
            ) : isSamePlanDifferentInterval(plan.id, billingInterval) ? (
              <button
                className="mt-4 px-6 py-3 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600 transition duration-200"
                onClick={() =>
                  alert(
                    "You are switching to a different billing interval. Add functionality for switching here."
                  )
                }
              >
                Switch
              </button>
            ) : plan.prices[billingInterval] ? (
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

export default Subscriptions;
