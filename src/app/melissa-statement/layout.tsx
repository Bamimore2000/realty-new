import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statement of Account — Melissa Cowart",
};

export default function MelissaStatementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
