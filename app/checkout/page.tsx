"use client";
import React, { useState } from "react";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import ShippingForm from "@/app/checkout/shippingForm";
import { PaymentOptions } from "@/app/checkout/paymentOptions";
import Cart from "./cart";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import useSessionStorage from "@/utils/useSessionStorage";
import { CheckoutBike } from "@/utils/getBike";

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cartText = useSessionStorage("cart");
  const cart = cartText ? JSON.parse(cartText) : [];

  const subtotal = cart.reduce(
    (acc: number, cur: CheckoutBike) =>
      acc + (cur.orderType === "rent" ? 0 : cur.sell_price * cur.quantity),
    0
  );
  const shipping = 10; // Fixed shipping cost for now
  const total = subtotal + shipping;

  const [shippingInfo, setShippingInfo] = useState({
    email: "" /* ...other fields */,
  });

  const handlePaymentSuccess = async (paymentDetails: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log("[Checkout] Sending order confirmation email...");
      // 1. Send the order confirmation email and await the result
      const emailRes = await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: shippingInfo.email,
          order: {
            items: cart,
            total: total,
          },
        }),
      });

      if (!emailRes.ok) {
        // Optionally handle email send failure (show a warning, etc.)
        console.error("[Checkout] Order confirmation email failed to send.");
      } else {
        console.log("[Checkout] Order confirmation email sent!");
      }

      // 2. Continue with your payment logic (e.g., save order, clear cart, redirect)
      // If you have a payment API, call it here (or skip if not needed)
      // const response = await fetch("/api/payment", ...);
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.error || "Payment processing failed");

      // 3. Only redirect after all async work is done
      sessionStorage.removeItem("cart");
      window.location.href = `/order-success/12345`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during payment processing"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600">
            Please add items to your cart before proceeding to checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="bg-white py-16 px-16">
        <h1 className="text-4xl font-bold text-green-600 mb-2 text-center w-full">
          Checkout
        </h1>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="lg:flex lg:flex-row">
          <div className="flex-1">
            <div className="p-8 border border-gray-200 bg-gray-100 rounded-lg m-8">
              <ShippingForm onChange={setShippingInfo} />
            </div>
            <div className="p-8 border border-gray-200 bg-gray-100 rounded-lg m-8">
              <PaymentOptions
                total={total}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                email={shippingInfo.email}
              />
            </div>
          </div>
          <div className="flex-1">
            <Cart />
          </div>
        </div>
      </main>
    </div>
  );
}
