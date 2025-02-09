import Inventory from "./Inventory"
import AddProduct from "./AddProduct"
import Orders from "./Orders"

export default function AdminPage() {
  return (
    <div className="space-y-8 p-8 h-full bg-white">
      <h1 className="text-3xl font-bold text-green-700">Admin Dashboard</h1>
      <Inventory />
      <AddProduct />
      <Orders />
    </div>
  )
}