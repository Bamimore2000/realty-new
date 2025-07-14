"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  // Replace with actual user data fetching
  const [userName, setUserName] = useState<string>("");
  // Simulate fetching user name
  useEffect(() => {
    // Imagine fetching user info here
    setUserName(session?.user?.name as string);
  }, [session]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Greeting */}
      <h1 className="text-3xl font-semibold leading-tight">
        Hello, <span className="text-blue-600">{userName}</span> 👋
      </h1>

      {/* Info Alert */}
      <Alert variant="default" className="max-w-3xl">
        <AlertTitle>Employer Card Processing</AlertTitle>
        <AlertDescription>
          Your employer card is currently being processed and will be sent to
          your address soon. You won’t be able to fully use this dashboard until
          your card arrives. Thanks for your patience!
        </AlertDescription>
      </Alert>

      {/* Action Card */}
      <Card className="max-w-3xl border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            While you wait for your employer card, feel free to get familiar
            with the system. Here is what you can do:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Review company announcements</li>
            <li>Check out available resources in the files section</li>
            <li>Prepare for upcoming tasks and projects</li>
          </ul>
          <Button variant="outline" disabled>
            Start Working (Disabled)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
