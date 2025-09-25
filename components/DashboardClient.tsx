"use client";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  Package,
  Eye,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  userName: string;
  orders: any[];
  payments: any[];
  paymentMap: Map<string, number>;
  orderItemsMap: Map<string, any[]>;
}

export default function DashboardClient({
  userName,
  orders,
  payments,
  paymentMap,
  orderItemsMap,
}: DashboardClientProps) {
  const [range, setRange] = useState(7);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const totalSpent =
    payments?.reduce(
      (sum, payment) => sum + (payment.payment_amount || 0),
      0
    ) || 0;
  const completedOrders =
    orders?.filter((order) => order.is_complete).length || 0;

  // Calculate active rentals - only count orders that have rental items and are not complete
  const activeRentals =
    orders?.filter((order) => {
      if (order.is_complete) return false; // Order must not be complete

      const orderItems = orderItemsMap.get(order.order_id) || [];
      // Check if any item in this order is a rental
      return orderItems.some((item) => item.order_type === "rent");
    }).length || 0;

  const recentOrders = orders?.slice(0, 5) || [];

  // Generate chart data (last N days)
  const chartData: { date: string; orders: number }[] = [];
  const today = new Date();
  for (let i = range - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayOrders =
      orders?.filter((order) => order.order_date?.startsWith(dateStr)).length ||
      0;
    chartData.push({ date: dateStr, orders: dayOrders });
  }

  // Calculate chart dimensions and scaling
  const maxOrders = Math.max(...chartData.map((p) => p.orders), 1);
  const chartWidth = 400;
  const chartHeight = 240; // Increased height for better label spacing
  const padding = 40;
  const plotWidth = chartWidth - 2 * padding;
  const plotHeight = chartHeight - 2 * padding;

  // Generate x-axis labels based on range
  const getXAxisLabels = () => {
    if (range === 7) {
      // Show every day for 7 days
      return chartData.map((point, index) => ({
        x: padding + (index / (chartData.length - 1)) * plotWidth,
        label: new Date(point.date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        show: true,
      }));
    } else if (range === 30) {
      // Show every 5th day for 30 days
      return chartData.map((point, index) => ({
        x: padding + (index / (chartData.length - 1)) * plotWidth,
        label: new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        show: index % 5 === 0 || index === chartData.length - 1,
      }));
    } else {
      // Show every 10th day for 90 days
      return chartData.map((point, index) => ({
        x: padding + (index / (chartData.length - 1)) * plotWidth,
        label: new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        show: index % 10 === 0 || index === chartData.length - 1,
      }));
    }
  };

  const xAxisLabels = getXAxisLabels();

  // Generate y-axis labels (simplified)
  const yAxisLabels = [];
  const ySteps = 3; // Reduced from 5 to 3 for cleaner look
  for (let i = 0; i <= ySteps; i++) {
    const value = Math.round((maxOrders * i) / ySteps);
    const y = chartHeight - padding - (i / ySteps) * plotHeight;
    yAxisLabels.push({ y, value });
  }

  // Calculate order status breakdown
  const ordersWithRentals =
    orders?.filter((order) => {
      const orderItems = orderItemsMap.get(order.order_id) || [];
      return orderItems.some((item) => item.order_type === "rent");
    }).length || 0;

  const ordersWithPurchases =
    orders?.filter((order) => {
      const orderItems = orderItemsMap.get(order.order_id) || [];
      return orderItems.some((item) => item.order_type === "buy");
    }).length || 0;

  const statusBreakdown = {
    completed: completedOrders,
    pending: activeRentals,
    total: totalOrders,
  };

  return (
    <div className="space-y-8 bg-surface min-h-screen py-8 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            Welcome back, {userName.split(" ")[0]}!
          </h1>
          <p className="text-base text-text-secondary mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mounted && (
          <Link
            href="/dashboard/orders"
            className="group bg-background rounded-xl shadow border border-border p-6 flex flex-col justify-between transition-shadow hover:shadow-lg focus:outline-none"
            style={{ minHeight: 120 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-text-muted">
                Total Orders
              </span>
              <span className="p-2 bg-status-info-bg rounded-lg">
                <ShoppingCart className="h-6 w-6 text-text-link" />
              </span>
            </div>
            <span className="text-3xl font-bold text-text-primary mt-2">
              {totalOrders}
            </span>
          </Link>
        )}
        {mounted && (
          <Link
            href="/dashboard/orders"
            className="group bg-background rounded-xl shadow border border-border p-6 flex flex-col justify-between transition-shadow hover:shadow-lg focus:outline-none"
            style={{ minHeight: 120 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-text-muted">
                Money Spent
              </span>
              <span className="p-2 bg-status-success-bg rounded-lg">
                <DollarSign className="h-6 w-6 text-status-success-text" />
              </span>
            </div>
            <span className="text-3xl font-bold text-text-primary mt-2">
              ${totalSpent.toFixed(2)}
            </span>
          </Link>
        )}

        {mounted && (
          <Link
            href="/dashboard/orders"
            className="group bg-background rounded-xl shadow border border-border p-6 flex flex-col justify-between transition-shadow hover:shadow-lg focus:outline-none"
            style={{ minHeight: 120 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-text-muted">
                Active Rentals
              </span>
              <span className="p-2 bg-[hsl(var(--status-warning-bg))] rounded-lg">
                <Package className="h-6 w-6 text-[hsl(var(--status-warning-text))]" />
              </span>
            </div>
            <span className="text-3xl font-bold text-text-primary mt-2">
              {activeRentals}
            </span>
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Orders Chart */}
          <div className="bg-background rounded-xl shadow border border-border p-6 mb-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Orders Over Time
              </h3>
              <div className="flex space-x-1 bg-surface rounded-lg p-1">
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-md ${range === 7 ? "bg-btn-primary text-text-inverse" : "text-text-link bg-background"}`}
                  onClick={() => setRange(7)}
                >
                  7D
                </button>
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-md ${range === 30 ? "bg-btn-primary text-text-inverse" : "text-text-link bg-background"}`}
                  onClick={() => setRange(30)}
                >
                  30D
                </button>
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-md ${range === 90 ? "bg-btn-primary text-text-inverse" : "text-text-link bg-background"}`}
                  onClick={() => setRange(90)}
                >
                  90D
                </button>
              </div>
            </div>
            <div className="relative h-80">
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              >
                {/* Background */}
                <rect width="100%" height="100%" fill="#fff" />

                {/* Grid lines */}
                {yAxisLabels.map((label, index) => (
                  <g key={index}>
                    <line
                      x1={padding}
                      y1={label.y}
                      x2={chartWidth - padding}
                      y2={label.y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </g>
                ))}

                {/* Chart line */}
                <path
                  d={chartData
                    .map((point, index) => {
                      const x =
                        padding + (index / (chartData.length - 1)) * plotWidth;
                      const y =
                        chartHeight -
                        padding -
                        (point.orders / maxOrders) * plotHeight;
                      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className="drop-shadow-sm"
                />

                {/* Chart area fill */}
                <path
                  d={`${chartData
                    .map((point, index) => {
                      const x =
                        padding + (index / (chartData.length - 1)) * plotWidth;
                      const y =
                        chartHeight -
                        padding -
                        (point.orders / maxOrders) * plotHeight;
                      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(
                      " "
                    )} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
                  fill="#3b82f6"
                  opacity="0.08"
                />

                {/* Data points */}
                {chartData.map((point, index) => {
                  if (point.orders === 0) return null;
                  const x =
                    padding + (index / (chartData.length - 1)) * plotWidth;
                  const y =
                    chartHeight -
                    padding -
                    (point.orders / maxOrders) * plotHeight;
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#fff"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        className="cursor-pointer"
                      />
                      <title>{`${new Date(point.date).toLocaleDateString()}: ${point.orders} orders`}</title>
                    </g>
                  );
                })}

                {/* Y-axis labels */}
                {yAxisLabels.map((label, index) => (
                  <text
                    key={index}
                    x={padding - 8}
                    y={label.y + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {label.value}
                  </text>
                ))}

                {/* X-axis labels */}
                {xAxisLabels
                  .filter((label) => label.show)
                  .map((label, index) => (
                    <text
                      key={index}
                      x={label.x}
                      y={chartHeight - padding + 20}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#6b7280"
                    >
                      {label.label}
                    </text>
                  ))}
              </svg>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-background rounded-xl shadow border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Recent Activity
              </h3>
              <Link
                href="/dashboard/orders"
                className="text-sm text-text-link hover:text-text-link-hover"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const orderTotal = paymentMap.get(order.order_id) || 0;
                  return (
                    <div
                      key={order.order_id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-surface transition-colors"
                    >
                      <div className="p-2 bg-status-info-bg rounded-lg">
                        <ShoppingCart className="h-4 w-4 text-text-link" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">
                          Order #{order.order_id}
                        </p>
                        <p className="text-xs text-text-muted">
                          {order.order_date
                            ? new Date(order.order_date).toLocaleDateString()
                            : "Unknown date"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${order.is_complete ? "bg-status-success-bg text-status-success-text" : "bg-status-warning-bg text-status-warning-text"}`}
                        >
                          {order.is_complete ? "Completed" : "In Progress"}
                        </span>
                        <span className="text-sm font-medium text-text-primary">
                          ${orderTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-text-muted mx-auto mb-4" />
                  <p className="text-lg text-text-muted">No recent orders</p>
                  <p className="text-sm text-text-muted mt-1">
                    Your order history will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status Breakdown */}
          <div className="bg-background rounded-xl shadow border border-border p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              Order Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-status-success rounded-full"></div>
                  <span className="text-sm text-text-secondary">Completed</span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {statusBreakdown.completed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-text-secondary">
                    Active Rentals
                  </span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {statusBreakdown.pending}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-btn-primary rounded-full"></div>
                  <span className="text-sm text-text-secondary">
                    Rental Orders
                  </span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {ordersWithRentals}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-text-secondary">
                    Purchase Orders
                  </span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {ordersWithPurchases}
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">
                    Total
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {statusBreakdown.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-background rounded-xl shadow border border-border p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {mounted && (
                <Link
                  href="/"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="p-2 bg-status-info-bg rounded-lg">
                    <Plus className="h-4 w-4 text-text-link" />
                  </div>
                  <span className="text-sm font-medium text-text-secondary">
                    Browse Products
                  </span>
                </Link>
              )}
              {mounted && (
                <Link
                  href="/dashboard/orders"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="p-2 bg-status-success-bg rounded-lg">
                    <Eye className="h-4 w-4 text-status-success-text" />
                  </div>
                  <span className="text-sm font-medium text-text-secondary">
                    View Orders
                  </span>
                </Link>
              )}
              {mounted && (
                <Link
                  href="/dashboard/profile"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-4 w-4 text-brand-primary" />
                  </div>
                  <span className="text-sm font-medium text-text-secondary">
                    Edit Profile
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
