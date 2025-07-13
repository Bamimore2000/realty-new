"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserAction } from "@/actions";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminUserPage() {
  const [referralLink, setReferralLink] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setReferralLink("");
    setMessage("");

    const result = await createUserAction(data);
    if (result.error) {
      setError(result.error);
    } else {
      setReferralLink(result.referralLink);
      setMessage(result.message);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create User"}
            </Button>

            {error && <p className="text-red-600 mt-2">{error}</p>}
            {referralLink && (
              <div className="text-green-600 mt-4 space-y-1">
                <p>{message}</p>
                <p>
                  Referral link:{" "}
                  <a
                    href={referralLink}
                    className="underline text-blue-600"
                    target="_blank"
                  >
                    {referralLink}
                  </a>
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
