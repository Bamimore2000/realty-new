import React from "react";
import LeaseApplicationForm from "./components/form";
import type { Metadata } from "next";

const dynamicImageUrl =
  "https://isfj6shkii.ufs.sh/f/7lSE5lws1RB32V6uVzUalG6TwSy1CK0hYIjPdvJgz8tRqixO";

export const metadata: Metadata = {
  title: "Lease Application - Apply for Your Invitation Homes Rental",
  description:
    "Submit your rental application with Invitation Homes. A fast, secure, and easy online lease application process for quality homes across the United States.",
  keywords: [
    "lease application",
    "rental application",
    "apply for rent",
    "tenant application",
    "property lease form",
    "rent application USA",
    "Invitation Homes application",
  ],
  openGraph: {
    title: "Lease Application - Invitation Homes",
    description:
      "Apply for your next rental home with Invitation Homes. A seamless and secure online lease application experience.",
    url: "https://www.invitationhomes.com/lease-application",
    siteName: "Invitation Homes",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: dynamicImageUrl,
        width: 1200,
        height: 630,
        alt: "Invitation Homes lease application page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lease Application - Invitation Homes",
    description:
      "Apply for your next rental home with Invitation Homes. Quick and secure lease application process.",
    images: [dynamicImageUrl],
    site: "@InvitationHomes",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Page = () => {
  return (
    <section>
      <LeaseApplicationForm />
    </section>
  );
};

export default Page;
