'use client'
import { useState } from "react"

interface InventoryItem {
  id: number
  name: string
  stock: number
  price: number
}

const initialInventoryData: InventoryItem[] = [
  { id: 1, name: "Product 1", stock: 50, price: 19.99 },
  { id: 2, name: "Product 2", stock: 30, price: 29.99 },
  { id: 3, name: "Product 3", stock: 20, price: 39.99 },
]

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialInventoryData)
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleStockChange = (id: number, newStock: number) => {
    setInventoryData(inventoryData.map((item) => (item.id === id ? { ...item, stock: newStock } : item)))
  }

  const handleSave = (id: number) => {
    console.log(`Saving stock update for product ${id}`)
    setEditingId(null)
  }

  return (
    <div id="inventory">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Inventory</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Stock</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.id}</td>
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={item.stock}
                    onChange={(e) => handleStockChange(item.id, Number.parseInt(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                ) : (
                  item.stock
                )}
              </td>
              <td className="py-2 px-4 border-b">${item.price.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">
                {editingId === item.id ? (
                  <button
                    onClick={() => handleSave(item.id)}
                    className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="border border-green-700 text-green-700 px-3 py-1 rounded hover:bg-green-50"
                  >
                    Edit Stock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

