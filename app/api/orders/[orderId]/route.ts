import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", params.orderId)
      .eq("customer_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json(
        { error: "Failed to fetch order" },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch order items
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        *,
        bikes (
          name,
          description,
          image
        )
      `)
      .eq("order_id", params.orderId);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
    }

    // Fetch payment for this order
    const { data: payment } = await supabase
      .from("payments")
      .select("payment_amount")
      .eq("order_id", params.orderId)
      .single();

    // Combine order with items and total
    const orderWithItems = {
      ...order,
      total_amount: payment?.payment_amount || 0,
      items: orderItems?.map(item => ({
        bike_id: item.bike_id,
        name: item.bikes?.name || `Product ${item.bike_id}`,
        quantity: item.quantity,
        sell_price: item.unit_price,
        rental_rate: item.unit_price,
        orderType: item.order_type
      })) || []
    };

    return NextResponse.json(orderWithItems);
  } catch (error) {
    console.error("Error in order details endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
