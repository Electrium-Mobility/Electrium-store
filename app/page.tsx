import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "../components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "../components/tutorial/SignUpUserSteps";
import Header from "../components/Header";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/shop/Navbar';
import Footer from '../components/shop/Footer';
/*
export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <DeployButton />
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Next steps</h2>
          {isSupabaseConnected ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}
*/

function ProductDisplay({ id, image, name, sell_price, rental_rate }: {
    id: number,
    image: string | null,
    name: string,
    sell_price: number,
    rental_rate: number
}) {
    return (
        <Link href={`/products/${id}`}>
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                <div className="relative w-48 h-48 mb-4">
                    <Image
                        src={image || '/img/placeholder.png'}
                        alt={name}
                        width={192}
                        height={192}
                        objectFit="contain"
                    />
                </div>
                <h3 className="text-lg font-medium text-emerald-600 mb-2">{name}</h3>
                <p className="text-slate-600">CA ${sell_price.toFixed(2)}</p>
            </div>
        </Link>
    );
}

export default async function Home() {
    const supabase = createClient();
    const { data: bikes, error } = await supabase.from('bikes').select('*');

    if (error) {
        console.error('Error fetching bikes:', error);
        // Handle the error appropriately
    }

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
                                {bikes && bikes.map((bike) => (
                                    <ProductDisplay
                                        key={bike.bike_id}
                                        id={bike.bike_id}
                                        image={bike.image}
                                        name={bike.name}
                                        sell_price={bike.sell_price}
                                        rental_rate={bike.rental_rate}
                                    />
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-3xl font-semibold text-left mb-8 text-gray-800">Rentals</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {bikes && bikes.map((bike) => (
                                    <ProductDisplay
                                        key={bike.bike_id}
                                        id={bike.bike_id}
                                        image={bike.image}
                                        name={bike.name}
                                        sell_price={bike.rental_rate}
                                        rental_rate={bike.rental_rate}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }