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
  title: {
    default: "EVisitingCard — Digital Business Cards",
    template: "%s | EVisitingCard",
  },
  description: "Create and share your digital business card instantly. One link, infinite connections. Professional, modern, and mobile-friendly.",
  applicationName: "EVisitingCard",
  authors: [{ name: "EVisitingCard Team" }],
  keywords: ["digital business card", "vcard", "business card", "networking", "nfc card"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://evisitingcard.com",
    siteName: "EVisitingCard",
    title: "EVisitingCard — Digital Business Cards",
    description: "The modern way to share your professional identity.",
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
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
