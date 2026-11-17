"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function BillingPage() {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Please log in to view your billing history");
          return;
        }

        const {data: customer} = await supabase
        .from("customers")
        .select("id")
        .eq("id", user.id)
        .single();

        if(!customer) {
          setError("No customer record found");
          return;
        }
        
        const { data: ordersData, error: ordersError} = await supabase
        .from("orders")
        .select("order_id")
        .eq("customer_id", customer.id);

      if(ordersError) {
        setError(`Error loading billing history: ${ordersError.message}`);
        return;
      }

      const orderIds = (ordersData || []).map((o) => o.order_id);

      if(orderIds.length === 0) {
        setPayments([]);
        return;
      }
      
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("payment_id, order_id, payment_date, payment_amount, payment_method, status")
        .in("order_id", orderIds)
        .order("payment_date", { ascending: false});

      if(paymentsError) {
        setError(`Error loading billing history: ${paymentsError.message}`);
        return;
      }

      setPayments(paymentsData || []);
      } catch (e) {
        setError("Unexpected error while loading billing history.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);
    return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Billing</h1>
      <div className="bg-background p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Payment History
        </h2>
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
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-gray-100">
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.payment_id}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-text-primary">
                    #{p.order_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {new Date(p.payment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary capitalize">
                    {p.payment_method || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    ${Number(p.payment_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        p.status === "completed"
                          ? "bg-status-success-bg text-status-success-text"
                          : "bg-status-error-bg text-status-error-text"
                      }`}
                    >
                      {p.status || "unknown"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  No payments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}