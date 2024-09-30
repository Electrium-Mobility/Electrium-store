import React from "react";
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';

import ShippingForm from "@/app/checkout/shippingForm";
import {Bike, getManyBikes} from "@/utils/getBike";
import {notFound} from "next/navigation";
import Image from "next/image";
import {PaymentOptions} from "@/app/checkout/paymentOptions";
import Link from "next/link";

interface CheckoutBike extends Bike {
    quantity: number;
    orderType: string;
}

function ProductDisplay({params}: { params: { bike: CheckoutBike }}){
    const  bike = params.bike


    return (
        <Link href={`/products/${bike.bike_id}`}>
            <div className="grid grid-cols-[30%_70%] pb-4">
                <Image
                    src={bike.image || '/img/placeholder.png'}
                    alt={bike.name}
                    unoptimized
                    width={250}
                    height={250}
                    className="rounded-lg object-contain bg-white border border-gray-200 p-2"
                />
                <div className="m-2 mx-8">
                    <h2 className="text-lg font-bold text-gray-800">{bike.name}</h2>
                    <p className="font-bold text-gray-800">
                        {bike.orderType=='rent'
                            ? `CA $${bike.rental_rate.toFixed(2)} per hour`
                            : `CA $${bike.sell_price.toFixed(2)}`
                        }
                    </p>
                    <p className="text-gray-400 mb-6">Quantity: {bike.quantity}</p>
                </div>
        </div>
        </Link>
    )
}


export default async function CheckoutPage() {
    // temp, most likely get this stuff from session storage
    const productIdList = ['1', '2']
    const quantitiesList = [3, 5]
    const orderTypesList = ['rent', 'sell']

    let bikes = await getManyBikes(productIdList)
    if (!bikes) {
        notFound();
    }

    let checkoutBikes: CheckoutBike[] = bikes.map((bike, i)=> ({...bike, quantity: quantitiesList[i], orderType: orderTypesList[i]}))
    const subtotal: number = checkoutBikes.reduce((acc: number, cur: CheckoutBike) => acc + (cur.orderType=='rent' ? 0 : cur.sell_price), 0)
    const shipping: number = 1

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
                        <div className="flex-1 p-8 border border-gray-200 bg-gray-100 rounded-lg m-8">
                            <p className="font-bold text-xl pb-6">Items: {productIdList.length}</p>
                            {checkoutBikes.map((bike, i) => <ProductDisplay key={i} params={{bike: bike}}/>)
                            }
                            <div className="flex flex-row justify-between">
                                <p className="text-gray-400">Subtotal:</p>
                                <p className="text-gray-400">CA ${subtotal}</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p className="text-gray-400">Shipping: </p>
                                <p className="text-gray-400">how do i calculate this?</p>
                            </div>
                            <hr className="border-t border-gray-200 m-4"/>
                            <div className="flex flex-row justify-between">
                                <p className="text-green-600 font-bold">Order Total: </p>
                                <p className="text-green-600 font-bold">CA ${subtotal + shipping}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}