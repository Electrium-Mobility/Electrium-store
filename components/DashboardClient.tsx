"use client";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  Heart,
  MessageCircle,
  Calendar,
  Star,
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Simulate loading for dashboard data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = orders?.length || 0;
  
  // Calculate active rentals - only count orders that have rental items and are not complete
  const activeRentals =
    orders?.filter((order) => {
      if (order.is_complete) return false;
      const orderItems = orderItemsMap.get(order.order_id) || [];
      return orderItems.some((item) => item.order_type === "rent");
    }).length || 0;

  // Calculate reward points (example: 10 points per completed order)
  const completedOrders = orders?.filter((order) => order.is_complete).length || 0;
  const rewardPoints = completedOrders * 10;

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your biking journey overview</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* My Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Orders</p>
                <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Rentals */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rentals</p>
                <p className="text-3xl font-bold text-gray-900">{activeRentals}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Reward Points */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reward Points</p>
                <p className="text-3xl font-bold text-gray-900">{rewardPoints}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Rentals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                Current Rentals
              </h2>
            </div>
            <div className="p-6">
              {activeRentals > 0 ? (
                <div className="space-y-4">
                  {orders
                    ?.filter((order) => {
                      if (order.is_complete) return false;
                      const orderItems = orderItemsMap.get(order.order_id) || [];
                      return orderItems.some((item) => item.order_type === "rent");
                    })
                    .slice(0, 3)
                    .map((order) => {
                      const orderItems = orderItemsMap.get(order.order_id) || [];
                      const rentalItems = orderItems.filter((item) => item.order_type === "rent");
                      
                      return (
                        <div key={order.order_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              {rentalItems.length} bike{rentalItems.length > 1 ? 's' : ''} rented
                            </p>
                            <p className="text-sm text-gray-600">
                              Order #{String(order.order_id).slice(-8)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Due date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(order.order_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  <Link
                    href="/rentals"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all rentals →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active rentals</p>
                  <Link
                    href="/"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Browse Bikes
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Order History
              </h2>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const orderItems = orderItemsMap.get(order.order_id) || [];
                    const totalAmount = paymentMap.get(order.order_id) || 0;
                    
                    return (
                      <div key={order.order_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            Order #{String(order.order_id).slice(-8)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {orderItems.length} item{orderItems.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${totalAmount.toFixed(2)}</p>
                          <p className={`text-sm ${order.is_complete ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.is_complete ? 'Completed' : 'Processing'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all orders →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                  <Link
                    href="/"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Wishlist */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-600" />
                Wishlist
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No saved bikes yet</p>
                <Link
                  href="/dashboard/wishlist"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Browse bikes to add to wishlist →
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                Contact Support
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Need help? We're here for you!</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Start Live Chat
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
