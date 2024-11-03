import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import {Bike, getOneBike} from "@/utils/getBike";
import {notFound} from "next/navigation";
import { GetServerSideProps } from 'next';

function CartNotification({bike, subtotal, quantity, numItems}: {
    bike: Bike,
    subtotal: number,
    quantity: number,
    numItems: number
}) {
        return (
            <div className="w-80 absolute mt-24 right-6 rounded-3xl bg-gray-50  space-y-7 flex-col align-center rounded-xl p-6 drop-shadow-lg">
                <h1 className="text-base font-bold">Your Shopping Cart</h1>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row justify-self-start text-sm">Subtotal: &nbsp;<div className="font-semibold"> CA${subtotal}</div></div>
                    <div className="flex flex-row justify-self-end text-sm"><div className="font-semibold">{numItems}</div>&nbsp;item</div>
                </div>
                <div className="flex flex-row space-x-4">
                    <img src={String(bike.image)}
                        className="w-1/3 border-2 border-gray-200 bg-white rounded-xl"/>
                    <div className="flex-col">
                        <div className="text-sm">{bike.name}</div>
                        <div className="text-sm">CA${bike.sell_price}</div>
                        <div className="text-sm text-gray-400">Quantity: {quantity}</div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">    
                    <button className="w-100 h-100 text-center bg-emerald-600 text-white p-3 text-m rounded-2xl">View and Edit Cart</button>
                    <button className="w-100 h-100 text-center bg-emerald-600 text-white p-3 text-m rounded-2xl">Secure Checkout</button>
                </div>
            </div>
        );
}

interface ProductPageProps {
    params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productId } = await params;
    const bike = await getOneBike(productId);
    if (!bike) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-gray-100 py-16 px-4">
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{bike.name}</h1>
                    <p className="text-xl text-gray-600 mb-6">
                        {bike.for_rent
                            ? `CA $${bike.rental_rate.toFixed(2)} per hour`
                            : `CA $${bike.sell_price.toFixed(2)}`
                        }
                    </p>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2">
                            <Image
                                src={bike.image || '/img/placeholder.png'}
                                alt={bike.name}
                                unoptimized
                                width={500}
                                height={500}
                                style={{ objectFit: "contain" }}
                                className="rounded-lg"
                            />
                        </div>
                        <div className="md:w-1/2">
                            <p className="text-gray-700 mb-4">{bike.description}</p>
                            <div className="flex items-center gap-4 mb-6">
                                <input type="number" defaultValue={1} min={1} max={bike.amount_stocked}
                                       className="border p-2 w-16 text-center text-gray-800" />
                                <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500">
                                    {bike.for_rent ? 'Rent Now' : 'Add to Cart'}
                                </button>
                            </div>
                            <div className="mb-8">
                                {bike.for_rent ? (
                                    <>
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Rental Information</h2>
                                        <p className="text-gray-700">Rental rate: CA ${bike.rental_rate.toFixed(2)} per hour</p>
                                        <p className="text-gray-700">Damage rate: {(bike.damage_rate * 100).toFixed(2)}%</p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Information</h2>
                                        <p className="text-gray-700">Price: CA ${bike.sell_price.toFixed(2)}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Stock Information</h2>
                    <p className="text-gray-700">Currently in stock: {bike.amount_stocked}</p>
                </div>
            </main>
        </div>
    );
}