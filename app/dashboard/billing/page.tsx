"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  CreditCard,
  Receipt,
  Calendar,
  CheckCircle,
  Clock,
  Package,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type Payment = {
  payment_id: number;
  order_id: number;
  payment_amount: number;
  payment_date: string | null;
  payment_method: string | null;
  status: string | null;
};

const methodLabels: Record<string, string> = {
  stripe: "Card",
  paypal: "PayPal",
};

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Session expired. Please log in again.");
          return;
        }

        // Payments link to the user only through orders, so fetch the user's
        // order ids first, then the payments recorded against them.
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("order_id")
          .eq("customer_id", user.id);

        if (ordersError) {
          setError(`Error loading billing history: ${ordersError.message}`);
          return;
        }

        const orderIds = (ordersData || []).map((o) => o.order_id);
        if (orderIds.length === 0) {
          setPayments([]);
          return;
        }

        const { data: paymentsData, error: paymentsError } = await supabase
          .from("payments")
          .select("*")
          .in("order_id", orderIds)
          .order("payment_date", { ascending: false });

        if (paymentsError) {
          setError(`Error loading billing history: ${paymentsError.message}`);
          return;
        }
        setPayments((paymentsData as Payment[]) || []);
      } catch (e) {
        console.error("Billing history fetch failed:", e);
        setError("Unexpected error while loading billing history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (Number(p.payment_amount) || 0), 0);
  const transactionCount = payments.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-4 text-[hsl(var(--text-secondary))]">
            Loading billing history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-status-error-text">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Billing</h1>
        <p className="text-base text-text-secondary mt-1">
          Your payment history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Total Paid
              </p>
              <p className="text-2xl font-bold text-text-primary">
                ${totalPaid.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-status-success-bg rounded-lg">
              <CreditCard className="h-6 w-6 text-status-success-text" />
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Transactions
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {transactionCount}
              </p>
            </div>
            <div className="p-3 bg-status-info-bg rounded-lg">
              <Receipt className="h-6 w-6 text-text-link" />
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">
            Payment History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {payments.length > 0 ? (
                payments.map((payment) => {
                  const isComplete = payment.status === "completed";
                  const isFailed = payment.status === "failed";
                  return (
                    <tr
                      key={payment.payment_id}
                      className="hover:bg-surface transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-text-muted mr-2" />
                          <div className="text-sm text-text-secondary">
                            {payment.payment_date
                              ? new Date(
                                  payment.payment_date
                                ).toLocaleDateString()
                              : "Unknown date"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-text-primary">
                          #{payment.order_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-secondary capitalize">
                          {payment.payment_method
                            ? methodLabels[payment.payment_method] ||
                              payment.payment_method
                            : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-text-primary">
                          ${(Number(payment.payment_amount) || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            isComplete
                              ? "bg-status-success-bg text-status-success-text"
                              : isFailed
                              ? "bg-status-error-bg text-status-error-text"
                              : "bg-status-warning-bg text-status-warning-text"
                          }`}
                        >
                          {isComplete ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </>
                          ) : isFailed ? (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              {payment.status
                                ? payment.status.charAt(0).toUpperCase() +
                                  payment.status.slice(1)
                                : "Pending"}
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Receipt className="h-12 w-12 text-text-muted mb-4" />
                      <p className="text-lg text-text-muted font-medium">
                        No payments yet
                      </p>
                      <p className="text-sm text-text-muted mt-1">
                        Your payment history will appear here after your first
                        purchase
                      </p>
                      <Link
                        href="/"
                        className="mt-4 inline-flex items-center px-4 py-2 bg-btn-primary hover:bg-btn-primary-hover text-text-inverse rounded-lg transition-colors text-sm"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Browse Products
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
