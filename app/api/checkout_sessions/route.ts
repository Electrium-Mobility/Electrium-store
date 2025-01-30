// app/api/checkout_sessions/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-10-28.acacia',
});

export async function POST() {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1QKpGRKI9cYTxOCimK0l1MEa',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/?success=true`,
            cancel_url: `${origin}/?canceled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.statusCode || 500 }
        );
    }
}