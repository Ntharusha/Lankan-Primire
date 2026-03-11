import React, { useState } from 'react';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import apiClient from '../services/api';

const MockCheckoutForm = ({ onSuccess, amount, clientSecret }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);
        setErrorMessage(null);

        // Simulate payment processing delay
        setTimeout(async () => {
            try {
                // Extract payment intent ID from client secret
                const paymentIntentId = clientSecret.split('_secret_')[0];

                // Confirm the mock payment
                const response = await apiClient.post('/payments/confirm-payment', {
                    paymentIntentId,
                    amount
                });

                // Create a mock payment intent object
                const mockPaymentIntent = {
                    id: response.id,
                    status: 'succeeded',
                    amount: amount * 100,
                    currency: 'lkr'
                };

                onSuccess(mockPaymentIntent);
            } catch {
                setErrorMessage("Payment failed. Please try again.");
                setIsProcessing(false);
            }
        }, 1500); // 1.5 second delay to simulate processing
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border-white/10 bg-black/20">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-white">Payment Details</h3>
                </div>

                <p className="mb-6 text-gray-300 text-sm">
                    Amount to Pay: <span className="font-bold text-white text-lg">Rs. {amount}</span>
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Card Number
                        </label>
                        <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                            maxLength="19"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (value.length >= 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                    }
                                    setExpiryDate(value);
                                }}
                                maxLength="5"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                CVV
                            </label>
                            <input
                                type="text"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                maxLength="3"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span>Your payment information is secure (Test Mode)</span>
                </div>
            </div>

            {errorMessage && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-primary hover:bg-red-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/20"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="animate-spin mr-2" />
                        Processing Payment...
                    </>
                ) : (
                    `Pay Rs. ${amount}`
                )}
            </button>

            <p className="text-center text-xs text-gray-500">
                💡 Test Mode: Use any card number (e.g., 4242 4242 4242 4242)
            </p>
        </form>
    );
};

export default MockCheckoutForm;
