"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AboutUs from "../../components/shop/AboutUs"; // Import shared About Us section
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Supabase client

interface Rental {
    bike_id: number;
    name: string;
    image: string | null;
    rental_rate: number;
}

export default function RentalsPage() {
    const [activeTab, setActiveTab] = useState<"product" | "rentals">("rentals");
    const [rentals, setRentals] = useState<Rental[]>([]); // Store rental products from Supabase
    const router = useRouter();

    useEffect(() => {
        const fetchRentals = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("bikes")
                .select("bike_id, name, image, rental_rate");

            console.log("Fetched rentals data:", data);
            console.error("Error fetching rentals:", error);

            if (!error && data) {
                setRentals(data);
            }
        };
        fetchRentals();
    }, []);


    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <AboutUs />

                    <div className="flex justify-center space-x-10 mb-8">
                        <button
                            className="text-xl font-semibold text-gray-500 hover:text-emerald-600"
                            onClick={() => router.push("/")}
                        >
                            Product
                        </button>
                        <button
                            className="text-xl font-semibold text-emerald-600 border-b-4 border-emerald-600"
                        >
                            Rentals
                        </button>
                    </div>

                    <section className="animate-border-glow rounded-xl p-8 shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rentals.map((rental) => (
                                <Link key={rental.bike_id} href={`/rentals/${rental.bike_id}`}>
                                    <div className="flex flex-col items-center bg-white rounded-xl border-2 border-emerald-200 p-4 transition-all duration-300 hover:-translate-y-1 hover-border-glow">
                                        <div className="relative w-48 h-48 mb-6">
                                            <Image
                                                src={rental.image || "/img/placeholder.png"}
                                                alt={rental.name}
                                                unoptimized
                                                width={192}
                                                height={192}
                                                className="rounded-lg"
                                                style={{ objectFit: "contain" }}
                                            />
                                        </div>
                                        <div className="text-center space-y-2 w-full bg-slate-100 p-3 rounded-lg border border-slate-200">
                                            <h3 className="text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                                {rental.name}
                                            </h3>
                                            <div className="px-4 py-2 bg-slate-200 rounded-lg border border-slate-200">
                                                <p className="text-gray-700 font-medium">
                                                    CA ${rental.rental_rate.toFixed(2)}/hour
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
