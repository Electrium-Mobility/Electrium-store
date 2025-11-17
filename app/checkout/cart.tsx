"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckoutBike } from "@/utils/getBike";
import useSessionStorage from "@/utils/useSessionStorage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function ProductDisplay({ params }: { params: { bike: CheckoutBike } }) {
  const bike = params.bike;

  return (
    <Link href={`/products/${bike.bike_id}`}>
      <div className="grid grid-cols-[30%_70%] pb-4">
        <Image
          src={bike.image || "/img/placeholder.png"}
          alt={bike.name}
          unoptimized
          width={250}
          height={250}
          className="rounded-lg object-contain bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-2"
        />
        <div className="m-2 mx-8">
          <h2 className="text-lg font-bold text-[hsl(var(--text-primary))]">
            {bike.name}
          </h2>
          <p className="font-bold text-[hsl(var(--text-primary))]">
            {bike.orderType == "rent"
              ? `CA $${bike.rental_rate.toFixed(2)} per hour`
              : `CA $${bike.sell_price.toFixed(2)}`}
          </p>
          <p className="text-[hsl(var(--text-secondary))] mb-6">
            Quantity: {bike.quantity}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function Cart() {
  const [isLoading, setIsLoading] = useState(true);
  const cartText = useSessionStorage("cart");
  const cart = cartText ? JSON.parse(cartText) : [];

  // Simulate loading for cart data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const subtotal: number = cart.reduce(
    (acc: number, cur: CheckoutBike) =>
      acc + (cur.orderType == "rent" ? 0 : cur.sell_price * cur.quantity),
    0
  );
  const shipping: number = 10;

  if (isLoading) {
    return (
      <div className="flex-1 p-8 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] rounded-lg m-8">
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner />
          <p className="mt-4 text-[hsl(var(--text-secondary))]">
            Loading cart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] rounded-lg m-8">
      <p className="font-bold text-xl pb-6 text-[hsl(var(--text-primary))]">
        Items: {cart.length}
      </p>
      {cart.map((bike: CheckoutBike, i: number) => (
        <ProductDisplay key={i} params={{ bike: bike }} />
      ))}
      <div className="flex flex-row justify-between">
        <p className="text-[hsl(var(--text-secondary))]">Subtotal:</p>
        <p className="text-[hsl(var(--text-secondary))]">CA ${subtotal}</p>
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-[hsl(var(--text-secondary))]">Shipping: </p>
        <p className="text-[hsl(var(--text-secondary))]">CA ${shipping}</p>
      </div>
      <hr className="border-t border-[hsl(var(--border))] m-4" />
      <div className="flex flex-row justify-between">
        <p className="text-[hsl(var(--status-success-text))] font-bold">
          Order Total:{" "}
        </p>
        <p className="text-[hsl(var(--status-success-text))] font-bold">
          CA ${subtotal + shipping}
        </p>
      </div>
    </div>
  );
}
