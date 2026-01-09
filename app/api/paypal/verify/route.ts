export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderID, amount } = body as { orderID: string; amount: number };
    if (!orderID || typeof amount !== "number") {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
      return new Response(JSON.stringify({ error: "PayPal not configured" }), { status: 500 });
    }
    const base = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!tokenRes.ok) {
      return new Response(JSON.stringify({ error: "Token error" }), { status: 500 });
    }
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token as string;
    const orderRes = await fetch(`${base}/v2/checkout/orders/${orderID}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!orderRes.ok) {
      return new Response(JSON.stringify({ error: "Order fetch error" }), { status: 500 });
    }
    const data = await orderRes.json();
    const statusOk = data.status === "COMPLETED";
    const unit = Array.isArray(data.purchase_units) ? data.purchase_units[0] : null;
    const amt = unit?.amount?.value ? Number(unit.amount.value) : NaN;
    const cur = unit?.amount?.currency_code || "";
    const valueMatch = Math.round(amt * 100) === Math.round(amount * 100);
    const currencyMatch = cur === "CAD";
    const verified = statusOk && valueMatch && currencyMatch;
    return new Response(JSON.stringify({ verified }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}