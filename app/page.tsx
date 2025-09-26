"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AboutUs from "../components/shop/AboutUs"; // Import shared About Us section
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Supabase client
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Bike {
  bike_id: number;
  name: string;
  description?: string;
  image: string | null;
  amount_stocked?: number;
  rental_rate?: number;
  sell_price?: number;
  damage_rate?: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"product" | "rentals">("product");
  const [allBikes, setAllBikes] = useState<Bike[]>([]); // Store all bikes from Supabase
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state for data fetching
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false); // Loading state for tab switching
  const router = useRouter();

  useEffect(() => {
    const fetchAllBikes = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bikes")
        .select(
          "bike_id, name, description, image, amount_stocked, rental_rate, sell_price, damage_rate"
        );
      if (!error) {
        setAllBikes(data || []);
      } else {
        console.error("Error fetching bikes:", error);
      }
      setIsLoading(false);
    };

    fetchAllBikes();
  }, []);

  const handleTabClick = async (tab: "product" | "rentals") => {
    if (tab === activeTab) return; // Don't reload if same tab

    setIsTabLoading(true);
    // Simulate content loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    setActiveTab(tab);
    setIsTabLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-grow py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* About Us Section */}
          <AboutUs />

          {/* Tab Navigation */}
          <div className="flex justify-center space-x-10 mb-8">
            <button
              className={`text-xl font-semibold transition-colors ${activeTab === "product" ? "text-btn-primary border-b-4 border-btn-primary" : "text-text-secondary hover:text-text-primary"}`}
              onClick={() => handleTabClick("product")}
            >
              Product
            </button>
            <button
              className={`text-xl font-semibold transition-colors ${activeTab === "rentals" ? "text-btn-primary border-b-4 border-btn-primary" : "text-text-secondary hover:text-text-primary"}`}
              onClick={() => handleTabClick("rentals")}
            >
              Rentals
            </button>
          </div>

          {/* Bikes Section - Show all bikes with different buttons based on tab */}
          <section className="mb-16 rounded-xl p-8 shadow-md border border-border-subtle">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <LoadingSpinner size="lg" color="primary" />
                  <p className="mt-4 text-text-secondary">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : isTabLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <LoadingSpinner size="lg" color="primary" />
                  <p className="mt-4 text-text-secondary">
                    Loading {activeTab === "product" ? "products" : "rentals"}
                    ...
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allBikes.map((bike) => (
                  <Link
                    key={bike.bike_id}
                    href={
                      activeTab === "product"
                        ? `/products/${bike.bike_id}`
                        : `/products/${bike.bike_id}?rental=true`
                    }
                  >
                    <div className="group flex flex-col items-center bg-[hsl(var(--btn-background))] rounded-xl border border-border-subtle p-4 transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-xl hover:shadow-black/20">
                      <div className="relative w-48 h-48 mb-6">
                        <Image
                          src={bike.image || "/img/placeholder.png"}
                          alt={bike.name}
                          unoptimized
                          width={192}
                          height={192}
                          className="rounded-lg transition-transform duration-300 group-hover:scale-105"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="text-center space-y-3 w-full bg-[hsl(var(--background))] p-4 rounded-lg border border-border-subtle group-hover:border-border-hover transition-colors">
                        <h3 className="text-lg font-semibold text-text-primary group-hover:text-btn-primary transition-colors">
                          {bike.name}
                        </h3>
                        {activeTab === "product" ? (
                          <div className="space-y-3">
                            <div className="px-4 py-2 bg-btn-secondary rounded-lg border border-border-subtle group-hover:border-border-hover transition-colors">
                              <p className="text-text-muted font-medium">
                                {bike.sell_price
                                  ? `CA $${bike.sell_price.toFixed(2)}`
                                  : "Price not available"}
                              </p>
                            </div>
                            <button className="w-full px-4 py-2 bg-[hsl(var(--btn-primary))] hover:bg-[hsl(var(--btn-primary-hover))] text-[hsl(var(--btn-primary-text))] font-semibold rounded-lg transition-all duration-200 hover:shadow-md active:scale-95">
                              Buy Now
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="px-4 py-2 bg-btn-secondary rounded-lg border border-border-subtle group-hover:border-border-hover transition-colors">
                              <p className="text-text-muted font-medium">
                                {bike.rental_rate
                                  ? `CA $${bike.rental_rate.toFixed(2)}/day`
                                  : "Rental not available"}
                              </p>
                            </div>
                            <button className="w-full px-4 py-2 bg-[hsl(var(--btn-primary))] hover:bg-[hsl(var(--btn-primary-hover))] text-[hsl(var(--btn-primary-text))] font-semibold rounded-lg transition-all duration-200 hover:shadow-md active:scale-95">
                              Rent Now
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
