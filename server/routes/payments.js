const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

// Mock payment - Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        // Generate a mock payment intent
        const mockPaymentIntent = {
            id: `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            client_secret: `pi_mock_secret_${Date.now()}`,
            amount: amount * 100,
            currency: 'lkr',
            status: 'requires_payment_method',
            metadata: { bookingId }
        };

        // Update booking with payment intent ID if provided
        if (bookingId) {
            await Booking.findByIdAndUpdate(bookingId, {
                paymentIntentId: mockPaymentIntent.id
            });
        }

        console.log('✅ Mock payment intent created:', mockPaymentIntent.id);

        res.send({
            clientSecret: mockPaymentIntent.client_secret,
            paymentIntentId: mockPaymentIntent.id
        });
    } catch (error) {
        console.error("Mock Payment Intent Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Mock payment - Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        // Simulate payment confirmation
        const mockConfirmation = {
            id: paymentIntentId,
            status: 'succeeded',
            amount_received: req.body.amount * 100,
            currency: 'lkr'
        };

        console.log('✅ Mock payment confirmed:', paymentIntentId);

        res.send(mockConfirmation);
    } catch (error) {
        console.error("Mock Payment Confirmation Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
