import React from "react";
import Image from "next/image";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import { Bike, getOneBike } from "@/utils/getBike";
import { notFound } from "next/navigation";
import CartAdd from "./cartAdd";
import { GetServerSideProps } from "next";

function CartNotification({
  bike,
  subtotal,
  quantity,
  numItems,
}: {
  bike: Bike;
  subtotal: number;
  quantity: number;
  numItems: number;
}) {
  return (
    <div className="w-80 absolute mt-24 right-6 rounded-3xl bg-[hsl(var(--surface))] space-y-7 flex-col align-center p-6 drop-shadow-lg">
      <h1 className="text-base font-bold text-[hsl(var(--text-primary))]">
        Your Shopping Cart
      </h1>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-self-start text-sm text-[hsl(var(--text-primary))]">
          Subtotal: &nbsp;<div className="font-semibold"> CA${subtotal}</div>
        </div>
        <div className="flex flex-row justify-self-end text-sm text-[hsl(var(--text-primary))]">
          <div className="font-semibold">{numItems}</div>&nbsp;item
        </div>
      </div>
      <div className="flex flex-row space-x-4">
        <img
          src={String(bike.image)}
          className="w-1/3 border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] rounded-xl"
        />
        <div className="flex-col">
          <div className="text-sm text-[hsl(var(--text-primary))]">
            {bike.name}
          </div>
          <div className="text-sm text-[hsl(var(--text-primary))]">
            CA${bike.sell_price}
          </div>
          <div className="text-sm text-[hsl(var(--text-muted))]">
            Quantity: {quantity}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <button className="w-100 h-100 text-center bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] p-3 text-m rounded-2xl hover:bg-[hsl(var(--btn-primary-hover))]">
          View and Edit Cart
        </button>
        <button className="w-100 h-100 text-center bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] p-3 text-m rounded-2xl hover:bg-[hsl(var(--btn-primary-hover))]">
          Secure Checkout
        </button>
      </div>
    </div>
  );
}

interface ProductPageProps {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ rental?: string }>;
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { productId } = await params;
  const { rental } = await searchParams;
  const isRentalMode = rental === "true";

  const bike = await getOneBike(productId);
  if (!bike) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-surface py-16 px-4">
        <div className="max-w-6xl mx-auto bg-background p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {bike.name}
          </h1>
          <p className="text-xl text-text-secondary mb-6">
            {isRentalMode
              ? `CA $${bike.rental_rate?.toFixed(2) || "0.00"} per hour`
              : `CA $${bike.sell_price?.toFixed(2) || "0.00"}`}
          </p>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <Image
                src={bike.image || "/img/placeholder.png"}
                alt={bike.name}
                unoptimized
                width={500}
                height={500}
                style={{ objectFit: "contain" }}
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-text-secondary mb-4">{bike.description}</p>

              <div className="mb-8">
                {isRentalMode ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">
                      Rental Information
                    </h2>
                    <p className="text-text-secondary">
                      Rental rate: CA ${bike.rental_rate?.toFixed(2) || "0.00"}{" "}
                      per hour
                    </p>
                    <p className="text-text-secondary">
                      Damage rate: {((bike.damage_rate || 0) * 100).toFixed(2)}%
                    </p>
                    <div className="mt-6">
                      <CartAdd bike={{ ...bike, for_rent: true }} />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">
                      Product Information
                    </h2>
                    <p className="text-text-secondary">
                      Price: CA ${bike.sell_price?.toFixed(2) || "0.00"}
                    </p>
                    <CartAdd bike={bike} />
                  </>
                )}
              </div>
            </div>
          </div>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            Stock Information
          </h2>
          <p className="text-text-secondary">
            Currently in stock: {bike.amount_stocked}
          </p>
        </div>
      </main>
    </div>
  );
}
