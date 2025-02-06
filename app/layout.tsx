import "@fontsource/nunito/400.css";
import "@fontsource/nunito/700.css";
import "./globals.css";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Electrium Shop",
  description: "Electrium Mobility's Shop",
  icons: {
    icon: "/img/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Nunito, sans-serif" }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
