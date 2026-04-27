// @desc    Mock processing a payment
// @route   POST /api/payment
// @access  Private
export const processPayment = async (req, res) => {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
        res.status(400).json({ message: 'Amount and OrderID are required' });
        return;
    }

    // Simulate processing time
    setTimeout(() => {
        res.json({
            success: true,
            message: 'Payment processed successfully (Mock)',
            paymentResult: {
                id: `PAY-${Date.now()}`,
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                email_address: req.user.email
            }
        });
    }, 1500);
};
