"use client";
import { useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  Package,
  Eye,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  userName: string;
  orders: any[];
  payments: any[];
  paymentMap: Map<string, number>;
}

export default function DashboardClient({
  userName,
  orders,
  payments,
  paymentMap,
}: DashboardClientProps) {
  const [range, setRange] = useState(7);

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const totalSpent =
    payments?.reduce(
      (sum, payment) => sum + (payment.payment_amount || 0),
      0
    ) || 0;
  const completedOrders =
    orders?.filter((order) => order.is_complete).length || 0;
  const activeRentals =
    orders?.filter((order) => !order.is_complete).length || 0;
  const avgDeliveryTime = totalOrders > 0 ? "2.4 days" : "0 days";
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

  const statusBreakdown = {
    completed: completedOrders,
    pending: activeRentals,
    total: totalOrders,
  };

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen py-8 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {userName.split(" ")[0]}!
          </h1>
          <p className="text-base text-gray-600 mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm shadow-sm"
        >
          <Settings className="h-4 w-4 mr-2" /> Settings
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          href="/dashboard/orders"
          className="group bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col justify-between transition-shadow hover:shadow-lg focus:outline-none"
          style={{ minHeight: 120 }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-500">
              Total Orders
            </span>
            <span className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </span>
          </div>
          <span className="text-3xl font-bold text-gray-900 mt-2">
            {totalOrders}
          </span>
        </Link>
        <Link
          href="/dashboard/orders"
          className="group bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col justify-between transition-shadow hover:shadow-lg focus:outline-none"
          style={{ minHeight: 120 }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-500">
              Money Spent
            </span>
            <span className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </span>
          </div>
          <span className="text-3xl font-bold text-gray-900 mt-2">
            ${totalSpent.toFixed(2)}
          </span>
        </Link>
        <div
          className="group bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col justify-between"
          style={{ minHeight: 120 }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-500">
              Avg. Delivery Time
            </span>
            <span className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </span>
          </div>
          <span className="text-3xl font-bold text-gray-900 mt-2">
            {avgDeliveryTime}
          </span>
        </div>
        <Link
          href="/dashboard/orders"
          className="group bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col justify-between transition-shadow hover:shadow-lg focus:outline-none"
          style={{ minHeight: 120 }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-500">
              Active Rentals
            </span>
            <span className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </span>
          </div>
          <span className="text-3xl font-bold text-gray-900 mt-2">
            {activeRentals}
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Orders Over Time
              </h3>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-md ${range === 7 ? "bg-blue-600 text-white" : "text-blue-600 bg-white"}`}
                  onClick={() => setRange(7)}
                >
                  7D
                </button>
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-md ${range === 30 ? "bg-blue-600 text-white" : "text-blue-600 bg-white"}`}
                  onClick={() => setRange(30)}
                >
                  30D
                </button>
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-md ${range === 90 ? "bg-blue-600 text-white" : "text-blue-600 bg-white"}`}
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
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <Link
                href="/dashboard/orders"
                className="text-sm text-blue-600 hover:text-blue-700"
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
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.order_id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.order_date
                            ? new Date(order.order_date).toLocaleDateString()
                            : "Unknown date"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${order.is_complete ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {order.is_complete ? "Completed" : "In Progress"}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          ${orderTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-500">No recent orders</p>
                  <p className="text-sm text-gray-400 mt-1">
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
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Order Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Completed</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {statusBreakdown.completed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Pending</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {statusBreakdown.pending}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {statusBreakdown.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Browse Products
                </span>
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  View Orders
                </span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Edit Profile
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
