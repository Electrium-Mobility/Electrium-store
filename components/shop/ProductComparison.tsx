"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { type Bike } from "@/app/lib/definitions";

const MAX_COMPARE = 3;
const MIN_COMPARE = 2;

const ProductComparison = () => {
  const router = useRouter();
  const supabase = createClient();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [selectedBikes, setSelectedBikes] = useState<Bike[]>([]);

  useEffect(() => {
    const fetchBikes = async () => {
      const { data, error } = await supabase.from("bikes").select("*");
      if (error) {
        console.error("Error fetching bikes:", error);
      } else {
        setBikes(data as Bike[]);
      }
    };

    fetchBikes();
  }, []);

  const handleSelectBike = (bike: Bike) => {
    setSelectedBikes((prevSelectedBikes) => {
      if (prevSelectedBikes.find((b) => b.bike_id === bike.bike_id)) {
        return prevSelectedBikes.filter((b) => b.bike_id !== bike.bike_id);
      } else {
        if (prevSelectedBikes.length < MAX_COMPARE) {
          return [...prevSelectedBikes, bike];
        } else {
          toast.warning(`You can only compare up to ${MAX_COMPARE} bikes at a time.`);
          return prevSelectedBikes;
        }
      }
    });
  };

  const handleCompare = () => {
    if (selectedBikes.length < MIN_COMPARE) return;
    const ids = selectedBikes.map((b) => b.bike_id).join(",");
    router.push(`/compare?bikes=${ids}`);
  };

  const canCompare = selectedBikes.length >= MIN_COMPARE;
  const slotsLeft = MAX_COMPARE - selectedBikes.length;

  return (
    <div className="flex">
      <div className="container mx-auto p-4 w-full">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Compare bikes</h2>
            <p className="text-sm text-text-muted">
              Pick {MIN_COMPARE}–{MAX_COMPARE} bikes, then open the 3D comparison view.
            </p>
          </div>
          <div className="text-sm text-text-muted">
            {selectedBikes.length === 0
              ? `Nothing selected`
              : `${selectedBikes.length} selected${slotsLeft > 0 ? ` · ${slotsLeft} more allowed` : ' · maximum'}`}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {bikes.map((bike) => {
            const isSelected = selectedBikes.some((b) => b.bike_id === bike.bike_id);
            return (
              <button
                key={bike.bike_id}
                type="button"
                onClick={() => handleSelectBike(bike)}
                aria-pressed={isSelected}
                className={[
                  "p-4 border rounded-lg text-left transition-colors bg-surface",
                  isSelected
                    ? "border-btn-primary ring-2 ring-btn-primary/30"
                    : "border-border hover:border-border-hover",
                ].join(" ")}
              >
                <img
                  src={bike.image || ""}
                  alt={bike.name}
                  className="w-full h-32 object-contain mb-2"
                />
                <h3 className="font-bold text-text-primary">{bike.name}</h3>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-surface rounded-xl border border-border">
          <div className="text-sm text-text-secondary">
            {canCompare
              ? `Ready to compare ${selectedBikes.length} bikes side-by-side in 3D.`
              : `Select at least ${MIN_COMPARE} bikes to enable the 3D comparison.`}
          </div>
          <button
            type="button"
            disabled={!canCompare}
            onClick={handleCompare}
            className="px-5 py-2.5 rounded-md bg-btn-primary text-btn-primary-text font-semibold hover:bg-btn-primary-hover disabled:bg-btn-disabled disabled:text-btn-disabled-text disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            Compare these in 3D →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
