"use client";
import { verifyTokenAndDelete } from "@/actions";
import ApplicantForm from "@/components/Register";
import TokenModal from "@/components/TokenModal";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "idle" | "verifying" | "error" | "success"
  >("idle");
  const [ref, setRef] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const token = searchParams.get("token");
  const urlRef = searchParams.get("ref");

  useEffect(() => {
    if (!token) {
      setShowModal(true);
    } else {
      verify(token);
    }
  }, [token]);

  async function verify(inputToken: string) {
    setStatus("verifying");

    const res = await verifyTokenAndDelete(inputToken);
    if (res.success) {
      setRef(res.ref || urlRef || null);
      setStatus("success");
      setShowModal(false);
    } else {
      setStatus("error");
    }
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">
        Invalid or Expired Token
      </div>
    );
  }

  if (showModal) {
    return <TokenModal onVerify={verify} />;
  }

  if (status !== "success") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        Verifying...
      </div>
    );
  }

  return (
    <div>
      <ApplicantForm refId={ref as string} />
    </div>
  );
}
