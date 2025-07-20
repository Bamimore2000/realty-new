"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useTransition } from "react";
import { Role, sendNewHireEmail } from "@/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  role: string;
}

export default function NewEmployeeForm() {
  const [flag, setFlag] = useState<Role>("virtual assistant");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>();
  const [isPending, startTransition] = useTransition();
  const onSubmit: SubmitHandler<EmployeeFormData> = (data) => {
    startTransition(() => {
      sendNewHireEmail(data, flag);
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-center">New Hire Form</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="flag">Select Flag</Label>
              <Select
                value={flag}
                onValueChange={setFlag as unknown as (arg0: string) => void}
              >
                <SelectTrigger id="flag" className="w-full">
                  <SelectValue placeholder="Choose a flag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ad manager">Ad Manager</SelectItem>
                  <SelectItem value="virtual assistant">
                    Virtual Assistant
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending…" : "Generate PDF & Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
