import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ProductDisplay({ id, itemDisplay, name, price }: { id: string, itemDisplay: string; name: string; price: string }) {
  return (
      <Link href={`/products/${id}`}>
        <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
          <div className="relative w-48 h-48 mb-4">
            <Image src={itemDisplay} alt={name} width={192} height={192} objectFit="contain" />
          </div>
          <h3 className="text-lg font-medium text-emerald-600 mb-2">{name}</h3>
          <p className="text-slate-600">{price}</p>
        </div>
      </Link>
  );
}

export default function Home() {
  const products = [
    {
      id: "volter-electric-bike",
      name: "Volter Electric Bike",
      price: "CA $9,999.00",
      itemDisplay: "/img/bike-display.png",
    },
    {
      id: "voltskate-electric-skateboard",
      name: "VoltSkate Electric Skateboard",
      price: "CA $9,999.00",
      itemDisplay: "/img/skateboard-display.png",
    },
    {
      id: "electric-one-wheel",
      name: "Electric One-Wheel",
      price: "CA $9,999.00",
      itemDisplay: "/img/one-wheel-display.png",
    },
  ];

  const rentals = [
    {
      id: "volter-electric-bike",
      name: "Volter Electric Bike",
      price: "CA $10/hr",
      itemDisplay: "/img/bike-display.png",
    },
    {
      id: "voltskate-electric-skateboard",
      name: "VoltSkate Electric Skateboard",
      price: "CA $10/hr",
      itemDisplay: "/img/skateboard-display.png",
    },
    {
      id: "electric-one-wheel",
      name: "Electric One-Wheel",
      price: "CA $10/hr",
      itemDisplay: "/img/one-wheel-display.png",
    },
  ];

  return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-emerald-600 mb-4">Shop</h1>
              <p className="text-xl text-slate-600">Take a look at our latest products and rentals!</p>
            </div>

            <section className="mb-16">
              <h2 className="text-3xl font-semibold text-left mb-8 text-gray-800">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((item, index) => (
                    <ProductDisplay key={index} id={item.id} itemDisplay={item.itemDisplay} name={item.name} price={item.price} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold text-left mb-8 text-gray-800">Rentals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rentals.map((item, index) => (
                    <ProductDisplay key={index} id={item.id} itemDisplay={item.itemDisplay} name={item.name} price={item.price} />
                ))}
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
  );
}