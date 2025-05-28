import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { to, order } = await req.json();

  console.log("[EMAIL API] Called with:", to, order);

  try {
    const { data, error } = await resend.emails.send({
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
