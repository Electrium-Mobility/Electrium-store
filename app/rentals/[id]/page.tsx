"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface RentalDetail {
  bike_id: number;
  name: string;
  image: string | null;
  rental_rate: number;
  description?: string;
  specifications?: string;
}

export default function RentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [rental, setRental] = useState<RentalDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentalDetail = async () => {
      if (!params.id) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("bikes")
        .select(
          "bike_id, name, image, rental_rate, description, specifications"
        )
        .eq("bike_id", params.id)
        .single();

      if (!error && data) {
        setRental(data);
      } else {
        console.error("Error fetching rental detail:", error);
      }
      setLoading(false);
    };

    fetchRentalDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface">
        <div className="text-xl text-text-primary">Loading...</div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl mb-4">Rental not found</div>
        <button
          onClick={() => router.push("/rentals")}
          className="px-4 py-2 bg-emerald-600 text-text-inverse rounded hover:bg-emerald-700"
        >
          Back to Rentals
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/rentals")}
          className="mb-6 text-status-success-text hover:text-emerald-700 flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Rentals
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <Image
              src={rental.image || "/img/placeholder.png"}
              alt={rental.name}
              unoptimized
              width={500}
              height={400}
              className="rounded-lg w-full"
              style={{ objectFit: "contain" }}
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">{rental.name}</h1>

            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-2xl font-semibold text-status-success-text">
                CA ${rental.rental_rate.toFixed(2)}/hour
              </p>
            </div>

            {rental.description && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-text-secondary">{rental.description}</p>
              </div>
            )}

            {rental.specifications && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Specifications</h3>
                <p className="text-text-secondary">{rental.specifications}</p>
              </div>
            )}

            <button className="w-full bg-emerald-600 text-text-inverse py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors">
              Rent Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
