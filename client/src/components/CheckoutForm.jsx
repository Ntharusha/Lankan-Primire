import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

const CheckoutForm = ({ onSuccess, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + '/my-bookings',
                },
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message);
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            } else {
                setIsProcessing(false);
                setErrorMessage("Payment status: " + (paymentIntent?.status || "unknown"));
            }
        } catch {
            setErrorMessage("An unexpected error occurred.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border-white/10 bg-black/20">
                <h3 className="text-xl font-bold mb-4 text-white">Payment Method</h3>
                <p className="mb-6 text-gray-300 text-sm">Amount to Pay: <span className="font-bold text-white text-lg">Rs. {amount}</span></p>
                <PaymentElement id="payment-element" />
            </div>

            {errorMessage && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{errorMessage}</div>}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full py-4 bg-primary hover:bg-red-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/20"
            >
                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : `Pay Rs. ${amount}`}
            </button>
        </form>
    );
};

export default CheckoutForm;
