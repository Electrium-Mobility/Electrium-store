'use client'
import React from "react";
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';

import ShippingForm from "@/app/checkout/shippingForm";
import Image from "next/image";
import {PaymentOptions} from "@/app/checkout/paymentOptions";
import Link from "next/link";
import {Bike, CheckoutBike} from '@/utils/getBike'

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

export default function Cart() {
    // temp, most likely get this stuff from session storage
    //const productIdList = ['1', '2']
    //const quantitiesList = [3, 5]
    //const orderTypesList = ['rent', 'sell']
    const [cart, setCart] = React.useState<CheckoutBike[]>((() => {
        var val = sessionStorage.getItem('cart')
        return val ? JSON.parse(val) : []; 
    })());
        /*{
            quantity: 1,
            orderType: 'rent',
            bike_id: 3,
            name: "biekee",
            description: "cool bike",
            image: null,
            amount_stocked: 5,
            rental_rate: 50,
            sell_price: 30,
            damage_rate: 20,
            for_rent: true
       },*/

    React.useEffect(() => {
        sessionStorage.setItem('cart', JSON.stringify(cart))
    }, [cart]);

    React.useEffect(() => {
        var val = sessionStorage.getItem('cart')
        if (val) {
            setCart(JSON.parse(val));
        }
    }, []);

    const subtotal: number = cart.reduce((acc: number, cur: CheckoutBike) => acc + (cur.orderType=='rent' ? 0 : cur.sell_price), 0)
    const shipping: number = 1 // TODO
    return (
        <div className="flex-1 p-8 border border-gray-200 bg-gray-100 rounded-lg m-8">
            <p className="font-bold text-xl pb-6">Items: {cart.length}</p>
            {cart.map((bike: CheckoutBike, i: number) => <ProductDisplay key={i} params={{ bike: bike }} />)
            }
            <div className="flex flex-row justify-between">
                <p className="text-gray-400">Subtotal:</p>
                <p className="text-gray-400">CA ${subtotal}</p>
            </div>
            <div className="flex flex-row justify-between">
                <p className="text-gray-400">Shipping: </p>
                <p className="text-gray-400">how do i calculate this?</p>
            </div>
            <hr className="border-t border-gray-200 m-4" />
            <div className="flex flex-row justify-between">
                <p className="text-green-600 font-bold">Order Total: </p>
                <p className="text-green-600 font-bold">CA ${subtotal + shipping}</p>
            </div>
        </div>
    )
}
