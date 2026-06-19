"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Loader2, CheckCircle, RefreshCw, Printer, ShieldCheck, Send } from "lucide-react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sendStatementEmail } from "./actions";

export default function StatementPage() {
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [tenantEmail, setTenantEmail] = useState("");
  const [tenantName, setTenantName] = useState("Jaburi Denson");
  const [propertyAddress, setPropertyAddress] = useState("2300 Hilltop Dr, Albany, GA 31707");
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
      height
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
      
      const fileName = `Statement_of_Account_${tenantName.replace(/\s+/g, "_")}.pdf`;
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
      const fileName = `Statement_of_Account_${tenantName.replace(/\s+/g, "_")}.pdf`;

      const response = await sendStatementEmail(tenantEmail, pdfBase64, fileName, tenantName, propertyAddress);

      if (response.success) {
        toast.success("Statement sent successfully to tenant!");
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
                <CardTitle className="text-xl">Statement Portal</CardTitle>
              </div>
              <CardDescription>
                Statement of Account System
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tenant Info */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="tenantName" className="text-xs font-bold uppercase tracking-widest text-slate-500">
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
                  <Label htmlFor="propertyAddress" className="text-xs font-bold uppercase tracking-widest text-slate-500">
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
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500">
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
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
                  {loading ? "Capturing Document..." : complete ? "PDF Downloaded" : "Download Statement"}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" />
                  Local Print (Raw)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live HTML Statement Preview */}
        <div className="lg:col-span-8 flex justify-center">
          <div 
            ref={documentRef}
            className="bg-white w-[816px] shadow-2xl relative overflow-hidden"
            style={{ 
              fontFamily: "'Times New Roman', serif", 
              minHeight: "1056px"
            }}
          >
            {/* Header Section - Dark Blue Banner */}
            <div className="bg-slate-900 text-white px-12 py-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <img
                      src="https://dokumfe7mps0i.cloudfront.net/media/logos/2022/06/283238_1655844560.7826822_InvitationHomesBoldedcmykRevLogo.png"
                      alt="Invitation Homes"
                      className="h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Core Key Realty</h2>
                    <p className="text-sm text-slate-300">LICENSED PROPERTY MANAGEMENT</p>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold">Statement of Account</h1>
                </div>
              </div>
            </div>

            <div className="px-12 py-8 space-y-8">
              {/* Tenant Info Header */}
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-6">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{tenantName}</h3>
                    <p className="text-sm text-slate-500 uppercase tracking-wider">Residential Tenant</p>
                    <div className="mt-4 space-y-1">
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Property</span>
                      </p>
                      <p className="text-sm text-slate-700">{propertyAddress}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        <span className="font-semibold">Monthly Rent</span> $800.00 / month
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end items-start">
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-full text-xs font-bold uppercase">
                      ⚠️ Balance Pending
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-sm p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Paid</p>
                  <p className="text-2xl font-bold text-green-700">$2,170</p>
                  <p className="text-xs text-slate-400">Rent (2 Mo), Deposit, App</p>
                </div>
                <div className="border border-slate-200 rounded-sm p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Pending</p>
                  <p className="text-2xl font-bold text-amber-700">$200</p>
                  <p className="text-xs text-slate-400">Fees</p>
                </div>
                <div className="border border-slate-200 rounded-sm p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Lease Value</p>
                  <p className="text-2xl font-bold text-slate-800">$2,370</p>
                  <p className="text-xs text-slate-400">Rent, Deposit, Fees</p>
                </div>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-3 gap-6 border-t border-b border-slate-200 py-4">
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 uppercase">Property Address</p>
                  <p className="text-sm text-slate-700">{propertyAddress}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 uppercase">Tenant Name</p>
                  <p className="text-sm text-slate-700">{tenantName}</p>
                  <p className="text-xs text-slate-400 uppercase mt-3">Landlord / Attorney</p>
                  <p className="text-sm text-slate-700">Daniel Hall (Landlord)</p>
                  <p className="text-sm text-slate-700">Rob Adams (Attorney)</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-xs text-slate-400 uppercase">Invoice Reference</p>
                  <p className="text-sm text-slate-700 font-mono">#INV-2026-0834</p>
                  <p className="text-xs text-slate-400 uppercase mt-3">Date Issued</p>
                  <p className="text-sm text-slate-700">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>

              {/* Previous Payments Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Previous Payments Received
                </h4>
                <p className="text-xs text-slate-500">Note: Receipts of the payments made prior will be sent over separately.</p>
                
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="py-3 px-4 text-left text-xs uppercase">Description</th>
                      <th className="py-3 px-4 text-center text-xs uppercase">Status</th>
                      <th className="py-3 px-4 text-right text-xs uppercase">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-100">
                      <td className="py-4 px-4">
                        <div>Security Deposit</div>
                        <div className="text-xs text-slate-500">Held in escrow</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          ✓ Paid
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">$500.00</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-4 px-4">
                        <div>Application / Setup Fee</div>
                        <div className="text-xs text-slate-500">Processing and administration</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          ✓ Paid
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">$70.00</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-4 px-4">
                        <div>Month 1 — Rent</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          ✓ Paid
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">$800.00</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-4 px-4">
                        <div>Month 2 — Rent</div>
                        <div className="text-xs text-slate-500">Paid in full</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          ✓ Paid
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">$800.00</td>
                    </tr>
                    <tr className="bg-slate-100">
                      <td colSpan={2} className="py-4 px-4 text-right font-bold">
                        Total Received to Date:
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-lg">
                        $2,170.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Outstanding Balance Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Outstanding Balance Due
                </h4>
                
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="py-3 px-4 text-left text-xs uppercase">Description</th>
                      <th className="py-3 px-4 text-left text-xs uppercase">Notes</th>
                      <th className="py-3 px-4 text-right text-xs uppercase">Amount Due</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-100 bg-amber-50">
                      <td className="py-4 px-4 font-medium">Community Development Fee</td>
                      <td className="py-4 px-4 text-xs text-slate-500">Annual fee</td>
                      <td className="py-4 px-4 text-right font-medium">$150.00</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-amber-50">
                      <td className="py-4 px-4 font-medium">Council Fee</td>
                      <td className="py-4 px-4 text-xs text-slate-500">Standard fee</td>
                      <td className="py-4 px-4 text-right font-medium">$50.00</td>
                    </tr>
                    <tr className="bg-slate-900 text-white">
                      <td colSpan={2} className="py-4 px-4 text-right font-bold text-lg">
                        Total Balance Due
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-xl">
                        $200.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border-l-4 border-amber-600 p-5 mb-16">
                <h5 className="text-sm font-bold text-amber-800 mb-2">
                  Important Notice Regarding Your Move-in
                </h5>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Please be advised that the only matter currently delaying your move-in process is the final compliance requirement mandated by state law. To ensure we can proceed and finalize everything smoothly, the outstanding balance must be settled in full ahead of our meeting by 9:00 AM today.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-900 text-slate-400 px-12 py-4 flex justify-between items-center text-xs">
              <div>Core Key Realty • In partnership with Invitation Homes</div>
              <div>Dougherty County Housing Division</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
