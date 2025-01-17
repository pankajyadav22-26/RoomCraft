const stripe = require('stripe')('sk_test_51Pk7TjDNxCaue7GcAloDIjkkO9zuHZJI0usBxqQ7UeklcErFH5KJuUQynQmLkcSjuV0gYL5HlrHV8MQIzNbeSHLa00800z3EMd');

module.exports = {
    paymentSheetCreater: async (req, res) => {
        try {
            const amount = req.body.amount;

            if (!amount || amount <= 0) {
                return res.status(400).json({ error: 'Invalid amount' });
            }

            const customer = await stripe.customers.create();

            const ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customer.id },
                { apiVersion: '2024-06-20' }
            );

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'inr',
                customer: customer.id,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.json({
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: 'pk_test_51Pk7TjDNxCaue7GcjYIcYlFNXHCFMsuZ5pgdNaTmt22EDVRSA6JRCjkx4n9IZvGnYHJVNdy9TcqykyxxQlfNdAlW00F7jRNbta'
            });
        } catch (error) {
            console.error("Error creating payment sheet:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}