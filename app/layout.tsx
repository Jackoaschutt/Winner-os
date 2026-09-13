import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WINNER OS — Find the products. Find the ads. Find the opportunity.",
  description:
    "A free ecommerce intelligence platform: research winning products, spy on the ads already selling them, analyze creatives, and build your next test — all in one dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
