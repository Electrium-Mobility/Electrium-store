"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { type Bike } from "@/app/lib/definitions";

const ProductComparison = () => {
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
        if (prevSelectedBikes.length < 3) {
          return [...prevSelectedBikes, bike];
        } else {
          alert("You can only compare up to 3 bikes.");
          return prevSelectedBikes;
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Compare Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {bikes.map((bike) => (
          <div
            key={bike.bike_id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedBikes.find((b) => b.bike_id === bike.bike_id)
                ? "border-blue-500"
                : ""
            }`}
            onClick={() => handleSelectBike(bike)}
          >
            <img
              src={bike.image || ''}
              alt={bike.name}
              className="w-full h-32 object-cover mb-2"
            />
            <h3 className="font-bold">{bike.name}</h3>
          </div>
        ))}
      </div>

      {selectedBikes.length > 0 && (
        <table className="w-full border-collapse border border-gray-600">
          <thead>
            <tr className="bg-btn-primary text-btn-primary-text">
              <th className="p-2 border border-gray-600">Feature</th>
              {selectedBikes.map((bike) => (
                <th key={bike.bike_id} className="p-2 border border-gray-600">
                  {bike.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-gray-600 font-bold">Price</td>
              {selectedBikes.map((bike) => (
                <td key={bike.bike_id} className="p-2 border border-gray-600">
                  ${bike.sell_price}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 border border-gray-600 font-bold">Rental Rate</td>
              {selectedBikes.map((bike) => (
                <td key={bike.bike_id} className="p-2 border border-gray-600">
                  ${bike.rental_rate}/day
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 border border-gray-600 font-bold">In Stock</td>
              {selectedBikes.map((bike) => (
                <td key={bike.bike_id} className="p-2 border border-gray-600">
                  {bike.amount_stocked}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductComparison;