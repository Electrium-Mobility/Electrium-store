import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import { Bike, getOneBike } from "@/utils/getBike";
import { notFound } from "next/navigation";
import CartAdd from "./cartAdd";
import { GetServerSideProps } from 'next';
import {createClient} from "@/utils/supabase/server";
import { cookies } from 'next/headers';


function generateStarSVG(percentage : number) {
    const fillPercentage = percentage * 100;
    return `
      <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" fill="currentColor" viewBox="0 0 22 20">
        <defs>
          <linearGradient id="customGradient">
            <stop offset="${fillPercentage}%" stop-color="currentColor"/>
            <stop offset="${fillPercentage}%" stop-color="gray"/>
          </linearGradient>
        </defs> 
        <path fill="url(#customGradient)" d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
      </svg>
    `;
}
  
function Stars({ rating }: {
    rating: number
}) {
    const fullStar = '<svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/></svg>';
    const emptyStar = '<svg class="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/></svg>';
    
    let starHTML = '';
    // Add full stars
    for (let i = 0; i < Math.floor(rating); i++) {
        starHTML += fullStar;
    }
    // Add gradient star
    starHTML += generateStarSVG(rating - Math.floor(rating));
    // Add empty stars
    for (let i = 0; i < 5 - Math.ceil(rating); i++) {
        starHTML += emptyStar;
    }
    return <div id="star-rating" className="flex items-center" dangerouslySetInnerHTML={{ __html: starHTML }}></div>
}


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

function RatingCard({ rating, description, name, date }: {
    rating: number,
    description: string,
    name: string,
    date: string
}) {
    return (
        <div className="min-w-[400px] max-w-[400px] min-h-[200px] max-h-[400px] bg-white rounded-lg shadow-md p-4 m-2">
            <div className="flex-row ">
                <div className="text-lg font-semibold overflow-x-auto">{name}</div>
                <div className="text-sm text-gray-400">{date}</div>
                <Stars rating={rating} />
                <div className="text-sm overflow-y-auto max-h-[300px]">{description}</div>
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

    const cookieStore = cookies();
    const supabase = await createClient();
    const { data: reviews, error } = await supabase.from('reviews').select('*').eq('bike_id', productId);
    const bike_rating = reviews ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

    if (!bike) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-gray-100 py-16 px-4">
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{bike.name}</h1>
                    <div className="flex items-center">
                        <Stars rating={bike_rating} />
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{bike_rating.toFixed(1)}</p>
                    </div>
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

                            <CartAdd bike={bike}/>

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
                <div className="flex overflow-x-scroll px-16 py-8 space-x-8 bg-transparent">        
                    {reviews?.map(review => (
                        <RatingCard key={review.id} rating={review.rating} description={review.description} name={review.name} date={review.date}/>
                    ))}
                </div>
            </main>
        </div>
    );
}