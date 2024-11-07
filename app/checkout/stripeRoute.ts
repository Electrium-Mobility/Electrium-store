// custom API to create a payment intent for Stripe 
// not too sure if this will work until we have access to the stripe key
// please test if you have that 
const express = require('express');  
const bodyParser = require('body-parser'); 
const stripe = require('stripe')('STRIPE_API_KEY'); // paste the api key here later 
const app = express(); 

// post route to stripe
app.post('/create-payment-intent', async (req: { body: { amount: any; }; }, res: { send: (arg0: { clientSecret: any; }) => void; }) => {
    const {amount} = req.body; // get the payment amount from the request's body 

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'cad', 
            automatic_payment_methods: {enabled: true}
        }); 

        res.send({clientSecret: paymentIntent.client_secret}); 
    } catch (err) {
        console.log(err); 
    }
});

app.listen(69, () => console.log('Server route started successfully')); // 69 = funny lol