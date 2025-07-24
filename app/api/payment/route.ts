import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderDetails, shippingInfo, cart } = body;

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        order_date: new Date().toISOString(),
        is_complete: false,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items records (if order_items table exists)
    try {
      for (const item of cart) {
        const { error: itemError } = await supabase.from("order_items").insert({
          order_id: order.order_id,
          bike_id: item.bike_id,
          quantity: item.quantity,
          unit_price:
            item.orderType === "rent" ? item.rental_rate : item.sell_price,
          order_type: item.orderType,
        });

        if (itemError) {
          console.error("Error creating order item:", itemError);
          // Continue with other items even if one fails
        }
      }
    } catch (error) {
      console.log(
        "order_items table may not exist, skipping order items creation"
      );
    }

    // Create payment record
    try {
      const { error: paymentError } = await supabase.from("payments").insert({
        order_id: order.order_id,
        payment_amount: orderDetails.amount,
        payment_date: new Date().toISOString(),
        payment_method: orderDetails.method || "unknown",
        status: "completed",
      });

      if (paymentError) {
        console.error("Error creating payment record:", paymentError);
        // Don't fail the order creation if payment record fails
      }
    } catch (error) {
      console.error("Error creating payment record:", error);
      // Don't fail the order creation if payment record fails
    }

    // Update inventory
    for (const item of cart) {
      // 1. Fetch current stock
      const { data: bike, error: fetchError } = await supabase
        .from("bikes")
        .select("amount_stocked")
        .eq("bike_id", item.bike_id)
        .single();

      if (fetchError) {
        console.error("Error fetching bike stock:", fetchError);
        return NextResponse.json(
          { error: "Failed to fetch bike stock" },
          { status: 500 }
        );
      }

      // 2. Calculate new stock
      const newStock = (bike?.amount_stocked || 0) - item.quantity;

      // 3. Update with new value
      const { error: updateError } = await supabase
        .from("bikes")
        .update({ amount_stocked: newStock })
        .eq("bike_id", item.bike_id);

      if (updateError) {
        console.error("Error updating inventory:", updateError);
        return NextResponse.json(
          { error: "Failed to update inventory" },
          { status: 500 }
        );
      }
    }

    // Clear cart
    // Note: You'll need to implement this based on how you're storing the cart

    return NextResponse.json({
      success: true,
      orderId: order.order_id,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
