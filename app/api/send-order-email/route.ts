import { NextRequest, NextResponse } from "next/server";

// Only import Resend if we're in a runtime environment (not build time)
let Resend: any = null;
let resend: any = null;

// Dynamically import Resend only when needed
async function getResend() {
  if (!Resend) {
    const resendModule = await import("resend");
    Resend = resendModule.Resend;
  }

  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
}

export async function POST(req: NextRequest) {
  const { to, order } = await req.json();

  console.log("[EMAIL API] Called with:", to, order);

  try {
    // Get Resend instance dynamically
    const resendInstance = await getResend();

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY || !resendInstance) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await resendInstance.emails.send({
      from: "Electrium Store <onboarding@resend.dev>", // or your verified sender
      to,
      subject: "Your Order Confirmation",
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order was placed successfully. Here are your order details:</p>
        <ul>
          ${order.items
            .map(
              (item: any) =>
                `<li>${item.name} x ${item.quantity} - $${item.sell_price}</li>`
            )
            .join("")}
        </ul>
        <p><b>Total: $${order.total}</b></p>
      `,
    });

    if (error) {
      console.error("[EMAIL API] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    console.log("[EMAIL API] Email sent to:", to);
    return NextResponse.json({ message: "Email sent" });
  } catch (err) {
    console.error("[EMAIL API] Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
