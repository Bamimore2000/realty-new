"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Worker Login
          </CardTitle>
          <CardDescription className="text-center">
            Only authorized workers can access this platform. Please use the
            email address you registered with.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <IconBrandGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
