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
        user_id: user.id,
        total_amount: orderDetails.amount,
        status: "pending",
        shipping_address: shippingInfo,
        payment_id: orderDetails.id,
        items: cart,
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

    // Update inventory
    for (const item of cart) {
      const { error: inventoryError } = await supabase
        .from("bikes")
        .update({
          amount_stocked: supabase.raw("amount_stocked - ?", [item.quantity]),
        })
        .eq("bike_id", item.bike_id);

      if (inventoryError) {
        console.error("Error updating inventory:", inventoryError);
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
      orderId: order.id,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
