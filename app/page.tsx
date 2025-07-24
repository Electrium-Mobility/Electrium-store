// import DeployButton from "../components/DeployButton";
// import AuthButton from "../components/AuthButton";
// import { createClient } from "@/utils/supabase/server";
// import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
// import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
// import Header from "@/components/Header";
// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import Navbar from '@/components/shop/Navbar';
// import Footer from '@/components/shop/Footer';
// /*
// export default async function Index() {
//   const canInitSupabaseClient = () => {
//     // This function is just for the interactive tutorial.
//     // Feel free to remove it once you have Supabase connected.
//     try {
//       createClient();
//       return true;
//     } catch (e) {
//       return false;
//     }
//   };

//   const isSupabaseConnected = canInitSupabaseClient();

//   return (
//     <div className="flex-1 w-full flex flex-col gap-20 items-center">
//       <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//         <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
//           <DeployButton />
//           {isSupabaseConnected && <AuthButton />}
//         </div>
//       </nav>

//       <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
//         <Header />
//         <main className="flex-1 flex flex-col gap-6">
//           <h2 className="font-bold text-4xl mb-4">Next steps</h2>
//           {isSupabaseConnected ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
//         </main>
//       </div>

//       <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
//         <p>
//           Powered by{" "}
//           <a
//             href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//             target="_blank"
//             className="font-bold hover:underline"
//             rel="noreferrer"
//           >
//             Supabase
//           </a>
//         </p>
//       </footer>
//     </div>
//   );
// }
// */

// function ProductDisplay({ id, image, name, price, isRental }: {
//     id: number,
//     image: string | null,
//     name: string,
//     price: number,
//     isRental: boolean
// }) {
//     return (
//         <Link href={`/products/${id}`}>
//             <div className="flex flex-col items-center bg-white rounded-xl border-2
//              border-emerald-200 p-4 transition-all duration-300 hover:-translate-y-1 hover-border-glow">
//                 <div className="relative w-48 h-48 mb-6">
//                     <Image
//                         src={image || '/img/placeholder.png'}
//                         alt={name}
//                         unoptimized
//                         width={192}
//                         height={192}
//                         className="rounded-lg"
//                         style={{ objectFit: "contain" }}
//                     />
//                 </div>
//                 <div className="text-center space-y-2 w-full bg-slate-100 p-3 rounded-lg border border-slate-200">
//                     <h3 className="text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
//                         {name}
//                     </h3>
//                     <div className="px-4 py-2 bg-slate-200 rounded-lg border border-slate-200">
//                         {isRental ? (
//                             <div className="space-y-1">
//                                 <p className="text-gray-700 font-medium">
//                                     CA ${price.toFixed(2)}/hour
//                                 </p>
//                                 <p className="text-sm text-emerald-600">
//                                     Available for Rent
//                                 </p>
//                             </div>
//                         ) : (
//                             <p className="text-gray-700 font-medium">
//                                 CA ${price.toFixed(2)}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// }

// export default async function Home() {
//     const supabase = await createClient();
//     const { data: bikes, error } = await supabase.from("bikes").select();

//     if (error) {
//         console.error('Error fetching bikes:', error);
//         // Handle the error appropriately
//     }

//     const allBikes = bikes || [];

//     return (
//         <div className="flex flex-col min-h-screen">
//             <main className="flex-grow bg-white py-16 px-4">
//                 <div className="max-w-6xl mx-auto">
//                     <div className="text-center mb-12 mt-[-6rem]">
//                         <h1 className="text-[120px] bubble-text">SHOP</h1>
//                         <p className="text-[22px] text-slate-600 font-light tracking-wide">Take a look at our latest products and rentals!</p>
//                     </div>
//                     <section className="mb-16 animate-border-glow rounded-xl p-8 shadow-[0_0_25px_rgba(100,100,100,0.35)]">
//                         <h2 className="text-4xl font-semibold text-center mb-8 text-gray-800">Products</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                             {allBikes.map((bike) => (
//                                 <ProductDisplay
//                                     key={bike.bike_id}
//                                     id={bike.bike_id}
//                                     image={bike.image}
//                                     name={bike.name}
//                                     price={bike.sell_price}
//                                     isRental={false}
//                                 />
//                             ))}
//                         </div>
//                     </section>
//                     <section className="animate-border-glow rounded-xl p-8 shadow-[0_0_25px_rgba(100,100,100,0.35)]">
//                         <h2 className="text-4xl font-semibold text-center mb-8 text-gray-800">Rentals</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                             {allBikes.map((bike) => (
//                                 <ProductDisplay
//                                     key={bike.bike_id}
//                                     id={bike.bike_id}
//                                     image={bike.image}
//                                     name={bike.name}
//                                     price={bike.rental_rate}
//                                     isRental={true}
//                                 />
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             </main>
//         </div>
//     );
// }

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AboutUs from "../components/shop/AboutUs"; // Import shared About Us section
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Supabase client

interface Bike {
  bike_id: number;
  name: string;
  image: string | null;
  sell_price: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"product" | "rentals">("product");
  const [bikes, setBikes] = useState<Bike[]>([]); // Store products from Supabase
  const router = useRouter();

  useEffect(() => {
    const fetchBikes = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bikes")
        .select("bike_id, name, image, sell_price");
      if (!error) {
        setBikes(data || []);
      } else {
        console.error("Error fetching products:", error);
      }
    };
    fetchBikes();
  }, []);

  const handleTabClick = (tab: "product" | "rentals") => {
    if (tab === "rentals") {
      router.push("/rentals");
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* About Us Section */}
          <AboutUs />

          {/* Tabs for Product & Rentals */}
          <div className="flex justify-center space-x-10 mb-8">
            <button
              className={`text-xl font-semibold ${activeTab === "product" ? "text-emerald-600 border-b-4 border-emerald-600" : "text-gray-500"}`}
              onClick={() => handleTabClick("product")}
            >
              Product
            </button>
            <button
              className={`text-xl font-semibold ${activeTab === "rentals" ? "text-emerald-600 border-b-4 border-emerald-600" : "text-gray-500"}`}
              onClick={() => handleTabClick("rentals")}
            >
              Rentals
            </button>
          </div>

          {activeTab === "product" && (
            <section className="mb-16 animate-border-glow rounded-xl p-8 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bikes.map((bike) => (
                  <Link key={bike.bike_id} href={`/products/${bike.bike_id}`}>
                    <div className="flex flex-col items-center bg-white rounded-xl border-2 border-emerald-200 p-4 transition-all duration-300 hover:-translate-y-1 hover-border-glow">
                      <div className="relative w-48 h-48 mb-6">
                        <Image
                          src={bike.image || "/img/placeholder.png"}
                          alt={bike.name}
                          unoptimized
                          width={192}
                          height={192}
                          className="rounded-lg"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="text-center space-y-2 w-full bg-slate-100 p-3 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                          {bike.name}
                        </h3>
                        <div className="px-4 py-2 bg-slate-200 rounded-lg border border-slate-200">
                          <p className="text-gray-700 font-medium">
                            CA ${bike.sell_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
