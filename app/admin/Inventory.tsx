"use client"

import { ChangeEvent, useEffect, useState } from "react"
import type { Bike } from "@/utils/getBike"
import { createClient } from "@/utils/supabase/client";
import uploadImage from "./image";

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState<Bike[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function fetchInventory() {
      const { data, error } = await supabase.from("bikes").select("*").order("bike_id")

      if (error) {
        console.error("Error fetching inventory:", error.message)
      } else if (data) {
        setInventoryData(data)
      }
    }
    fetchInventory()
  }, [])

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>, id: number) => {
    setUploading(true)

    const signedUrl = await uploadImage(e)
    if (signedUrl) {
      handleChange(id, "image", signedUrl)
    } else {
      console.error("Error uploading image")
    }
  }

  const handleChange = async (id: number, field: keyof Bike, value: string | number | boolean) => {
    setInventoryData(inventoryData.map((item) => (item.bike_id === id ? { ...item, [field]: value } : item)))
  }

  const handleSave = async (id: number) => {
    await supabase.from("bikes").upsert(inventoryData).eq("bike_id", id)
    console.log(inventoryData)
    setEditingId(null)
  }

  const handleDelete = async (id: number) => {
    await supabase.from("bikes").delete().eq("bike_id", id)
    setInventoryData(inventoryData.filter((item) => item.bike_id !== id))
  }

  return (
    <div id="inventory" className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Bike Inventory</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Stock</th>
            <th className="py-2 px-4 border-b">Rental Rate</th>
            <th className="py-2 px-4 border-b">Sell Price</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((bike) => (
            <tr key={bike.bike_id}>
              <td className="py-2 px-4 border-b">{bike.bike_id}</td>
              <td className="py-2 px-4 border-b">
                {editingId === bike.bike_id ? (
                  <input
                    type="text"
                    value={bike.name}
                    onChange={(e) => handleChange(bike.bike_id, "name", e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  bike.name
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingId === bike.bike_id ? (
                  <textarea
                    value={bike.description}
                    onChange={(e) => handleChange(bike.bike_id, "description", e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  bike.description
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingId === bike.bike_id ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, bike.bike_id)}
                      className="w-full p-1 border rounded"
                    />
                    {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                    {bike.image && <p className="mt-2 text-sm text-gray-500">Current image:
                      <img src={bike.image} alt={bike.name} className="w-16 h-16" /></p>}
                  </div>
                ) : bike.image ? (
                  <img src={bike.image} alt={bike.name} className="w-32 h-32 object-cover" />
                ) : (
                  "No image"
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingId === bike.bike_id ? (
                  <input
                    type="number"
                    value={bike.amount_stocked}
                    onChange={(e) => handleChange(bike.bike_id, "amount_stocked", Number(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                ) : (
                  bike.amount_stocked
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingId === bike.bike_id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={bike.rental_rate}
                    onChange={(e) => handleChange(bike.bike_id, "rental_rate", Number(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                ) : (
                  `$${bike.rental_rate.toFixed(2)}`
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingId === bike.bike_id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={bike.sell_price}
                    onChange={(e) => handleChange(bike.bike_id, "sell_price", Number(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                ) : (
                  `$${bike.sell_price.toFixed(2)}`
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingId === bike.bike_id ? (
                  <button
                    onClick={() => handleSave(bike.bike_id)}
                    className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingId(bike.bike_id)}
                    className="border border-green-700 text-green-700 px-3 py-1 rounded hover:bg-green-50"
                  >
                    Edit
                  </button>
                )}
                  <button
                    onClick={() => handleDelete(bike.bike_id)}
                    className="border border-red-700 text-red-700 px-3 py-1 rounded hover:bg-red-700 hover:text-white"
                  >
                    Delete
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

