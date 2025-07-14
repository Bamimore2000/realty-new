// components/UnavailableFeature.tsx
"use client";

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UnavailableFeatureProps {
  icon: ReactNode;
  title: string;
  featureName: string;
}

export default function UnavailableFeature({
  icon,
  title,
  featureName,
}: UnavailableFeatureProps) {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col items-center space-y-8">
      {icon}

      <h1 className="text-2xl font-semibold">{title}</h1>

      <Alert variant="default" className="max-w-md">
        <AlertTitle>Employer Card Pending</AlertTitle>
        <AlertDescription>
          Your employer card has yet to arrive. {featureName} will be accessible
          once your card is delivered to your address. Thank you for your
          understanding.
        </AlertDescription>
      </Alert>

      <Card className="w-full border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>What to do next?</CardTitle>
          <CardDescription>
            While waiting for your employer card, please keep an eye on
            announcements or contact support if you have any questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add helpful links or info here if needed */}
        </CardContent>
      </Card>
    </div>
  );
}
