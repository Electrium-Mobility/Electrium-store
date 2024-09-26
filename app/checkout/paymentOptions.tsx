'use client'
import Image from 'next/image';
import PayPalLogo from '@/public/img/PayPal.svg'
import React from "react";

export function PaymentOptions() {
    return(
        <>
            <p className="font-bold text-xl pb-2">Payment Options</p>
            <button className="w-full bg-white border border-gray-200 h-10 rounded-md px-4 flex flex-row justify-center items-center">
                <Image src={PayPalLogo} alt="PayPal" width={90} height={20} className="contain"/>
            </button>
            <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold h-10 rounded-lg py-2 px-4 mt-4">
                Buy Now
            </button>
        </>
    )
}