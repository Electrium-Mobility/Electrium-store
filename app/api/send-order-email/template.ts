// Pure rendering for the order-confirmation email. No Next/Resend imports here
// so it can be unit-rendered/previewed in isolation. route.ts handles transport.

// === Brand palette (hard-coded hex — email clients can't read CSS vars) ===
const BRAND_GREEN = "#16a34a"; // --brand-primary
const BRAND_GREEN_DARK = "#15803d";
const BRAND_EMERALD = "#10b981"; // brand glow / wordmark accent
const SLATE = "#2f333c"; // --footer-background, used for header/footer bands
const TEXT_PRIMARY = "#0a0f14";
const TEXT_MUTED = "#64748b";
const BORDER = "#e5e7eb";
const PAGE_BG = "#f4f6f8";

// Resolve the absolute base URL once. Email images/links cannot be relative.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const LOGO_URL = process.env.EMAIL_LOGO_URL || (SITE_URL ? `${SITE_URL}/img/logo-dark-mode.png` : "");

// Escape user/DB-provided strings so a stray "<" can't break layout or inject markup.
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatCAD(n: unknown): string {
  const num = Number(n);
  return `CA $${(isNaN(num) ? 0 : num).toFixed(2)}`;
}

export type EmailItem = {
  name?: string;
  quantity?: number;
  sell_price?: number;
  rental_rate?: number;
  orderType?: string;
};

export type EmailOrder = {
  items?: EmailItem[];
  subtotal?: number;
  shipping?: number;
  donation?: number;
  total?: number;
  orderId?: string | number;
};

export type EmailCustomer = {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  province?: string | null;
  postalCode?: string;
  country?: string | null;
};

