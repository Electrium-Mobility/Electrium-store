"use client";
import Image from "next/image";
import PayPalLogo from "@/public/img/PayPal.svg";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

// Add debugging
console.log(
  "Stripe publishable key:",
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Present" : "Missing"
);

interface PaymentOptionsProps {
  total: number;
  onPaymentSuccess: (details: any) => void;
  onPaymentError: (error: string) => void;
  email: string;
}

function CheckoutForm({
  total,
  onPaymentSuccess,
  onPaymentError,
  email,
}: PaymentOptionsProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            // Do NOT provide return_url here for manual handling
          },
          redirect: "if_required", // or "never" for full manual
        }
      );

      if (submitError) {
        setErrorMessage(submitError.message || "An error occurred");
        onPaymentError(submitError.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Calling onPaymentSuccess from CheckoutForm");
        onPaymentSuccess({
          status: "succeeded",
          id: paymentIntent.id,
          method: "stripe",
        });
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred");
      onPaymentError("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement />
      {errorMessage && (
        <div className="text-red-600 mt-4 text-sm">{errorMessage}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full mt-4 py-2 px-4 rounded-lg text-white font-bold ${
          !stripe || isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {isProcessing ? "Processing..." : `Pay CA $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

export function PaymentOptions({
  total,
  onPaymentSuccess,
  onPaymentError,
  email,
}: PaymentOptionsProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">(
    "stripe"
  );

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    console.log("Creating payment intent for amount:", total);

    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    })
      .then((res) => {
        console.log("Payment intent response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Payment intent response:", data);
        if (data.error) {
          throw new Error(data.error);
        }
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error("Payment intent error:", err);
        onPaymentError(`Failed to initialize payment system: ${err.message}`);
      });
  }, [total, onPaymentError]);

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#059669",
    },
  };

  return (
    <>
      <p className="font-bold text-xl pb-2">Payment Options</p>

      <div className="mb-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setPaymentMethod("stripe")}
            className={`flex-1 py-2 px-4 rounded-lg border ${
              paymentMethod === "stripe"
                ? "border-green-600 bg-green-50"
                : "border-gray-200"
            }`}
          >
            Credit Card
          </button>
          <button
            onClick={() => setPaymentMethod("paypal")}
            className={`flex-1 py-2 px-4 rounded-lg border ${
              paymentMethod === "paypal"
                ? "border-green-600 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <Image
              src={PayPalLogo}
              alt="PayPal"
              width={90}
              height={20}
              className="mx-auto"
            />
          </button>
        </div>

        {paymentMethod === "stripe" &&
          clientSecret &&
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance,
              }}
            >
              <CheckoutForm
                total={total}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                email={email}
              />
            </Elements>
          )}

        {paymentMethod === "stripe" &&
          (!clientSecret ||
            !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                  ? "Stripe is not configured. Please check your environment variables."
                  : "Loading payment system..."}
              </p>
              {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
                <p className="text-sm text-gray-500">
                  Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in environment
                  variables
                </p>
              )}
            </div>
          )}

        {paymentMethod === "paypal" && (
          <div className="text-center py-4">
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                currency: "CAD",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  if (!actions.order) {
                    return Promise.reject(
                      new Error("PayPal actions.order is undefined")
                    );
                  }
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          value: total.toFixed(2),
                          currency_code: "CAD",
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  if (!actions.order) return;
                  const details = await actions.order.capture();
                  onPaymentSuccess({
                    ...details,
                    method: "paypal",
                  });
                }}
                onError={(err) => {
                  onPaymentError("PayPal payment failed");
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Secure payment powered by Stripe</p>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </>
  );
}
