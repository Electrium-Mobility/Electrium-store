import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return <div className="p-8">Please log in to view your dashboard.</div>;
  }

  // Get user profile data
  let userName = "User";
  const { data: customer } = await supabase
    .from("customers")
    .select("first_name, last_name, email")
    .eq("id", session.user.id)
    .single();
  if (customer?.first_name && customer?.last_name) {
    userName = `${customer.first_name} ${customer.last_name}`;
  } else if (customer?.first_name) {
    userName = customer.first_name;
  } else {
    userName = customer?.email || session.user.email || "User";
  }

  // Get orders data
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", session.user.id);

  // Get payments for all orders
  const orderIds = orders?.map((order) => order.order_id) || [];
  const { data: payments } = await supabase
    .from("payments")
    .select("order_id, payment_amount")
    .in("order_id", orderIds);

  // Create a map of order_id to payment amount
  const paymentMap = new Map();
  payments?.forEach((payment) => {
    paymentMap.set(payment.order_id, payment.payment_amount);
  });

  return (
    <DashboardClient
      userName={userName}
      orders={orders || []}
      payments={payments || []}
      paymentMap={paymentMap}
    />
  );
}
