import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: Request) {
  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount } = body;

    console.log("Creating payment intent for amount:", amount);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "cad",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log("Payment intent created successfully:", paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);

    // More detailed error information
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Payment intent creation failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 }
    );
  }
}
