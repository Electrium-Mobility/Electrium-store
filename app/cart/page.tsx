'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaAngleLeft } from "react-icons/fa";

type Bike = {
    bike_id: number;
    name: string;
    image: string | null;
    sell_price: number;
    quantity: number
};

// Display products in shopping cart
function Product({id, name, image, price, quantity, subtotal, handleQuantityChange, handleDelete} : {
    id: number,
    name: string,
    image: string | null,
    price: number,
    quantity: number,
    subtotal: number,
    handleQuantityChange: (id: number, newQuantity: number) => void,
    handleDelete: (id: number) => void
}) {

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value, 10);
        handleQuantityChange(id, newQuantity);
    };

    const handleOnClick = () => {
        handleDelete(id);
    }

    return (
        <div className="flex align-center w-full h-fit md:w-[750px] md:h-64 bg-gray-100 mb-10 p-8 rounded-2xl shadow-md">
            <div className="flex min-w-fit items-center">
                <Image
                    src={image || '/img/placeholder.png'}
                    alt={name}
                    unoptimized
                    width={180}
                    height={180}
                    style={{objectFit: "contain"}}
                    className="rounded-lg"/>
            </div>
            <div className="flex flex-col w-full ml-14">
                <h3 className="font-bold mb-12 text-green-700 ">{name}</h3>
                <div className="flex flex-col md:flex-row w-full justify-between">
                    <div className="flex flex-col mb-8">
                        <p className="mb-3">Price</p>
                        <p>CA${price.toLocaleString("en", {minimumFractionDigits:2})}</p>
                    </div>
                    <div className="flex flex-col mb-8">
                        <p>Quantity</p>
                        <div className="flex flex-row items-center gap-3 mt-1">
                            <p>X</p>
                            <input type="number" 
                                defaultValue={quantity} min={1} 
                                className="border rounded-lg p-2 w-14 text-center"
                                onChange={handleInputChange}/>
                        </div>
                    </div>
                    <div className="flex flex-col mr-6 mb-8">
                        <p className="mb-3">Subtotal</p>
                        <p>CA${subtotal.toLocaleString("en", {minimumFractionDigits:2})}</p>
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    <button className="underline text-gray-400" onClick={handleOnClick}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default function ShoppingCartPage() {
    // Get this from database once set up (user is associated with a list of products that they have added to the cart?)
    const initialProducts : Bike[] = [{bike_id: 0, name: "Volter Electric Bike", image:"/img/bike-display.png", sell_price:9999, quantity:1},
                                {bike_id: 1, name: "VoltSkate Electric Skateboard", image:"/img/skateboard-display.png", sell_price:1111, quantity:1}];

    
    const [products, setProducts] = useState(initialProducts);

    const subtotal = products.reduce((sum, bike) => {
        return sum + (bike.sell_price * bike.quantity);
    }, 0);

    let shipping = 1; // arbitrary number for now
    let total = subtotal + shipping;

    const handleQuantityChange = (id: number, newQuantity: number) => {
        const updatedProducts = products.map(product => {
            if (product.bike_id === id) {
                return { ...product, quantity: newQuantity };
            }
            return product;
        });
        setProducts(updatedProducts);
    };

    const handleDelete = (id: number) => {
        const updatedProducts = products.filter(product => product.bike_id !== id);
        setProducts(updatedProducts);
    };

    return (
        <div className="flex flex-col items-center min-h-screen">
            <main className="w-full p-16">
                <h1 className="text-center mb-10 md:text-4xl text-3xl lg:leading-normal leading-normal font-bold text-green-600">
                    Your Shopping Cart
                </h1>
                <div className="flex flex-col md:flex-row pb-8 justify-center">
                    <div className="flex flex-col md:mr-10">
                        {products.map((bike) => (
                                <Product
                                    key={bike.bike_id}
                                    id={bike.bike_id}
                                    name={bike.name}
                                    image={bike.image}
                                    price={bike.sell_price}
                                    quantity={bike.quantity}
                                    subtotal={bike.sell_price * bike.quantity}
                                    handleQuantityChange={handleQuantityChange}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        
                        <Link href="/" className="bg-green-700 text-white flex items-center justify-center gap-4 pr-4 w-52 h-12 mb-12 rounded-2xl hover:bg-green-600">
                            <FaAngleLeft size={24} className="text-green-800"/>
                            Continue Shopping
                        </Link>
                    </div>
                    
                    <div className="w-full min-w-80 md:w-[400px] bg-gray-100 p-8 rounded-2xl border">
                        <h2 className="font-bold mb-6 text-lg">Cart Summary</h2>
                        <p className="text-gray-400 mb-6">Shipping and tax are determined based on your selected option.</p>
                        <div className="flex mb-6 justify-between text-gray-400">
                            <p>Subtotal</p>
                            <p>CA${subtotal.toLocaleString("en", {minimumFractionDigits:2})}</p>
                        </div>
                        <div className="flex mb-6 justify-between text-gray-400">
                            <p>Shipping</p>
                            <p>CA${shipping.toLocaleString("en", {minimumFractionDigits:2})}</p>
                        </div>
                        <hr className="border-black"/>
                        <div className="flex my-6 justify-between font-bold text-green-700">
                            <h3>Order Total</h3>
                            <h3>CA${total.toLocaleString("en", {minimumFractionDigits:2})}</h3>
                        </div>
                        <Link href="/checkout"><button className="bg-green-700 text-white w-full h-11 mb-10 rounded-2xl hover:bg-green-600">Secure Checkout</button> </Link>
                        <h2 className="font-bold mb-4 text-lg">Discount</h2>
                        <p className="text-gray-400 mb-3">Enter code for discount.</p>
                        <input type="text" placeholder="Enter code" className="border rounded-md p-2 mb-6 w-full"/>
                        <button className="bg-green-700 text-white w-full h-11 rounded-2xl hover:bg-green-600">Apply</button>
                    </div>
                </div>
            </main>
        </div>
    )
}