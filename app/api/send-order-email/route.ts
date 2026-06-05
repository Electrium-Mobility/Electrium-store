import { NextRequest, NextResponse } from "next/server";
import { buildHtml, buildText } from "./template";

export const dynamic = "force-dynamic";

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
  const { to, order = {}, customer = {} } = await req.json();

  console.log("[EMAIL API] Called with:", to, order?.orderId);

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

    // `from` must use a domain you've verified at resend.com/domains.
    // Until then it falls back to Resend's sandbox sender, which only
    // delivers to the Resend account owner's own address.
    const from =
      process.env.RESEND_FROM || "Electrium Store <onboarding@resend.dev>";

    // Order confirmation time. Formatted for a Canadian audience.
    const dateStr = new Date().toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const { data, error } = await resendInstance.emails.send({
      from,
      to,
      subject: order?.orderId ? `Your Electrium order #${order.orderId}` : "Your Order Confirmation",
      html: buildHtml(order, customer, dateStr),
      text: buildText(order, customer, dateStr),
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
