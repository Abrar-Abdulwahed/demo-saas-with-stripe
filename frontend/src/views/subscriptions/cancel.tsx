"use client"
const Cancel = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center border border-red-200">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
                Subscription Canceled
            </h1>
            <p className="text-gray-700 text-lg">
                You have canceled the subscription process. If this was a mistake, you can try subscribing again.
            </p>
            <button
                className="mt-6 px-6 py-3 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600 transition duration-200"
                onClick={() => window.location.href = '/subscriptions'}
            >
                Go Back to Plans
            </button>
        </div>
    </div>
);

export default Cancel;
