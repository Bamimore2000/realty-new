"use client";

import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Download, Printer, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { sendCertificateEmail } from "./actions";

const lbl: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#8a8070",
  fontWeight: 600,
  marginBottom: 4,
};

const val: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: "#1a1a1a",
  lineHeight: 1.5,
};

export default function TanyaMarieMendyRegistrationPage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const [tenantName, setTenantName] = useState("Mrs. Tanya Marie Mendy");
  const [propertyAddress, setPropertyAddress] = useState("6550 Kelso Lake Rd, Athol, ID 83801");
  const [dateIssued, setDateIssued] = useState("June 23, 2026");
  const [registrationId, setRegistrationId] = useState("REG-2026-0903");

  const generatePdfBase64 = async (): Promise<{ base64: string; pdf: jsPDF } | null> => {
    const element = certificateRef.current;
    if (!element) return null;
    const width = element.scrollWidth;
    const height = element.scrollHeight;
    const dataUrl = await toJpeg(element, {
      pixelRatio: 2,
      quality: 0.95,
      skipAutoScale: true,
      style: { margin: "0", maxWidth: "none" },
    });
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [width, height] });
    pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);
    return { base64: pdf.output("datauristring").split(",")[1], pdf };
  };

  const handleDownload = async () => {
    try {
      const result = await generatePdfBase64();
      if (!result) return;
      result.pdf.save(`${tenantName.replace(/\s+/g, "-").toLowerCase()}-registration.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    }
  };

  const handleSendEmail = async () => {
    if (!email) { toast.error("Please enter an email address."); return; }
    try {
      setIsSending(true);
      const result = await generatePdfBase64();
      if (!result) return;
      const res = await sendCertificateEmail(email, result.base64, `${tenantName.replace(/\s+/g, "-").toLowerCase()}-registration.pdf`);
      if (res.success) { toast.success("Certificate emailed successfully!"); }
      else { toast.error(res.error || "Failed to send email."); }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sending.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f0ede8", padding: "40px 20px", color: "#1a1a1a", minHeight: "100vh" }}>
      {/* Controls */}
      <div className="no-print" style={{ maxWidth: 860, margin: "0 auto 24px", display: "flex", gap: 12, flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", background: "#fff", padding: "16px", borderRadius: 8, border: "1px solid #d4c9b0" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ ...lbl, display: "block" }}>Tenant Name</label>
            <input type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13 }} />
          </div>
          <div style={{ flex: 2, minWidth: 260 }}>
            <label style={{ ...lbl, display: "block" }}>Property Address</label>
            <input type="text" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13 }} />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ ...lbl, display: "block" }}>Date Issued</label>
            <input type="text" value={dateIssued} onChange={(e) => setDateIssued(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13 }} />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ ...lbl, display: "block" }}>Registration ID</label>
            <input type="text" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13 }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="email"
            placeholder="Tenant email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 8, border: "1px solid #d4c9b0", fontSize: 13, background: "#fff", outline: "none" }}
          />
          <button type="button" onClick={handleSendEmail} disabled={isSending} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "#0f1f3d", color: "#fff", border: "none", cursor: isSending ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, opacity: isSending ? 0.7 : 1 }}>
            {isSending ? (<><RefreshCw size={15} className="spin-icon" style={{ animation: "spin 1s linear infinite" }} /> Sending…</>) : (<><Send size={15} /> Send to Tenant</>)}
          </button>
          <button type="button" onClick={handleDownload} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "#b8943a", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <Download size={15} /> Download PDF
          </button>
          <button type="button" onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "#fff", color: "#0f1f3d", border: "1px solid #d4c9b0", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <Printer size={15} /> Print
          </button>
        </div>
      </div>

      {/* Certificate Document */}
      <div ref={certificateRef} style={{ maxWidth: 860, margin: "0 auto", background: "#fff", boxShadow: "0 4px 40px rgba(0,0,0,0.14)", position: "relative" }}>
        {/* Decorative borders */}
        <div style={{ position: "absolute", inset: 14, border: "2px solid #c8b97a", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 18, border: "1px solid #e0d4a8", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, padding: "36px 48px 0 48px" }}>
          {/* Government Banner */}
          <div style={{ textAlign: "center", borderBottom: "2px solid #0f1f3d", paddingBottom: 16, marginBottom: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8a8070", margin: "0 0 4px 0" }}>
              State of Idaho · Kootenai County
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0f1f3d", margin: "0 0 4px 0", letterSpacing: "0.04em" }}>
              Kootenai County Council — Housing &amp; Property Division
            </h2>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a8070", margin: 0 }}>
              Office of Residential Registration · Athol District
            </p>
          </div>

          {/* Issuing Agent Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #e8e4dc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ background: "#f7f4ef", border: "1px solid #e8e4dc", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center" }}>
                <img src="/invitation-home.png" alt="Invitation Homes" style={{ height: 40, objectFit: "contain" }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#0f1f3d" }}>Invitation Homes</div>
                <div style={{ fontSize: 10, color: "#8a8070", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>Licensed Property Management</div>
                <div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>Lic. No. ID-PMO-2026-902 · Kootenai County</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a8070", marginBottom: 4 }}>Document Reference</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#b8943a" }}>{registrationId}</div>
              <div style={{ fontSize: 10, color: "#8a8070", marginTop: 4 }}>
                Date Issued: <strong style={{ color: "#1a1a1a" }}>{dateIssued}</strong>
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div style={{ textAlign: "center", margin: "28px 0 28px 0" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "#b8943a", margin: "0 0 10px 0" }}>Official Document</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: "#0f1f3d", margin: "0 0 12px 0", lineHeight: 1.1 }}>
              Certificate of Home Registration
            </h1>
            <div style={{ width: 80, height: 3, background: "linear-gradient(90deg, #b8943a, #d4ad52, #b8943a)", margin: "0 auto" }} />
          </div>

          {/* Tenant & Property Info */}
          <div style={{ background: "#f7f4ef", border: "1px solid #d4c9b0", padding: "24px 28px", marginBottom: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <p style={lbl}>Registered Tenant</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0f1f3d", margin: 0 }}>{tenantName}</p>
            </div>
            <div>
              <p style={lbl}>Property Address</p>
              <p style={{ ...val, fontSize: 15, margin: 0 }}>{propertyAddress}</p>
            </div>
            <div>
              <p style={lbl}>County</p>
              <p style={{ ...val, margin: 0 }}>Kootenai County, Idaho</p>
            </div>
            <div>
              <p style={lbl}>Tenancy Type</p>
              <p style={{ ...val, margin: 0 }}>Residential — Long Term Lease</p>
            </div>
          </div>

          {/* Fees Summary Box */}
          <div style={{ background: "#eaf4ec", border: "1px solid #a5d6a7", borderRadius: 6, padding: "16px 20px", marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1b5e20", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
              ✓ Initial Fees Satisfied — $740.00
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12, color: "#374151" }}>
              <div>Application Fee: <strong>$140.00</strong></div>
              <div>Security Deposit: <strong>$600.00</strong></div>
            </div>
          </div>

          {/* Pending Notice */}
          <div style={{ background: "#fff3cd", border: "1px solid #d4ad52", borderLeft: "4px solid #b8943a", borderRadius: 4, padding: "14px 18px", marginBottom: 28, fontSize: 12, color: "#5a3e00", lineHeight: 1.75 }}>
            <strong style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              ⏳ Pending — Key Handover Condition:
            </strong>{" "}
            The home will be officially registered in the name of <strong>{tenantName}</strong> and keys will be handed over upon full settlement of the outstanding balance of{" "}
            <strong>$900.00</strong> — Key Handover Fee.
          </div>

          {/* Body Text */}
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.9, marginBottom: 28, textAlign: "justify" }}>
            <p style={{ margin: "0 0 16px 0" }}>
              This is to certify, in accordance with the statutes and regulations of the{" "}
              <strong>State of Idaho Housing Authority</strong> and the{" "}
              <strong>Kootenai County Council — Housing &amp; Property Division</strong>, that the residential property located at{" "}
              <strong>{propertyAddress}</strong> has been duly registered, reviewed, and officially allocated to the named tenant,{" "}
              <strong>{tenantName}</strong>.
            </p>
            <p style={{ margin: "0 0 16px 0" }}>
              This registration was processed and approved under the authority of <strong>Alan Scott</strong> (Landlord) and{" "}
              <strong>Invitation Homes</strong>, a fully licensed property management firm operating within the jurisdiction of Kootenai County. All requisite documentation, background screening, lease compliance reviews, and statutory filings have been completed in accordance with the Idaho Residential Tenancy Act and the applicable local housing ordinances.
            </p>
            <p style={{ margin: 0 }}>
              This certificate grants <strong>{tenantName}</strong> the exclusive and legally recognized right of occupancy of the above-mentioned premises, subject to the terms and conditions of the duly executed lease agreement on file with this office and upon settlement of all outstanding fees. Any transfer, subletting, or modification of tenancy must be formally registered with the Kootenai County Council — Housing &amp; Property Division and Invitation Homes.
            </p>
          </div>

          {/* Legal Notice Box */}
          <div style={{ background: "#0f1f3d", color: "#b8c4d4", fontSize: 11, padding: "12px 20px", letterSpacing: "0.06em", lineHeight: 1.6, marginBottom: 36, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, color: "#d4ad52", flexShrink: 0, marginTop: -2 }}>§</span>
            <span>
              <strong style={{ color: "#fff" }}>Legal Notice:</strong> This document has been issued under the authority of the Kootenai County Council and the Idaho Department of Community Affairs. Falsification or misuse of this certificate is a violation of state law and may result in civil or criminal penalties. This certificate is valid only for the named tenant and address above.
            </span>
          </div>

          {/* Signatures */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 0, paddingBottom: 48 }}>
            {/* Signature 1 — Landlord */}
            <div style={{ textAlign: "center", minWidth: 180 }}>
              <div style={{ position: "relative", height: 70, marginBottom: 8 }}>
                <img src="/signature-1.jpg" alt="Alan Scott Signature" style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", height: 60, opacity: 0.85 }} />
              </div>
              <div style={{ borderTop: "1px solid #0f1f3d", paddingTop: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1f3d", margin: "0 0 2px 0" }}>Alan Scott</p>
                <p style={{ fontSize: 10, color: "#8a8070", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Landlord</p>
                <p style={{ fontSize: 10, color: "#8a8070", margin: "2px 0 0 0" }}>Invitation Homes</p>
              </div>
            </div>

            {/* Official Stamp */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 150, height: 150, borderRadius: "50%", border: "5px solid #0f1f3d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", transform: "rotate(-12deg)", background: "rgba(15,31,61,0.04)", position: "relative", boxShadow: "0 0 0 2px #fff, 0 0 0 4px rgba(15,31,61,0.15)" }}>
                <div style={{ position: "absolute", inset: 10, border: "2px dashed #b8943a", borderRadius: "50%" }} />
                <p style={{ fontSize: 9, color: "#0f1f3d", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 3px 0" }}>Kootenai County</p>
                <div style={{ width: 44, height: 1, background: "#b8943a", margin: "4px 0" }} />
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#0f1f3d", fontWeight: 700, margin: "0 0 2px 0", lineHeight: 1 }}>Approved</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: "#0f1f3d", fontWeight: 700, margin: "0 0 4px 0", lineHeight: 1 }}>&amp; Registered</p>
                <div style={{ width: 44, height: 1, background: "#b8943a", margin: "4px 0" }} />
                <p style={{ fontSize: 8, color: "#8a6000", margin: 0, letterSpacing: "0.1em" }}>Housing Division</p>
              </div>
            </div>

            {/* Signature 2 — Attorney */}
            <div style={{ textAlign: "center", minWidth: 180 }}>
              <div style={{ position: "relative", height: 70, marginBottom: 8 }}>
                <img src="/images-sig-2.jpg" alt="Daniel Hall Signature" style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", height: 55, opacity: 0.8 }} />
              </div>
              <div style={{ borderTop: "1px solid #0f1f3d", paddingTop: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1f3d", margin: "0 0 2px 0" }}>Daniel Hall, Esq.</p>
                <p style={{ fontSize: 10, color: "#8a8070", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Attorney of Record</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#0f1f3d", padding: "16px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#b8c4d4", fontSize: 12, margin: 0, letterSpacing: "0.1em" }}>
            Invitation Homes · Licensed Property Management
          </p>
          <p style={{ color: "#6b7a94", fontSize: 12, margin: 0 }}>
            Kootenai County Council · Housing &amp; Property Division · Athol, ID 83801
          </p>
        </div>

        {/* Gold bar */}
        <div style={{ background: "linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%)", height: 5 }} />
      </div>

      <style>{\`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; padding: 0 !important; }
        }
      \`}</style>
    </div>
  );
}
