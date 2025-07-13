import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        Oops! Something went wrong.
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        We couldn&apos;t load the page you were looking for. Please try
        refreshing or go back to the homepage.
      </p>
      <Link href="/">
        <Button variant="default" className="px-6">
          Go Home
        </Button>
      </Link>
    </main>
  );
}
