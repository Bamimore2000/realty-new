"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Download,
  Loader2,
  CheckCircle,
  Printer,
  ShieldCheck,
  Send,
} from "lucide-react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sendRefundAssuranceEmail } from "./actions";

export default function RefundAssurancePage() {
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [tenantEmail, setTenantEmail] = useState("");
  const documentRef = useRef<HTMLDivElement>(null);

  const getPdfData = async () => {
    const element = documentRef.current;
    if (!element) return null;

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    const dataUrl = await toJpeg(element, {
      pixelRatio: 2,
      quality: 1,
      width,
      height,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [width, height],
    });

    pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);
    return { pdf, width, height };
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const result = await getPdfData();
      if (!result) return;

      result.pdf.save(`Refund_Assurance_Dharani_Addanki.pdf`);

      setComplete(true);
      setTimeout(() => setComplete(false), 3000);
    } catch (error) {
      console.error("Error generating PDF", error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!tenantEmail) {
      toast.error("Please enter a tenant email address");
      return;
    }

    try {
      setIsSending(true);
      const result = await getPdfData();
      if (!result) return;

      const pdfBase64 = result.pdf.output("datauristring").split(",")[1];
      const fileName = `Refund_Assurance_Dharani_Addanki.pdf`;

      const response = await sendRefundAssuranceEmail(
        tenantEmail,
        pdfBase64,
        fileName,
      );

      if (response.success) {
        toast.success("Refund Assurance document sent successfully!");
        setTenantEmail("");
      } else {
        toast.error(response.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email", error);
      toast.error("An unexpected error occurred while sending");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 shadow-xl sticky top-8">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">
                  Refund Assurance Portal
                </CardTitle>
              </div>
              <CardDescription>
                Official Refund Assurance Document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Property</span>
                  <span className="font-bold">5001 Hickory Park Dr</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Landlord</span>
                  <span className="font-bold">Joe Valdez</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="text-green-700 font-bold uppercase">
                    Approved
                  </span>
                </div>
              </div>

              {/* Email Section */}
              <div className="space-y-3 pt-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-black uppercase tracking-widest text-slate-500"
                >
                  Send to Tenant
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="tenant@example.com"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendEmail}
                    disabled={isSending || !tenantEmail}
                    size="icon"
                    className="bg-slate-900 hover:bg-slate-800 shrink-0"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  onClick={handleDownload}
                  disabled={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : complete ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <Download className="w-5 h-5 mr-2" />
                  )}
                  {loading
                    ? "Capturing Document..."
                    : complete
                      ? "PDF Downloaded"
                      : "Download Official PDF"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Local Print (Raw)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live HTML Document Preview */}
        <div className="lg:col-span-8 flex justify-center">
          <div
            ref={documentRef}
            className="bg-white w-[816px] shadow-2xl p-16 relative overflow-hidden"
            style={{
              fontFamily: '"Times New Roman", serif',
              minHeight: "1056px",
            }}
          >
            {/* Red Round Stamp Overlay */}
            <div className="absolute top-[320px] right-[60px] opacity-80 pointer-events-none transform rotate-[-8deg] z-50">
              <div
                className="w-44 h-44 border-4 border-red-700 rounded-full flex items-center justify-center relative p-2"
                style={{
                  filter: "url(#distressed-stamp)",
                }}
              >
                {/* SVG Filter for distress effect */}
                <svg className="hidden">
                  <defs>
                    <filter id="distressed-stamp">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="3"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="3"
                      />
                    </filter>
                  </defs>
                </svg>

                <div className="w-full h-full border-2 border-red-700 rounded-full flex flex-col items-center justify-center text-center p-1">
                  <img
                    src="/invitation-home.png"
                    alt="Invitation Homes"
                    className="h-5 mb-2 object-contain"
                    style={{
                      filter:
                        "invert(16%) sepia(89%) saturate(6011%) hue-rotate(357deg) brightness(97%) contrast(110%)",
                    }}
                  />
                  <div className="text-[9px] font-bold text-red-700 uppercase leading-none mb-1">
                    Invitation Homes
                  </div>
                  <div className="h-[1px] w-24 bg-red-700 mb-1" />
                  <div className="text-2xl font-black text-red-700 uppercase tracking-tighter leading-none py-1">
                    OFFICIAL
                  </div>
                  <div className="text-2xl font-black text-red-700 uppercase tracking-tighter leading-none mb-1">
                    SEAL
                  </div>
                  <div className="h-[1px] w-24 bg-red-700 mt-1" />
                </div>

                {/* Curved Text in Seal (Circular) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <defs>
                    <path
                      id="circlePath"
                      d="M 88, 88 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                    />
                  </defs>
                  <text className="fill-red-700 text-[9px] uppercase font-bold tracking-[0.25em]">
                    <textPath
                      href="#circlePath"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      • Refund Assurance • Virginia Division •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            {/* Green "APPROVED" Stamp */}
            <div className="absolute top-[420px] left-[50px] opacity-75 pointer-events-none transform rotate-[-5deg] z-50">
              <div
                className="w-40 h-20 border-4 border-green-700 rounded-lg flex items-center justify-center"
                style={{
                  filter: "url(#green-stamp-filter)",
                }}
              >
                <svg className="hidden">
                  <defs>
                    <filter id="green-stamp-filter">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.8"
                        numOctaves="2"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="2"
                      />
                    </filter>
                  </defs>
                </svg>
                <div className="text-3xl font-black text-green-700 uppercase tracking-widest">
                  APPROVED
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-8">
              <div className="space-y-1">
                <img
                  src="/invitation-home.png"
                  alt="Invitation Homes Official Logo"
                  className="h-14 object-contain mb-4"
                />
                <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
                  REFUND ASSURANCE AGREEMENT
                </h1>
              </div>
              <div className="text-right text-sm">
                <p className="font-bold">
                  Document ID: IH-RA-2026-
                  {(Math.random() * 1000000).toFixed(0).slice(0, 6)}
                </p>
                <p>
                  Date:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  State: <span className="font-bold">Virginia</span>
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-8 text-slate-800">
              {/* Tenant & Property Details */}
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="font-bold border-b border-slate-300 pb-1 uppercase text-xs">
                    Tenant Information:
                  </h3>
                  <p className="text-lg font-bold leading-tight">
                    Mr. Dharani Addanki
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold border-b border-slate-300 pb-1 uppercase text-xs">
                    Subject Property:
                  </h3>
                  <p className="text-md font-bold">
                    5001 Hickory Park Dr
                    <br />
                    Glen Allen, VA 23059
                  </p>
                </div>
              </div>

              {/* Approval Notice */}
              <div
                className="bg-green-50 border-2 border-green-700 rounded-lg p-6 text-center"
                style={{
                  background:
                    "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)",
                }}
              >
                <div className="text-2xl font-black text-green-800 uppercase mb-2">
                  TENANCY APPROVED
                </div>
                <p className="text-green-800 text-sm">
                  We are pleased to inform you that your application for tenancy
                  has been approved.
                </p>
              </div>

              {/* Payment & Refund Terms */}
              <div className="space-y-4">
                <h3 className="font-bold border-b border-slate-300 pb-1 uppercase text-xs">
                  PAYMENT SUMMARY & REFUND GUARANTEE:
                </h3>

                <div className="space-y-3">
                  <p className="text-sm">
                    This document serves as an official assurance that all fees
                    paid by <strong>Mr. Dharani Addanki</strong> are fully
                    refundable under the terms outlined below.
                  </p>
                </div>

                <table className="w-full border-collapse mt-4">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-800 font-bold text-xs uppercase">
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-200">
                      <td className="py-3 px-4">
                        Application Fee (Background Screening)
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          PAID
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold">$70.00</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-3 px-4">Security Deposit</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                          PENDING
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        $300.00
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-800 text-md font-bold">
                      <td
                        colSpan={2}
                        className="py-4 px-4 text-right uppercase"
                      >
                        Total Eligible for Refund:
                      </td>
                      <td className="py-4 px-4 text-right text-lg">$370.00</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Refund Assurance Terms */}
              <div className="space-y-6 pt-4">
                <h3 className="font-bold border-b border-slate-300 pb-1 uppercase text-xs">
                  OFFICIAL REFUND ASSURANCE TERMS:
                </h3>

                <div className="space-y-4 text-sm leading-relaxed text-justify">
                  <p>
                    <strong>1. REFUND ELIGIBILITY:</strong> All fees paid to
                    date, including the $70.00 application fee and the pending
                    $300.00 security deposit (once received), are fully
                    refundable to <strong>Mr. Dharani Addanki</strong> under the
                    following circumstances:
                  </p>

                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      The formal lease agreement is not executed by all parties
                      (tenant, landlord, and property manager)
                    </li>
                    <li>
                      Physical possession of the property (handing over of keys)
                      does not occur for any reason
                    </li>
                    <li>
                      The property is not available for move-in as scheduled
                    </li>
                  </ul>

                  <p>
                    <strong>2. REFUND TIMELINE:</strong> In the event that a
                    refund is due, Invitation Homes will process the full refund
                    within <strong>7 (seven) business days</strong> of the
                    tenant's written request.
                  </p>

                  <p>
                    <strong>3. GOVERNING LAW:</strong> This agreement is
                    governed by the landlord-tenant laws of the{" "}
                    <strong>State of Virginia</strong>, and all refund claims
                    will be processed in accordance with applicable state and
                    local regulations.
                  </p>

                  <p className="bg-blue-50 p-4 border-l-4 border-blue-700 italic">
                    <strong>NOTICE TO TENANT:</strong> This document is your
                    official written assurance of refund eligibility. Please
                    keep a copy for your records. All fees remain fully
                    refundable until the moment the lease agreement is signed by
                    all parties and physical possession is transferred.
                  </p>
                </div>
              </div>

              {/* Signatures Block */}
              <div className="pt-12 grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-xs uppercase font-bold text-slate-500">
                    Landlord:
                  </p>
                  <div className="space-y-1">
                    <div className="h-16 flex items-end border-b border-slate-400 pb-1">
                      <img
                        src="/signature-1.jpg"
                        alt="Joe Valdez Signature"
                        className="h-14 object-contain object-left-bottom"
                      />
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      Joe Valdez
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Property Owner / Landlord
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Date:{" "}
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs uppercase font-bold text-slate-500">
                    Attorney of Record:
                  </p>
                  <div className="space-y-1">
                    <div className="h-16 flex items-end border-b border-slate-400 pb-1">
                      <img
                        src="/images-sig-2.jpg"
                        alt="Daniel Hall Signature"
                        className="h-14 object-contain object-left-bottom"
                      />
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      Daniel Hall, Esq.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Attorney at Law
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Date:{" "}
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Footer */}
            <div className="absolute bottom-12 left-16 right-16 border-t border-slate-200 pt-6 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
              <span>www.invitationhomes.com</span>
              <span>Virginia Division</span>
              <span>Prop ID: 5001-HICK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
