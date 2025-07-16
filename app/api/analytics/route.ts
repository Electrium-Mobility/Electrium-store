import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user profile from customers table
    const { data: profile } = await supabase
      .from("customers")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get orders data for the user
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", user.id);

    // Get payments for all orders
    const orderIds = orders?.map((order) => order.order_id) || [];
    const { data: payments } = await supabase
      .from("payments")
      .select("order_id, payment_amount, payment_date")
      .in("order_id", orderIds);

    // Calculate analytics
    const totalOrders = orders?.length || 0;
    const totalSpent =
      payments?.reduce(
        (sum, payment) => sum + (payment.payment_amount || 0),
        0
      ) || 0;

    // Order status breakdown
    const orderStatusBreakdown =
      orders?.reduce(
        (acc, order) => {
          const status = order.status || "pending";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ) || {};

    // Get order items for all orders
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("bike_id, quantity, order_type")
      .in("order_id", orderIds);

    // Top products (if you have product data)
    const topProducts =
      orderItems
        ?.reduce(
          (acc, item) => {
            const productId = item.bike_id;
            if (productId) {
              const existing = acc.find(
                (p: { id: string; name: string; count: number }) =>
                  p.id === productId
              );
              if (existing) {
                existing.count += item.quantity || 1;
              } else {
                acc.push({
                  id: productId,
                  name: `Product ${productId}`,
                  count: item.quantity || 1,
                });
              }
            }
            return acc;
          },
          [] as Array<{ id: string; name: string; count: number }>
        )
        .sort(
          (
            a: { id: string; name: string; count: number },
            b: { id: string; name: string; count: number }
          ) => b.count - a.count
        )
        .slice(0, 5) || [];

    return NextResponse.json({
      profile,
      orders: orders || [],
      payments: payments || [],
      analytics: {
        totalOrders,
        totalSpent,
        orderStatusBreakdown,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
