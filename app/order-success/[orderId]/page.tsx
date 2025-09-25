"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Package, Calendar, DollarSign } from "lucide-react";

interface OrderItem {
  bike_id: number;
  name: string;
  quantity: number;
  sell_price: number;
  rental_rate: number;
  orderType: string;
}

interface Order {
  order_id: string;
  order_date: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
  shipping_address: any;
}

export default function OrderSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const orderData = await response.json();
        setOrder(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-background shadow-lg rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-background shadow-lg rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-status-error-text mb-4">
              Order Not Found
            </h1>
            <p className="text-text-secondary mb-6">
              {error || "The order could not be found."}
            </p>
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-text-inverse bg-btn-primary hover:bg-btn-primary-hover"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-background shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-status-success-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-status-success-text" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Order Successful!
            </h1>
            <p className="text-text-secondary">
              Thank you for your purchase. You will receive a confirmation email
              soon.
            </p>
          </div>

          {/* Order Details */}
          <div className="border-t border-border pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    Order Number
                  </p>
                  <p className="text-lg font-semibold text-text-primary">
                    #{order.order_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    Order Date
                  </p>
                  <p className="text-lg font-semibold text-text-primary">
                    {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    Total Amount
                  </p>
                  <p className="text-lg font-semibold text-text-primary">
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-surface rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-text-primary">{item.name}</p>
                      <p className="text-sm text-text-muted">
                        Quantity: {item.quantity} | Type: {item.orderType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">
                        $
                        {item.orderType === "rent"
                          ? item.rental_rate
                          : item.sell_price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-x-4">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center px-6 py-3 border border-border text-base font-medium rounded-md text-text-secondary bg-background hover:bg-surface"
            >
              View All Orders
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-text-inverse bg-green-600 hover:bg-green-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
