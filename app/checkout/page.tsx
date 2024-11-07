'use client'
import React from "react";
import ShippingForm from "@/app/checkout/shippingForm";
import {PaymentOptions} from "@/app/checkout/paymentOptions";
import {Elements} from '@stripe/react-stripe-js'; 
import Cart from "./cart"
import {loadStripe} from '@stripe/stripe-js'; 

const stripePromise = loadStripe('STRIPE_API_KEY'); // replace this with the stripe API Key once we get one 

export default async function CheckoutPage() {
    return (
        <div className="min-h-screen">
            <main className="bg-white py-16 px-16">
                <h1 className="text-4xl font-bold text-green-600 mb-2 text-center w-full">Checkout</h1>
                <div className="lg:flex lg:flex-row">
                    <div className="flex-1">
                        <div className="p-8 border border-gray-200 bg-gray-100 rounded-lg m-8">
                            <ShippingForm/>
                        </div>
                        <div className="p-8 border border-gray-200 bg-gray-100 rounded-lg m-8">
                            <Elements stripe = {stripePromise}>
                                <PaymentOptions/>
                            </Elements>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <Cart/>
                    </div>
                </div>
            </main>
        </div>
    )
}