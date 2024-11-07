'use client'
import Image from 'next/image';
import PayPalLogo from '@/public/img/PayPal.svg'
import React from "react";
import {useState} from 'react'; 
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'; 


export function PaymentOptions() {
    const stripe = useStripe(); 
    const elements = useElements(); 
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    
    // note that the backend route has been created using express, please let Umar know if there are any problems with this 
    async function handleSubmit(e: any) { // simple event handler function for submitting the form 
        e.preventDefault(); 
        setPaymentProcessing(true); 
        const cardElement = elements.getElement(CardElement); // just ignore this error
        const response = await fetch('/create-payment-intent', { 
            method: "POST", 
            headers: {"Content-Type" : "application/json"}, 
            body: JSON.stringify({amount: 1000})
        });

        const {clientSecret} = await response.json(); 
        const paymentResult = await stripe.confirmCardPayment(clientSecret, { // just ignore this error, this is to do with the fact that the variable is imported 
            payment_method: {card: cardElement} // ignore this error for the same reasons given above 
        }); 
        setPaymentProcessing(false); 
        if (paymentResult.error) {
            console.error(paymentResult.error); 
        } else {
            console.log('Payment successful!');
        }; 
    };

    return(
       <>
            <p className="font-bold text-xl pb-2">Payment Options</p>
            <button className="w-full bg-white border border-gray-200 h-10 rounded-md px-4 flex flex-row justify-center items-center">
                <Image src={PayPalLogo} alt="PayPal" width={90} height={20} className="contain"/>
            </button>
            <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold h-10 rounded-lg py-2 px-4 mt-4">
                Buy Now
            </button>
            <br />
            <form onSubmit={handleSubmit}>
                <CardElement />
                <button type="submit" disabled={!stripe || paymentProcessing}>
                {paymentProcessing ? "Processing..." : "Pay Now"}
                </button>
            </form>
        </>
    ); 
}; 