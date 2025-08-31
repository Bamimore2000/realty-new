import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dynamicImageUrl =
  "https://isfj6shkii.ufs.sh/f/7lSE5lws1RB32V6uVzUalG6TwSy1CK0hYIjPdvJgz8tRqixO";

export const metadata: Metadata = {
  title: {
    default: "Core Key Realty - Your Trusted U.S. Real Estate Partner",
    template: "%s | Core Key Realty",
  },
  description:
    "Explore premier properties for sale and rent across the United States. Core Key Realty helps you make smart real estate decisions from coast to coast.",
  keywords: [
    "Core Key Realty",
    "real estate USA",
    "homes for sale",
    "houses in New York",
    "Texas real estate",
    "Florida properties",
    "buy a house in the US",
    "rental homes",
    "property management",
  ],
  authors: [{ name: "Core Key Realty", url: "https://corekeyrealty.com" }],
  creator: "Core Key Realty",
  publisher: "Core Key Realty",
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  metadataBase: new URL("https://corekeyrealty.com"),
  openGraph: {
    title: "Core Key Realty - Your Trusted U.S. Real Estate Partner",
    description:
      "Buy, rent, or invest in top properties across the United States. From New York to California, Core Key Realty connects you to your dream home.",
    url: "https://corekeyrealty.com",
    siteName: "Core Key Realty",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: dynamicImageUrl,
        width: 1200,
        height: 630,
        alt: "Core Key Realty homepage banner showing homes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Core Key Realty - U.S. Real Estate Solutions",
    description:
      "Trusted advisors in U.S. real estate. Find, buy, or rent your next home with Core Key Realty.",
    images: [dynamicImageUrl],
    site: "@CoreKeyRealty",
  },
  icons: {
    icon: dynamicImageUrl, // favicon as your dynamic image url (optional)
    shortcut: dynamicImageUrl,
    apple: dynamicImageUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <Navbar />
        <main className="pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
