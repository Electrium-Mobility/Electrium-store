// pages/api/create-checkout-session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables.');
}

// @ts-ignore
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-10-28.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID of the product you want to sell
            price: 'price_1QKoSZKI9cYTxOCiMg4sAesr',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });

      // Ensure session.url is defined
      if (session.url) {
        res.redirect(303, session.url);
      } else {
        res.status(500).json({ error: 'Session URL is undefined' });
      }
    } catch (err: any) {
      console.error(err);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}