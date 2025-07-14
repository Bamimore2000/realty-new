"use client";

import { useState, useTransition } from "react";
import { addEmailAction } from "@/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function EmailAddPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await addEmailAction(formData);
      setMessage(res.message);
    });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="Enter email address"
              required
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
          {message && (
            <p className="text-sm mt-4 text-muted-foreground">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
