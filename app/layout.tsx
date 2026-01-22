import "@fontsource/nunito/400.css";
import "@fontsource/nunito/700.css";
import "./globals.css";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import { Toaster } from "sonner";
import { GlobalLoadingProvider } from "@/components/ui/GlobalLoadingProvider";
import RouteProgress from "@/components/ui/RouteProgress";

export const dynamic = 'force-dynamic';

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
      <head>
        <meta name="google-adsense-account" content="ca-pub-4532033066279183" />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        ></script>
      </head>
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
