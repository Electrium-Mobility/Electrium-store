import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  Search,
  Filter,
  Download,
  Eye,
  Package,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Bike,
} from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 1. Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user)
    return <div className="p-8">Please log in to view your orders.</div>;

  // 2. Get customer record for this user
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("id", session.user.id)
    .single();

  if (!customer) return <div className="p-8">No customer record found.</div>;

  // 3. Get orders for this customer
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customer.id)
    .order("order_date", { ascending: false });

  if (error)
    return (
      <div className="p-8 text-status-error-text">
        Error loading orders: {error.message}
      </div>
    );

  // 4. Get payments for all orders
  const orderIds = orders?.map((order) => order.order_id) || [];
  const { data: payments } = await supabase
    .from("payments")
    .select("order_id, payment_amount")
    .in("order_id", orderIds);

  // 5. Get rental records for this customer
  const { data: rentals } = await supabase
    .from("rentals")
    .select("*")
    .eq("customer_id", customer.id)
    .order("rental_start_date", { ascending: false });

  // Create a map of order_id to payment amount
  const paymentMap = new Map();
  payments?.forEach((payment) => {
    paymentMap.set(payment.order_id, payment.payment_amount);
  });

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const completedOrders =
    orders?.filter((order) => order.is_complete).length || 0;
  const pendingOrders =
    orders?.filter((order) => !order.is_complete).length || 0;

  // Calculate active rentals (rentals that haven't ended yet)
  const activeRentals = rentals?.filter((rental) => {
    if (!rental.rental_end_date) return true; // No end date means still active
    return new Date(rental.rental_end_date) > new Date(); // End date is in the future
  }).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Orders</h1>
          <p className="text-base text-text-secondary mt-1">
            Track and manage your rental orders
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-btn-primary hover:bg-btn-primary-hover text-text-inverse rounded-lg transition-colors text-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {totalOrders}
              </p>
            </div>
            <div className="p-3 bg-status-info-bg rounded-lg">
              <Package className="h-6 w-6 text-text-link" />
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Completed
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {completedOrders}
              </p>
            </div>
            <div className="p-3 bg-status-success-bg rounded-lg">
              <CheckCircle className="h-6 w-6 text-status-success-text" />
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Pending</p>
              <p className="text-2xl font-bold text-text-primary">
                {pendingOrders}
              </p>
            </div>
            <div className="p-3 bg-status-warning-bg rounded-lg">
              <Clock className="h-6 w-6 text-status-warning-text" />
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Active Rent
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {activeRentals}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Bike className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background rounded-xl shadow-sm border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-transparent text-sm"
            />
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-3 bg-surface hover:bg-surface-hover text-text-secondary rounded-lg transition-colors text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <select className="px-4 py-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-transparent text-sm">
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">
            Order History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-surface">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-gray-200">
              {orders && orders.length > 0 ? (
                orders.map((order) => {
                  const orderTotal = paymentMap.get(order.order_id) || 0;

                  return (
                    <tr
                      key={order.order_id}
                      className="hover:bg-surface transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-text-primary">
                          #{order.order_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-text-muted mr-2" />
                          <div className="text-sm text-text-secondary">
                            {order.order_date
                              ? new Date(order.order_date).toLocaleDateString()
                              : "Unknown date"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-text-primary">
                          ${orderTotal.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.is_complete
                              ? "bg-status-success-bg text-status-success-text"
                              : "bg-status-warning-bg text-status-warning-text"
                          }`}
                        >
                          {order.is_complete ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              In Progress
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="h-12 w-12 text-text-muted mb-4" />
                      <p className="text-lg text-text-muted font-medium">
                        No orders found
                      </p>
                      <p className="text-sm text-text-muted mt-1">
                        Start shopping to see your orders here
                      </p>
                      <Link
                        href="/"
                        className="mt-4 inline-flex items-center px-4 py-2 bg-btn-primary hover:bg-btn-primary-hover text-text-inverse rounded-lg transition-colors text-sm"
                      >
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

      {/* Rent History */}
      <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">
            Rent History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-surface">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Rental #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-gray-200">
              {rentals && rentals.length > 0 ? (
                rentals.map((rental) => {
                  const isActive = !rental.rental_end_date || new Date(rental.rental_end_date) > new Date();

                  return (
                    <tr
                      key={rental.rental_id}
                      className="hover:bg-surface transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-text-primary">
                          #{String(rental.rental_id).slice(-8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-text-muted mr-2" />
                          <div className="text-sm text-text-secondary">
                            {rental.rental_start_date
                              ? new Date(rental.rental_start_date).toLocaleDateString()
                              : "Unknown date"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-text-muted mr-2" />
                          <div className="text-sm text-text-secondary">
                            {rental.rental_end_date
                              ? new Date(rental.rental_end_date).toLocaleDateString()
                              : "Ongoing"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <Bike className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Bike className="h-12 w-12 text-text-muted mb-4" />
                      <p className="text-lg text-text-muted font-medium">
                        No rental history found
                      </p>
                      <p className="text-sm text-text-muted mt-1">
                        Start renting bikes to see your rental history here
                      </p>
                      <Link
                        href="/"
                        className="mt-4 inline-flex items-center px-4 py-2 bg-btn-primary hover:bg-btn-primary-hover text-text-inverse rounded-lg transition-colors text-sm"
                      >
                        Browse Bikes
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