// One <tr> per cart line. Mirrors the on-screen Cart: unit price shown
// (rent -> "per day"), quantity in its own column.
function itemRow(item: EmailItem): string {
  const isRent = item.orderType === "rent";
  const unit = isRent
    ? `${formatCAD(item.rental_rate)} <span style="color:${TEXT_MUTED};">/ day</span>`
    : formatCAD(item.sell_price);
  const typeLabel = isRent ? "Rental" : "Purchase";

  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${TEXT_PRIMARY};">
        <strong>${esc(item.name)}</strong><br />
        <span style="font-size:12px;color:${TEXT_MUTED};">${typeLabel}</span>
      </td>
      <td align="center" style="padding:12px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${TEXT_PRIMARY};">
        ${esc(item.quantity ?? 1)}
      </td>
      <td align="right" style="padding:12px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${TEXT_PRIMARY};white-space:nowrap;">
        ${unit}
      </td>
    </tr>`;
}

// A right-aligned "label .... value" summary row (subtotal/shipping/etc.).
function summaryRow(label: string, value: string, opts: { bold?: boolean; color?: string } = {}): string {
  const weight = opts.bold ? "700" : "400";
  const color = opts.color || TEXT_PRIMARY;
  const size = opts.bold ? "16px" : "14px";
  return `
    <tr>
      <td align="right" style="padding:4px 16px 4px 0;font-size:${size};color:${color};font-weight:${weight};">${label}</td>
      <td align="right" style="padding:4px 0;font-size:${size};color:${color};font-weight:${weight};white-space:nowrap;width:120px;">${value}</td>
    </tr>`;
}

function header(): string {
  const brand = LOGO_URL
    ? `<img src="${LOGO_URL}" alt="Electrium Mobility" width="180" style="display:block;border:0;max-width:180px;height:auto;" />`
    : `<span style="font-family:'Nunito',Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:0.3px;">` +
      `<span style="color:#ffffff;">electrium</span> <span style="color:${BRAND_EMERALD};">mobility</span>` +
      `</span>`;
  return `
    <tr>
      <td style="background-color:${SLATE};padding:24px 32px;">
        ${brand}
      </td>
    </tr>`;
}

function ctaButton(orderId?: string | number): string {
  if (!SITE_URL || orderId === undefined || orderId === null) return "";
  const href = `${SITE_URL}/order-success/${encodeURIComponent(String(orderId))}`;
  return `
    <tr>
      <td style="padding:8px 32px 32px;">
        <a href="${href}" style="display:inline-block;background-color:${BRAND_GREEN};color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:12px 28px;border-radius:8px;">View your order</a>
      </td>
    </tr>`;
}

function shippingBlock(c: EmailCustomer): string {
  const line2 = [c.city, c.province, c.postalCode].filter(Boolean).map(esc).join(", ");
  const parts = [esc(c.address), line2, esc(c.country)].filter((p) => p && p.length);
  if (!parts.length) return "";
  return `
    <tr>
      <td style="padding:8px 32px 0;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.5px;color:${TEXT_MUTED};text-transform:uppercase;">Shipping to</p>
        <p style="margin:0;font-size:14px;line-height:1.5;color:${TEXT_PRIMARY};">${parts.join("<br />")}</p>
      </td>
    </tr>`;
}

export function buildHtml(order: EmailOrder, customer: EmailCustomer, dateStr: string): string {
  const items = Array.isArray(order.items) ? order.items : [];
  const rows = items.map(itemRow).join("");
  const greeting = customer.firstName ? `Thanks, ${esc(customer.firstName)}!` : "Thanks for your order!";
  const orderRef = order.orderId !== undefined && order.orderId !== null ? `Order #${esc(order.orderId)} · ${esc(dateStr)}` : esc(dateStr);
  const donationNum = Number(order.donation) || 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Electrium order</title>
</head>
<body style="margin:0;padding:0;background-color:${PAGE_BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PAGE_BG};padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

          ${header()}

          <tr>
            <td style="padding:32px 32px 8px;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${BRAND_GREEN};">✓ Order confirmed</p>
              <h1 style="margin:0 0 4px;font-size:22px;color:${TEXT_PRIMARY};">${greeting}</h1>
              <p style="margin:0;font-size:13px;color:${TEXT_MUTED};">${orderRef}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.5px;color:${TEXT_MUTED};text-transform:uppercase;border-bottom:2px solid ${BORDER};">Item</td>
                  <td align="center" style="padding:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.5px;color:${TEXT_MUTED};text-transform:uppercase;border-bottom:2px solid ${BORDER};">Qty</td>
                  <td align="right" style="padding:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.5px;color:${TEXT_MUTED};text-transform:uppercase;border-bottom:2px solid ${BORDER};">Price</td>
                </tr>
                ${rows}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${summaryRow("Subtotal", formatCAD(order.subtotal))}
                ${summaryRow("Shipping", formatCAD(order.shipping))}
                ${donationNum > 0 ? summaryRow("Donation 💚", formatCAD(donationNum)) : ""}
                <tr><td colspan="2" style="padding:8px 0 0;border-top:1px solid ${BORDER};"></td></tr>
                ${summaryRow("Total", formatCAD(order.total), { bold: true, color: BRAND_GREEN_DARK })}
              </table>
            </td>
          </tr>

          ${shippingBlock(customer)}

          ${ctaButton(order.orderId)}

          <tr><td style="font-size:0;line-height:0;height:32px;">&nbsp;</td></tr>

          <tr>
            <td style="background-color:${SLATE};padding:32px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffffff;">Electrium Mobility</p>
              <p style="margin:0;font-size:12px;color:#9aa3af;line-height:1.5;">
                Student-run electric vehicle design team · University of Waterloo<br />
                200 University Ave W, Waterloo, ON N2L 3G1, Canada
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Plain-text alternative — improves deliverability and renders where HTML can't.
export function buildText(order: EmailOrder, customer: EmailCustomer, dateStr: string): string {
  const items = Array.isArray(order.items) ? order.items : [];
  const lines = items.map((it) => {
    const unit = it.orderType === "rent" ? `${formatCAD(it.rental_rate)}/day` : formatCAD(it.sell_price);
    return `  - ${it.name} x ${it.quantity ?? 1} — ${unit}`;
  });
  const donationNum = Number(order.donation) || 0;
  return [
    `Order confirmed${customer.firstName ? `, thanks ${customer.firstName}!` : "!"}`,
    order.orderId !== undefined ? `Order #${order.orderId} · ${dateStr}` : dateStr,
    "",
    "Items:",
    ...lines,
    "",
    `Subtotal: ${formatCAD(order.subtotal)}`,
    `Shipping: ${formatCAD(order.shipping)}`,
    ...(donationNum > 0 ? [`Donation: ${formatCAD(donationNum)}`] : []),
    `Total: ${formatCAD(order.total)}`,
    "",
    "Electrium Mobility — University of Waterloo",
  ].join("\n");
}
