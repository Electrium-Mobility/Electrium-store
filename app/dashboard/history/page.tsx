"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const fakeHistory = [
  { id: "1201", date: "2024-04-10", status: "Delivered", total: "$89.99" },
  { id: "1202", date: "2024-03-22", status: "Delivered", total: "$59.00" },
  { id: "1203", date: "2024-02-15", status: "Returned", total: "$120.00" },
];

export default function OrderHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if(!user) {
          setError("Please log in to view your order history.");
          return;
        }

        const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("id", user.id)
        .single();

        if(!customer) {
          setError("No customer record found.");
          return;
        }

        const { data: orderData, error: ordersError } = await supabase
        .from("orders")
        .select("order_id, order_date, total_amount, status")
        .eq("customer_id", customer.id)
        .eq("status", "paid")
        .order("order_date", { ascending: false});

        if(ordersError) {
          setError(`Error loading order history: ${ordersError.message}`);
          return;
        }

        setOrders(orderData || []);
      } catch (e) {
        setError("Unexpected error while loading order history.");
      } finally {
        setLoading(false);
      }
      };
      fetchHistory();
  }, [])

  if (loading) { 
    return <div className="p-8">Loading order history...</div>;
  }

  if(error) {
    return <div className="p-8 text-status-error-text">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">
        Order History
      </h1>
      <div className="bg-background p-6 rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-gray-100">
            {orders.length > 0 ? (
              orders.map((order) => (
            
              <tr key={order.order_id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-text-primary">
                  #{order.order_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                  {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-status-success-bg text-status-success-text">
                    Paid
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                  ${Number(order.totcal_amount).toFixed(2)}
                </td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                  No completed orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
