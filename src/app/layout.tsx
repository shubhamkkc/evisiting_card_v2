import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://card.growxdigitech.com"),
  title: {
    default: "Digital Business Card for Indian Businesses | GrowX Digital Card — ₹499/year",
    template: "%s | GrowX Digital Card",
  },
  description: "Get your digital visiting card made in 24 hours. Trusted by electricians, photographers, CA firms & shops across India. Starting ₹499/year.",
  applicationName: "GrowX Digital Card",
  authors: [{ name: "GrowX Digitech" }],
  keywords: [
    "digital business card India",
    "digital visiting card online",
    "online visiting card maker India",
    "digital card for small business",
    "₹499 digital business card",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://card.growxdigitech.com",
    siteName: "GrowX Digital Card",
    title: "Digital Business Card for Indian Businesses | GrowX Digital Card — ₹499/year",
    description: "Get your digital visiting card made in 24 hours. Trusted by electricians, photographers, CA firms & shops across India. Starting ₹499/year.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "jpCvBLJ_31NzcKm-poZ9P3a8Yz5_gpfZqxMLNKazqt0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&family=Space+Grotesk:wght@500;600;700&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
