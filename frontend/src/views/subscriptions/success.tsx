"use client";
import { useState } from "react";
import axios from "axios";

const Success = () => {
    const [loading, setLoading] = useState(false);

    const handleManageBilling = async () => {
        try {
            setLoading(true);
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get("session_id");

            if (!sessionId) {
                alert("Session ID not found. Please try again.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/create-portal-session`,
                { customerId: 'cus_RRpKEh7at0YMnd' }
            );

            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error creating portal session:", error);
            alert("Failed to open the billing portal. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center border border-green-200">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    Subscription Successful!
                </h1>
                <p className="text-gray-700 text-lg">
                    Thank you for subscribing to our service. We're excited to have you on
                    board!
                </p>

                <div className="flex flex-col gap-4 mt-6">
                    <button
                        className="px-6 py-3 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600 transition duration-200"
                        onClick={() => (window.location.href = "/")}
                    >
                        Go to Homepage
                    </button>
                    <button
                        className={`px-6 py-3 text-lg rounded-lg ${loading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
                            }`}
                        onClick={handleManageBilling}
                        disabled={loading}
                    >
                        {loading ? "Opening Billing Portal..." : "Manage Billing"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Success;
