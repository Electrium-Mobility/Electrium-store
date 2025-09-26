"use client";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  Heart,
  MessageCircle,
  Calendar,
  Star,
  Mail,
  HelpCircle,
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-text-secondary">Loading your dashboard...</p>
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Welcome back, {userName}!
          </h1>
          <p className="text-text-secondary mt-2">Here's your biking journey overview</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* My Orders */}
          <div className="bg-surface rounded-lg shadow-sm p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">My Orders</p>
                <p className="text-3xl font-bold text-text-primary">{totalOrders}</p>
              </div>
              <div className="p-3 bg-status-info-bg rounded-full">
                <Package className="h-6 w-6 text-status-info-text" />
              </div>
            </div>
          </div>

          {/* Active Rentals */}
          <div className="bg-surface rounded-lg shadow-sm p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Active Rentals</p>
                <p className="text-3xl font-bold text-text-primary">{activeRentals}</p>
              </div>
              <div className="p-3 bg-status-success-bg rounded-full">
                <ShoppingCart className="h-6 w-6 text-status-success-text" />
              </div>
            </div>
          </div>

          {/* Reward Points */}
          <div className="bg-surface rounded-lg shadow-sm p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Reward Points</p>
                <p className="text-3xl font-bold text-text-primary">{rewardPoints}</p>
              </div>
              <div className="p-3 bg-status-warning-bg rounded-full">
                <Star className="h-6 w-6 text-status-warning-text" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Rentals */}
          <div className="bg-surface rounded-lg shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text-primary flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-status-success-text" />
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
                        <div key={order.order_id} className="flex items-center justify-between p-4 bg-surface-hover rounded-lg">
                          <div>
                            <p className="font-medium text-text-primary">
                              {rentalItems.length} bike{rentalItems.length > 1 ? 's' : ''} rented
                            </p>
                            <p className="text-sm text-text-secondary">
                              Order #{String(order.order_id).slice(-8)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-text-secondary">Due date</p>
                            <p className="font-medium text-text-primary">
                              {new Date(order.order_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  <Link
                    href="/rentals"
                    className="inline-flex items-center text-text-link hover:text-text-link-hover font-medium"
                  >
                    View all rentals →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-secondary">No active rentals</p>
                  <Link
                    href="/"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-btn-primary text-btn-primary-text rounded-lg hover:bg-btn-primary-hover"
                  >
                    Browse Bikes
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="bg-surface rounded-lg shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text-primary flex items-center">
                <Package className="h-5 w-5 mr-2 text-status-info-text" />
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
                      <div key={order.order_id} className="flex items-center justify-between p-4 bg-surface-hover rounded-lg">
                        <div>
                          <p className="font-medium text-text-primary">
                            Order #{String(order.order_id).slice(-8)}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {orderItems.length} item{orderItems.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-text-primary">${totalAmount.toFixed(2)}</p>
                          <p className={`text-sm ${order.is_complete ? 'text-status-success-text' : 'text-status-warning-text'}`}>
                            {order.is_complete ? 'Completed' : 'Processing'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center text-text-link hover:text-text-link-hover font-medium"
                  >
                    View all orders →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-secondary">No orders yet</p>
                  <Link
                    href="/"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-btn-primary text-btn-primary-text rounded-lg hover:bg-btn-primary-hover"
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
          <div className="bg-surface rounded-lg shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text-primary flex items-center">
                <Heart className="h-5 w-5 mr-2 text-status-error-text" />
                Wishlist
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary mb-4">No saved bikes yet</p>
                <Link
                  href="/dashboard/wishlist"
                  className="inline-flex items-center text-text-link hover:text-text-link-hover font-medium"
                >
                  Browse bikes to add to wishlist →
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-surface rounded-lg shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text-primary flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-status-info-text" />
                Contact Support
              </h2>
            </div>
            <div className="p-6">
              <p className="text-text-secondary mb-4">
                Need help? Our support team is here to assist you.
              </p>
              <div className="space-y-3">
                <Link
                  href="/support"
                  className="flex items-center text-text-link hover:text-text-link-hover"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Link>
                <Link
                  href="mailto:support@electrium.com"
                  className="flex items-center text-text-link hover:text-text-link-hover"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Link>
                <Link
                  href="/faq"
                  className="flex items-center text-text-link hover:text-text-link-hover"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
