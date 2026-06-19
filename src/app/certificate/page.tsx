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
  RefreshCw,
  Printer,
  ShieldCheck,
  Send,
} from "lucide-react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sendCertificateEmail } from "./actions";

export default function CertificatePage() {
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [tenantEmail, setTenantEmail] = useState("");
  const [tenantName, setTenantName] = useState("Jaburi Denson");
  const [propertyAddress, setPropertyAddress] = useState(
    "2300 Hilltop Dr, Albany, GA 31707",
  );
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

      const fileName = `Certificate_Of_Tenant_Registration_${tenantName.replace(/\s+/g, "_")}.pdf`;
      result.pdf.save(fileName);

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
      const fileName = `Certificate_Of_Tenant_Registration_${tenantName.replace(/\s+/g, "_")}.pdf`;

      const response = await sendCertificateEmail(
        tenantEmail,
        pdfBase64,
        fileName,
        tenantName,
        propertyAddress,
      );

      if (response.success) {
        toast.success("Certificate sent successfully to tenant!");
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
                <CardTitle className="text-xl">Certificate Portal</CardTitle>
              </div>
              <CardDescription>
                Certificate of Tenant Registration System
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tenant Info */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="tenantName"
                    className="text-xs font-bold uppercase tracking-widest text-slate-500"
                  >
                    Tenant Name
                  </Label>
                  <Input
                    id="tenantName"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="propertyAddress"
                    className="text-xs font-bold uppercase tracking-widest text-slate-500"
                  >
                    Property Address
                  </Label>
                  <Input
                    id="propertyAddress"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="w-full"
                  />
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
                      : "Download Certificate"}
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

        {/* Live HTML Certificate Preview */}
        <div className="lg:col-span-8 flex justify-center">
          <div
            ref={documentRef}
            className="bg-white w-[816px] shadow-2xl relative overflow-hidden"
            style={{
              fontFamily: "'Times New Roman', serif",
              minHeight: "1056px",
            }}
          >
            {/* Header Section */}
            <div className="pt-12 px-12 pb-6 text-center border-b-0">
              <p className="text-sm text-slate-500 uppercase tracking-[0.2em] mb-2">
                State of Georgia · Dougherty County
              </p>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">
                Dougherty County Council — Housing &amp; Property Division
              </h1>
              <p className="text-sm text-slate-500 italic">
                Office of Residential Registration · Albany District
              </p>

              <div className="flex justify-between items-center mt-8 border-t border-b border-slate-300 py-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 border border-slate-200 rounded-lg">
                    <img
                      src="https://dokumfe7mps0i.cloudfront.net/media/logos/2022/06/283238_1655844560.7826822_InvitationHomesBoldedcmykRevLogo.png"
                      alt="Invitation Homes"
                      className="h-10 object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Core Key Realty
                    </h2>
                    <p className="text-sm text-slate-500">
                      LICENSED PROPERTY MANAGEMENT
                    </p>
                    <p className="text-xs text-slate-400">
                      Lic. No. GA-PMO-2024-3821 · Dougherty County
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase">
                    Document Reference
                  </p>
                  <p className="text-lg font-bold text-amber-600">
                    REG-2026-0836
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Date issued:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="py-8">
                <p className="text-sm text-amber-600 uppercase tracking-[0.3em] mb-2">
                  Official Document
                </p>
                <h2 className="text-4xl font-bold text-slate-800 mb-2">
                  Certificate of Tenant Registration
                </h2>
                <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
              </div>
            </div>

            <div className="px-12 space-y-8">
              {/* Tenant Info Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-6">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Registered Tenant
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {tenantName}
                    </p>
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        County
                      </p>
                      <p className="text-lg text-slate-700">
                        Dougherty County, Georgia
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Property Address
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      {propertyAddress}
                    </p>
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Tenancy Type
                      </p>
                      <p className="text-lg text-slate-700">
                        Residential — Long Term Lease
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Text */}
              <div className="space-y-6 text-slate-800 text-lg leading-relaxed">
                <p>
                  This is to certify, in accordance with the statutes and
                  regulations of the{" "}
                  <strong>State of Georgia Housing Authority</strong> and the{" "}
                  <strong>
                    Dougherty County Council — Housing &amp; Property Division
                  </strong>
                  , that the residential property located at{" "}
                  <strong>{propertyAddress}</strong> has been duly registered,
                  reviewed, and officially allocated to the named tenant,{" "}
                  <strong>{tenantName}</strong>.
                </p>
                <p>
                  This registration was processed and approved under the
                  authority of <strong>Core Key Realty</strong> (Lic. No.
                  GA-PMO-2024-3821), a fully licensed property management firm
                  operating within the jurisdiction of Dougherty County. All
                  requisite documentation, background screening, lease
                  compliance reviews, and statutory filings have been completed
                  in accordance with the{" "}
                  <em>Georgia Residential Tenancy Act</em> and the applicable
                  local housing ordinances.
                </p>
                <p>
                  This certificate grants <strong>{tenantName}</strong> the
                  exclusive and legally recognized right of occupancy of the
                  above-mentioned premises, subject to the terms and conditions
                  of the duly executed lease agreement on file with this office.
                  Any transfer, subletting, or modification of tenancy must be
                  formally registered with the Dougherty County Council —
                  Housing &amp; Property Division and Core Key Realty.
                </p>
              </div>

              {/* Legal Notice */}
              <div className="bg-slate-900 text-white p-6">
                <p className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-amber-400">§</span> Legal Notice:
                </p>
                <p className="text-sm leading-relaxed">
                  This document has been issued under the authority of the
                  Dougherty County Council and the Georgia Department of
                  Community Affairs (DCA). Falsification or misuse of this
                  certificate is a violation of O.C.G.A. § 16-10-20 and may
                  result in civil or criminal penalties. This certificate is
                  valid only for the named tenant and address above.
                </p>
              </div>

              {/* Signature Section */}
              <div className="pt-8 pb-24">
                <div className="grid grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <div className="h-20 flex items-center justify-center mb-2">
                      <span className="text-4xl text-slate-300 italic font-serif">
                        Daniel Hall
                      </span>
                    </div>
                    <div className="border-t border-slate-300 pt-3">
                      <p className="text-sm font-bold text-slate-800">
                        Daniel Hall
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        Landlord &amp; Authorized Agent
                      </p>
                      <p className="text-xs text-slate-400">Core Key Realty</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="inline-block">
                      <div className="w-40 h-40 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-2 rounded-full border-2 border-slate-700"></div>
                        <div className="text-center space-y-1">
                          <p className="text-xs font-bold uppercase text-slate-600 tracking-widest">
                            Dougherty County
                          </p>
                          <div className="w-16 h-0.5 bg-slate-600 mx-auto my-1"></div>
                          <p className="text-xl font-black text-slate-800 uppercase leading-none">
                            Approved
                          </p>
                          <p className="text-xl font-black text-slate-800 uppercase leading-none">
                            &amp; Registered
                          </p>
                          <div className="w-16 h-0.5 bg-slate-600 mx-auto my-1"></div>
                          <p className="text-xs font-bold uppercase text-slate-600">
                            Housing Division
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="h-20 flex items-center justify-center mb-2">
                      <span className="text-4xl text-slate-300 italic font-serif">
                        Rob Adams
                      </span>
                    </div>
                    <div className="border-t border-slate-300 pt-3">
                      <p className="text-sm font-bold text-slate-800">
                        Robinson Allan, Esq.
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        Attorney of Record
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-900 text-slate-400 px-12 py-4 flex justify-between items-center text-xs border-t-4 border-amber-600">
              <div>Core Key Realty • In partnership with Invitation Homes</div>
              <div>Dougherty County Housing Division</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
