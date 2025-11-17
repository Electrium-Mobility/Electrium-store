import "@fontsource/nunito/400.css";
import "@fontsource/nunito/700.css";
import "./globals.css";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import { Toaster } from "sonner";
import { GlobalLoadingProvider } from "@/components/ui/GlobalLoadingProvider";
import RouteProgress from "@/components/ui/RouteProgress";

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
        <GlobalLoadingProvider>
          <RouteProgress />
          <Navbar />
          <main>
            {children}
            <Toaster richColors position="top-center" />
          </main>
          <Footer />
        </GlobalLoadingProvider>
      </body>
    </html>
  );
}
