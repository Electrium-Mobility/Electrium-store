import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import {Bike, getOneBike} from "@/utils/getBike";
import {notFound} from "next/navigation";
import CartAdd from "./cartAdd";

export default async function ProductPage({params}: { params: { productId: string } }) {
    const bike = await getOneBike(params.productId);
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
                                style={{objectFit: "contain"}}
                                className="rounded-lg"/>
                        </div>
                        <div className="md:w-1/2">
                            <p className="text-gray-700 mb-4">{bike.description}</p>
                            <CartAdd bike={bike}/>
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