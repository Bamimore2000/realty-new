import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="-mt-14">
      <SessionProvider>
        <Layout>{children}</Layout>
      </SessionProvider>
    </main>
  );
}
