// server.js (Node.js/Express example)
const express = require('express');
const stripe = require('stripe')('your_secret_test_key');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount * 100, // Convert to cents
            currency: 'usd',
            // For testing, use one of Stripe's test card numbers
            // e.g., 4242 4242 4242 4242
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
