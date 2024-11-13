// pages/api/webhooks.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import Cors from 'micro-cors';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
}

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-10-28.acacia", // Update to the latest API version
});

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'] as string | string[] | undefined;

    if (!signature) {
      res.status(400).send('Missing Stripe signature');
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
          buf,
          Array.isArray(signature) ? signature[0] : signature,
          webhookSecret
      );
    } catch (err: any) {
      console.error(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent status: ${paymentIntent.status}`);
        // TODO: Handle successful payment here
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
            `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
        );
        // TODO: Handle failed payment here
        break;
      }
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge id: ${charge.id}`);
        // TODO: Handle successful charge here
        break;
      }
      default:
        console.warn(`Unhandled event type: ${event.type}`);
        break;
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};


export default webhookHandler;