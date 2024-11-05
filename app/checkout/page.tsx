import React from "react";
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';

import ShippingForm from "@/app/checkout/shippingForm";
import Image from "next/image";
import {PaymentOptions} from "@/app/checkout/paymentOptions";
import Link from "next/link";

import Cart from "./cart"

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
                                <PaymentOptions/>
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