import React from "react";
import LeaseApplicationForm from "./components/form";
import type { Metadata } from "next";

const dynamicImageUrl =
  "https://isfj6shkii.ufs.sh/f/7lSE5lws1RB32V6uVzUalG6TwSy1CK0hYIjPdvJgz8tRqixO";

export const metadata: Metadata = {
  title: "Lease Application - Apply for Your Dream Property",
  description:
    "Submit your rental application with Core Key Realty. Quick, secure, and easy online lease application process for properties across the United States.",
  keywords: [
    "lease application",
    "rental application",
    "apply for rent",
    "tenant application",
    "property lease form",
    "rent application USA",
    "Core Key Realty application",
  ],
  openGraph: {
    title: "Lease Application - Core Key Realty",
    description:
      "Apply for your next rental home with Core Key Realty. Fast and secure online lease application process.",
    url: "https://corekeyrealty.com/lease-application",
    siteName: "Core Key Realty",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: dynamicImageUrl,
        width: 1200,
        height: 630,
        alt: "Core Key Realty lease application page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lease Application - Core Key Realty",
    description:
      "Apply for your next rental home. Quick and secure application process.",
    images: [dynamicImageUrl],
    site: "@CoreKeyRealty",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <section>
      <LeaseApplicationForm />
    </section>
  );
};

export default page;
