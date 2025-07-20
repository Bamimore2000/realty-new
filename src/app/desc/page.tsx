"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";
import { sendJobPdf } from "@/actions";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ad manager", "virtual assistant"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function JobPdfForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    startTransition(() => {
      sendJobPdf(data)
        .then((res) => {
          if (res.success) toast.success("PDF sent!");
          else toast.error("Failed to send PDF");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Send Job PDF</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="email" className="mb-1 block">
            Email Address
          </Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="role" className="mb-1 block">
            Role
          </Label>
          <Select
            onValueChange={(value) =>
              setValue("role", value as FormValues["role"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="virtual assistant">
                Virtual Assistant
              </SelectItem>
              <SelectItem value="ad manager">Ad Manager</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Sending..." : "Send PDF"}
        </Button>
      </form>
    </div>
  );
}
