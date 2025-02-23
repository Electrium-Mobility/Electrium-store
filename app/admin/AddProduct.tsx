"use client"

import { useState, type ChangeEvent } from "react"
import type { Bike } from "@/utils/getBike"
import type React from "react" // Import React
import uploadImage from "./image";

export default function AddProduct() {
  const [newBike, setNewBike] = useState<Omit<Bike, "bike_id">>({
    name: "",
    description: "",
    image: null,
    amount_stocked: 0,
    rental_rate: 0,
    sell_price: 0,
    damage_rate: 0,
    for_rent: false,
  })
  const [uploading, setUploading] = useState(false)

  const handleChange = (field: keyof Omit<Bike, "bike_id">, value: string | number | boolean) => {
    setNewBike((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setUploading(true)
    uploadImage(e).then((signedUrl) => {
      if (signedUrl) {
        setNewBike((prev) => ({ ...prev, image: signedUrl }))
      } else {
        console.error("Error uploading image")
      }
      setUploading(false)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New bike to be added:", newBike)
    // Here you would typically send the data to your backend API
    // Reset the form after submission
    setNewBike({
      name: "",
      description: "",
      image: null,
      amount_stocked: 0,
      rental_rate: 0,
      sell_price: 0,
      damage_rate: 0,
      for_rent: false,
    })
  }

  return (
    <div id="add-product" className="bg-green-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Add New Bike</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={newBike.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={newBike.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
          {newBike.image && <p className="mt-2 text-sm text-gray-500">Image uploaded: {newBike.image}</p>}
        </div>
        <div>
          <label htmlFor="amount_stocked" className="block text-sm font-medium text-gray-700">
            Amount Stocked
          </label>
          <input
            id="amount_stocked"
            type="number"
            value={newBike.amount_stocked}
            onChange={(e) => handleChange("amount_stocked", Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="rental_rate" className="block text-sm font-medium text-gray-700">
            Rental Rate
          </label>
          <input
            id="rental_rate"
            type="number"
            step="0.01"
            value={newBike.rental_rate}
            onChange={(e) => handleChange("rental_rate", Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="sell_price" className="block text-sm font-medium text-gray-700">
            Sell Price
          </label>
          <input
            id="sell_price"
            type="number"
            step="0.01"
            value={newBike.sell_price}
            onChange={(e) => handleChange("sell_price", Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="damage_rate" className="block text-sm font-medium text-gray-700">
            Damage Rate
          </label>
          <input
            id="damage_rate"
            type="number"
            step="0.01"
            value={newBike.damage_rate}
            onChange={(e) => handleChange("damage_rate", Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="for_rent" className="block text-sm font-medium text-gray-700">
            For Rent
          </label>
          <select
            id="for_rent"
            value={newBike.for_rent.toString()}
            onChange={(e) => handleChange("for_rent", e.target.value === "true")}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add New Bike
        </button>
      </form>
    </div>
  )
}

