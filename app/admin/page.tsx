import Inventory from "./Inventory"
import AddProduct from "./AddProduct"
import Orders from "./Orders"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }
  if (supabase.from('admin').select('id').eq('id', user.id).single() === null) {
    alert('You are not authorized to view this page')
    redirect("/")
  }
  return (
    <div className="space-y-8 p-8 h-full bg-white">
      <h1 className="text-3xl font-bold text-green-700">Admin Dashboard</h1>
      <Inventory />
      <AddProduct />
      <Orders />
    </div>
  )
}