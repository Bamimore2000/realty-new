"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitApplication, uploadImage } from "@/actions";
import { applicantSchema } from "@/lib/applicantSchema";

export const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

type ApplicantFormData = z.infer<typeof applicantSchema>;

export default function ApplicantForm({ refId }: { refId?: string }) {
  console.log("refId:", refId);
  const [loadingFront, setLoadingFront] = useState(false);
  const [loadingBack, setLoadingBack] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantSchema),
  });

  // Upload helpers for cloudinary images (front and back)
  const onDropFront = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setLoadingFront(true);
    const file = acceptedFiles[0];
    const base64 = await fileToBase64(file);
    try {
      const url = await uploadImage(base64);
      setValue("idFront", url, { shouldValidate: true });
    } catch {
      alert("Failed to upload front ID image");
    }
    setLoadingFront(false);
  };

  const onDropBack = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setLoadingBack(true);
    const file = acceptedFiles[0];
    const base64 = await fileToBase64(file);
    try {
      const url = await uploadImage(base64);
      setValue("idBack", url, { shouldValidate: true });
    } catch {
      alert("Failed to upload back ID image");
    }
    setLoadingBack(false);
  };

  const frontDropzone = useDropzone({
    onDrop: onDropFront,
    accept: { "image/*": [] },
  });
  const backDropzone = useDropzone({
    onDrop: onDropBack,
    accept: { "image/*": [] },
  });

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  const onSubmit = async (data: ApplicantFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      // TODO: send data to backend here via fetch or server action
      const result = await submitApplication(data, refId as string);
      if (result.success) {
        setSubmitSuccess(true);
        reset();
      } else {
        setSubmitError("Failed to submit the form.");
      }
    } catch (error) {
      console.log(error);
      setSubmitError("Failed to submit the form.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Applicant Form
      </h2>

      {/* Full Name */}
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input id="fullName" {...register("fullName")} />
        {errors.fullName && (
          <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* State */}
      <div>
        <Label htmlFor="state">State *</Label>
        <Controller
          control={control}
          name="state"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.state && (
          <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
        )}
      </div>

      {/* Bank Name */}
      <div>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input id="bankName" {...register("bankName")} />
        {errors.bankName && (
          <p className="text-sm text-red-600 mt-1">{errors.bankName.message}</p>
        )}
      </div>

      {/* Credit Score */}
      <div>
        <Label htmlFor="creditScore">Credit Score</Label>
        <Input
          id="creditScore"
          type="number"
          {...register("creditScore", { valueAsNumber: true })}
          min={300}
          max={850}
        />
        {errors.creditScore && (
          <p className="text-sm text-red-600 mt-1">
            {errors.creditScore.message}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" {...register("phoneNumber")} />
        {errors.phoneNumber && (
          <p className="text-sm text-red-600 mt-1">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" {...register("address")} />
      </div>

      {/* Date of Birth */}
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
      </div>

      {/* Working Experience */}
      <div>
        <Label htmlFor="workingExperience">Working Experience</Label>
        <Textarea id="workingExperience" {...register("workingExperience")} />
      </div>

      {/* Gender */}
      <div>
        <Label>Gender</Label>
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* SSN */}
      <div>
        <Label htmlFor="ssn">SSN</Label>
        <Input id="ssn" {...register("ssn")} />
        {errors.ssn && (
          <p className="text-sm text-red-600 mt-1">{errors.ssn.message}</p>
        )}
      </div>

      {/* Felony */}
      <div>
        <Label htmlFor="felony">Felony</Label>
        <Textarea id="felony" {...register("felony")} />
      </div>

      {/* Valid ID Front Upload */}
      <div>
        <Label>Valid ID Front</Label>
        <div
          {...frontDropzone.getRootProps()}
          className="border border-dashed border-gray-400 rounded p-4 cursor-pointer text-center"
        >
          <input {...frontDropzone.getInputProps()} />
          {loadingFront ? (
            <p>Uploading...</p>
          ) : watch("idFront") ? (
            <img
              src={watch("idFront")}
              alt="Valid ID Front"
              className="mx-auto max-h-40 object-contain"
            />
          ) : (
            <p>Drag n drop or click to upload front ID image</p>
          )}
        </div>
      </div>

      {/* Valid ID Back Upload */}
      <div>
        <Label>Valid ID Back</Label>
        <div
          {...backDropzone.getRootProps()}
          className="border border-dashed border-gray-400 rounded p-4 cursor-pointer text-center"
        >
          <input {...backDropzone.getInputProps()} />
          {loadingBack ? (
            <p>Uploading...</p>
          ) : watch("idBack") ? (
            <img
              src={watch("idBack")}
              alt="Valid ID Back"
              className="mx-auto max-h-40 object-contain"
            />
          ) : (
            <p>Drag n drop or click to upload back ID image</p>
          )}
        </div>
      </div>

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>

      {submitError && <p className="text-red-600 text-center">{submitError}</p>}
      {submitSuccess && (
        <p className="text-green-600 text-center font-semibold">
          Application submitted successfully!
        </p>
      )}
    </form>
  );
}
