import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

let Stripe: any = null;
let stripe: any = null;

async function getStripe() {
  if (!Stripe) {
    const stripeModule = await import("stripe");
    Stripe = stripeModule.default;
  }
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-04-30.basil",
    });
  }
  return stripe;
}

async function getPayPalAccessToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) return null;
  const base = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token as string;
}

async function verifyPayPalOrder(orderId: string, amount: number) {
  const token = await getPayPalAccessToken();
  if (!token) return false;
  const base = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";
  const res = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return false;
  const data = await res.json();
  const statusOk = data.status === "COMPLETED";
  const unit = Array.isArray(data.purchase_units) ? data.purchase_units[0] : null;
  const amt = unit?.amount?.value ? Number(unit.amount.value) : NaN;
  const cur = unit?.amount?.currency_code || "";
  const valueMatch = Math.round(amt * 100) === Math.round(amount * 100);
  const currencyMatch = cur === "CAD";
  return statusOk && valueMatch && currencyMatch;
}

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

    if (!orderDetails || !shippingInfo || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const itemSubtotal = cart.reduce(
      (acc: number, item: any) => acc + (item.orderType === "rent" ? 0 : (Number(item.sell_price) || 0) * (Number(item.quantity) || 0)),
      0
    );
    const shippingFee = 10;
    const totalAmount = Number(itemSubtotal) + Number(shippingFee);

    if (typeof orderDetails.amount !== "number" || Math.round(orderDetails.amount * 100) !== Math.round(totalAmount * 100)) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    let paymentVerified = false;
    let paymentStatus = "pending";

    if (orderDetails.method === "stripe" && orderDetails.id) {
      const stripeInstance = await getStripe();
      if (!stripeInstance) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
      }
      const pi = await stripeInstance.paymentIntents.retrieve(String(orderDetails.id));
      if (pi && pi.status === "succeeded") {
        paymentVerified = true;
        paymentStatus = "completed";
      } else {
        return NextResponse.json({ error: "Payment not verified" }, { status: 402 });
      }
    } else if (orderDetails.method === "paypal" && orderDetails.id) {
      if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_SECRET) {
        const ok = await verifyPayPalOrder(String(orderDetails.id), totalAmount);
        if (!ok) {
          return NextResponse.json({ error: "Payment not verified" }, { status: 402 });
        }
      }
      paymentVerified = true;
      paymentStatus = "completed";
    } else {
      return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
    }

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        order_date: new Date().toISOString(),
        is_complete: false,
        total_amount: totalAmount,
        shipping_address: shippingInfo,
        payment_id: orderDetails.id,
        status: paymentStatus === "completed" ? "paid" : "pending",
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

    try {
      for (const item of cart) {
        const { error: itemError } = await supabase.from("order_items").insert({
          order_id: order.order_id,
          bike_id: item.bike_id,
          quantity: item.quantity,
          unit_price: item.orderType === "rent" ? item.rental_rate : item.sell_price,
          order_type: item.orderType,
        });
        if (itemError) {
          console.error("Error creating order item:", itemError);
        }
      }
    } catch (error) {
      console.log("order_items table may not exist, skipping order items creation");
    }

    try {
      const { error: paymentError } = await supabase.from("payments").insert({
        order_id: order.order_id,
        payment_amount: orderDetails.amount,
        payment_date: new Date().toISOString(),
        payment_method: orderDetails.method || "unknown",
        status: paymentStatus,
      });
      if (paymentError) {
        console.error("Error creating payment record:", paymentError);
      }
    } catch (error) {
      console.error("Error creating payment record:", error);
    }

    if (paymentVerified) {
      for (const item of cart) {
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
        const newStock = (bike?.amount_stocked || 0) - item.quantity;
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
    }

    // Clear cart
    // Note: You'll need to implement this based on how you're storing the cart

    return NextResponse.json({ success: true, orderId: order.order_id });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
