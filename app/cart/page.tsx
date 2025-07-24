"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";
import { CheckoutBike } from "@/utils/getBike";
import useSessionStorage from "@/utils/useSessionStorage";

// Display products in shopping cart
function Product({
  bike,
  handleQuantityChange,
  handleDelete,
}: {
  bike: CheckoutBike;
  handleQuantityChange: (id: number, newQuantity: number) => void;
  handleDelete: (id: number) => void;
}) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    handleQuantityChange(bike.bike_id, newQuantity);
  };

  const handleOnClick = () => {
    handleDelete(bike.bike_id);
  };

  const subtotal =
    bike.orderType === "rent"
      ? bike.rental_rate * bike.quantity
      : bike.sell_price * bike.quantity;

  return (
    <div className="flex w-full md:w-[750px] bg-gray-100 mb-8 p-6 rounded-2xl shadow-md items-center">
      {/* Product Image */}
      <div className="flex-shrink-0 mr-6">
        <Image
          src={bike.image || "/img/placeholder.png"}
          alt={bike.name}
          unoptimized
          width={100}
          height={100}
          style={{ objectFit: "contain" }}
          className="rounded-lg bg-white border border-gray-200 p-2"
        />
      </div>
      {/* Product Details */}
      <div className="flex flex-1 flex-col md:flex-row md:items-center w-full justify-between gap-4">
        {/* Name */}
        <div className="min-w-[120px] flex-1">
          <p className="font-bold text-lg text-green-700 mb-1">{bike.name}</p>
        </div>
        {/* Price */}
        <div className="min-w-[100px] text-gray-700 text-center">
          <p className="text-sm font-semibold mb-1">Price</p>
          <p>
            {bike.orderType === "rent"
              ? `CA $${bike.rental_rate.toFixed(2)}/hour`
              : `CA $${bike.sell_price.toFixed(2)}`}
          </p>
        </div>
        {/* Quantity */}
        <div className="min-w-[100px] text-center">
          <p className="text-sm font-semibold mb-1">Quantity</p>
          <input
            type="number"
            value={bike.quantity}
            min={1}
            max={bike.amount_stocked}
            className="border rounded-lg p-2 w-16 text-center"
            onChange={handleInputChange}
          />
        </div>
        {/* Subtotal */}
        <div className="min-w-[100px] text-center">
          <p className="text-sm font-semibold mb-1">Subtotal</p>
          <p>CA${subtotal.toFixed(2)}</p>
        </div>
        {/* Delete Button */}
        <div className="min-w-[80px] text-center">
          <button className="text-red-500 underline" onClick={handleOnClick}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShoppingCartPage() {
  const cartText = useSessionStorage("cart");
  const [cart, setCart] = useState<CheckoutBike[]>([]);

  useEffect(() => {
    if (cartText) {
      setCart(JSON.parse(cartText));
    }
  }, [cartText]);

  const subtotal = cart.reduce((sum, bike) => {
    return (
      sum +
      (bike.orderType === "rent"
        ? bike.rental_rate * bike.quantity
        : bike.sell_price * bike.quantity)
    );
  }, 0);

  let shipping = 10; // Fixed shipping cost for now
  let total = subtotal + shipping;

  const handleQuantityChange = (id: number, newQuantity: number) => {
    const updatedCart = cart.map((item) => {
      if (item.bike_id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));

    // Dispatch custom event for same-window updates
    window.dispatchEvent(
      new CustomEvent("sessionStorageChange", {
        detail: { key: "cart", value: JSON.stringify(updatedCart) },
      })
    );
  };

  const handleDelete = (id: number) => {
    const updatedCart = cart.filter((item) => item.bike_id !== id);
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));

    // Dispatch custom event for same-window updates
    window.dispatchEvent(
      new CustomEvent("sessionStorageChange", {
        detail: { key: "cart", value: JSON.stringify(updatedCart) },
      })
    );
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center min-h-screen">
        <main className="w-full p-16">
          <h1 className="text-center mb-10 md:text-4xl text-3xl lg:leading-normal leading-normal font-bold text-green-600">
            Your Shopping Cart
          </h1>
          <div className="text-center">
            <p className="text-gray-600 mb-8">Your cart is empty</p>
            <Link
              href="/"
              className="bg-green-700 text-white flex items-center justify-center gap-4 pr-4 w-52 h-12 mb-12 rounded-2xl hover:bg-green-600 mx-auto"
            >
              <FaAngleLeft size={24} className="text-green-800" />
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <main className="w-full p-16">
        <h1 className="text-center mb-10 md:text-4xl text-3xl lg:leading-normal leading-normal font-bold text-green-600">
          Your Shopping Cart
        </h1>
        <div className="flex flex-col md:flex-row pb-8 justify-center">
          <div className="flex flex-col md:mr-10">
            {cart.map((bike) => (
              <Product
                key={bike.bike_id}
                bike={bike}
                handleQuantityChange={handleQuantityChange}
                handleDelete={handleDelete}
              />
            ))}

            <Link
              href="/"
              className="bg-green-700 text-white flex items-center justify-center gap-4 pr-4 w-52 h-12 mb-12 rounded-2xl hover:bg-green-600"
            >
              <FaAngleLeft size={24} className="text-green-800" />
              Continue Shopping
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md h-fit">
            <h2 className="font-bold mb-6 text-lg">Cart Summary</h2>
            <p className="text-gray-400 mb-6">
              Shipping and tax are determined based on your selected option.
            </p>
            <div className="flex mb-6 justify-between text-gray-400">
              <p>Subtotal</p>
              <p>CA${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex mb-6 justify-between text-gray-400">
              <p>Shipping</p>
              <p>CA${shipping.toFixed(2)}</p>
            </div>
            <hr className="border-black" />
            <div className="flex my-6 justify-between font-bold text-green-700">
              <h3>Order Total</h3>
              <h3>CA${total.toFixed(2)}</h3>
            </div>

            <Link href="/checkout">
              <button className="bg-green-700 text-white w-full h-11 mb-10 rounded-2xl hover:bg-green-600">
                Secure Checkout
              </button>
            </Link>
            <h2 className="font-bold mb-4 text-lg">Discount</h2>
            <p className="text-gray-400 mb-3">Enter code for discount.</p>
            <input
              type="text"
              placeholder="Enter code"
              className="border rounded-md p-2 mb-6 w-full"
            />
            <button className="bg-green-700 text-white w-full h-11 rounded-2xl hover:bg-green-600">
              Apply
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
