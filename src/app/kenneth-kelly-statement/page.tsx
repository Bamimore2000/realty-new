"use client";

import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Download, Printer, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { sendStatementEmail } from "./actions";

const labelStyle: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#8a8070",
  fontWeight: 600,
  marginBottom: 4,
  margin: 0,
};
const valueStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#1a1a1a",
  fontWeight: 500,
  lineHeight: 1.5,
  margin: 0,
};
const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 12,
          fontWeight: 700,
          color: "#0f1f3d",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "#d4c9b0" }} />
    </div>
  );
}

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return (
    <th
      style={{
        color: "#b8c4d4",
        fontSize: 9,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        padding: "10px 14px",
        fontWeight: 500,
        textAlign: right ? "right" : "left",
      }}
    >
      {children}
    </th>
  );
}

function Tr({ children }: { children: React.ReactNode }) {
  return <tr style={{ borderBottom: "1px solid #f0ede8" }}>{children}</tr>;
}

function Td({
  children,
  mono,
  note,
  green,
}: {
  children?: React.ReactNode;
  mono?: boolean;
  note?: boolean;
  green?: boolean;
}) {
  return (
    <td
      style={{
        padding: "12px 14px",
        color: green ? "#2e7d32" : "#2a2520",
        textAlign: mono ? "right" : "left",
        fontStyle: note ? "italic" : "normal",
        fontSize: note ? 11 : 13,
        fontWeight: mono ? 500 : 400,
      }}
    >
      {children}
    </td>
  );
}

const CLEARED_BADGE = (
  <span
    style={{
      display: "inline-block",
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "3px 8px",
      borderRadius: 10,
      background: "#eaf4ec",
      color: "#1b5e20",
    }}
  >
    ✓ Cleared
  </span>
);

const PENDING_BADGE = (
  <span
    style={{
      display: "inline-block",
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "3px 8px",
      borderRadius: 10,
      background: "#fff3cd",
      color: "#8a6000",
    }}
  >
    ⏳ Pending
  </span>
);

export default function KennethKellyStatementPage() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const generatePdfBase64 = async (): Promise<{ base64: string; pdf: jsPDF } | null> => {
    const element = invoiceRef.current;
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
      result.pdf.save("kenneth-kelly-statement.pdf");
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
      const res = await sendStatementEmail(email, result.base64, "kenneth-kelly-statement.pdf");
      if (res.success) { toast.success("Statement emailed successfully!"); }
      else { toast.error(res.error || "Failed to send email."); }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sending.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#f0ede8",
        padding: "40px 20px",
        color: "#1a1a1a",
        minHeight: "100vh",
      }}
    >
      {/* Controls */}
      <div
        className="no-print"
        style={{ maxWidth: 780, margin: "0 auto 24px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}
      >
        <input
          type="email"
          placeholder="Tenant email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 8,
            border: "1px solid #d4c9b0", fontSize: 13, background: "#fff", outline: "none",
          }}
        />
        <button
          onClick={handleSendEmail}
          disabled={isSending}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 8, background: "#0f1f3d", color: "#fff", border: "none",
            cursor: isSending ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600,
            opacity: isSending ? 0.7 : 1,
          }}
        >
          {isSending ? (<><RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>) : (<><Send size={15} /> Send to Tenant</>)}
        </button>
        <button
          onClick={handleDownload}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 8, background: "#b8943a", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}
        >
          <Download size={15} /> Download PDF
        </button>
        <button
          onClick={() => window.print()}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 8, background: "#fff", color: "#0f1f3d", border: "1px solid #d4c9b0", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}
        >
          <Printer size={15} /> Print
        </button>
      </div>

      {/* Document */}
      <div
        ref={invoiceRef}
        className="statement-document"
        style={{ maxWidth: 780, margin: "0 auto", background: "#fff", boxShadow: "0 4px 40px rgba(0,0,0,0.12)" }}
      >
        {/* Header */}
        <div style={{ background: "#0f1f3d", padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center" }}>
              <img src="/invitation-home.png" alt="Invitation Homes" style={{ height: 44, objectFit: "contain" }} />
            </div>
            <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.25)" }} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: "0.03em", lineHeight: 1.2 }}>
                Invitation Homes
              </div>
              <div style={{ color: "#b8c4d4", fontSize: 10, fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3 }}>
                Licensed Property Management · State of Massachusetts
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8c4d4", margin: "0 0 6px" }}>
              Official Legal Document
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
              Statement of Account
            </h2>
          </div>
        </div>

        {/* Gold bar */}
        <div style={{ background: "linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%)", height: 4 }} />

        {/* Body */}
        <div style={{ padding: "36px 48px" }}>

          {/* Meta row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #e8e4dc" }}>
            <div>
              <p style={labelStyle}>Premises Address</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>303 Hancock St, APT 2<br />Boston, MA 02125</p>
            </div>
            <div>
              <p style={labelStyle}>Lessee / Tenant</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Kenneth Kelly</p>
              <p style={{ ...labelStyle, marginTop: 10 }}>Lessor / Owner</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Joe Valdez</p>
            </div>
            <div>
              <p style={labelStyle}>Attorney of Record</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Daniel Hall, Esq.</p>
              <p style={{ ...labelStyle, marginTop: 10 }}>Governing Jurisdiction</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Suffolk County, Massachusetts</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={labelStyle}>Invoice Reference</p>
              <p style={{ ...valueStyle, fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#0f1f3d", marginTop: 4 }}>#INV-2026-0902</p>
              <p style={{ ...labelStyle, marginTop: 10 }}>Date Issued</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>June 23, 2026</p>
            </div>
          </div>

          {/* Paid banner */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#eaf4ec", border: "1px solid #a5d6a7", borderRadius: 6, padding: "14px 18px", marginBottom: 28, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 280 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2e7d32", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1b5e20", margin: 0 }}>Initial Fees Fully Satisfied — $3,125.00</p>
                <span style={{ fontSize: 11, color: "#388e3c" }}>
                  Rent fee, security deposit, attorney fee, insurance fee, lease fee, and application fee have all been received and cleared.
                </span>
              </div>
            </div>
          </div>

          {/* Notice box */}
          <div style={{ background: "#f7f4ef", border: "1px solid #e8e4dc", borderLeft: "4px solid #0f1f3d", borderRadius: 4, padding: "14px 18px", marginBottom: 28, fontSize: 11.5, color: "#5a5048", lineHeight: 1.75 }}>
            <strong style={{ color: "#0f1f3d", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Possession &amp; Key Handover Notice —
            </strong>{" "}
            This Statement of Account is issued by Invitation Homes to Kenneth Kelly (hereinafter "Lessee") to confirm the successful remittance of initial fees. The Lessor,{" "}
            <strong>Joe Valdez</strong>, and the Attorney of Record,{" "}
            <strong>Daniel Hall, Esq.</strong>, acknowledge receipt of these payments. Keys will be handed over and the home will be officially registered in the Lessee's name upon full settlement of the pending balance below.
          </div>

          {/* Paid schedule */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Schedule of Satisfied Payments</SectionTitle>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Item / Description</Th>
                  <Th>Statutory Basis</Th>
                  <Th>Status</Th>
                  <Th right>Amount Remitted</Th>
                </tr>
              </thead>
              <tbody>
                <Tr><Td>Rent Fee<div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>Monthly residential rent</div></Td><Td note>Lease Agreement</Td><Td>{CLEARED_BADGE}</Td><Td mono>$1,200.00</Td></Tr>
                <Tr><Td>Security Deposit<div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>Refundable damage deposit</div></Td><Td note>MA Gen. Laws ch. 186</Td><Td>{CLEARED_BADGE}</Td><Td mono>$800.00</Td></Tr>
                <Tr><Td>Attorney Fee<div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>Legal processing & review</div></Td><Td note>Administrative</Td><Td>{CLEARED_BADGE}</Td><Td mono>$350.00</Td></Tr>
                <Tr><Td>Insurance Fee<div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>Renter's insurance coverage</div></Td><Td note>Administrative</Td><Td>{CLEARED_BADGE}</Td><Td mono>$300.00</Td></Tr>
                <Tr><Td>Lease Fee<div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>Lease preparation & administration</div></Td><Td note>Administrative</Td><Td>{CLEARED_BADGE}</Td><Td mono>$400.00</Td></Tr>
                <Tr><Td>Application Fee<div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>Processing and background screening</div></Td><Td note>Administrative</Td><Td>{CLEARED_BADGE}</Td><Td mono>$75.00</Td></Tr>
                <tr>
                  <td colSpan={3} style={{ background: "#f7f4ef", padding: "10px 14px", textAlign: "right", fontSize: 12, color: "#5a5048", fontStyle: "italic" }}>
                    Total Remittances Cleared to Date:
                  </td>
                  <td style={{ background: "#f7f4ef", padding: "10px 14px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#1b5e20" }}>
                    $3,125.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pending schedule */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Outstanding Balance — Required Prior to Key Handover</SectionTitle>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Obligation / Item</Th>
                  <Th>Statutory Basis / Terms</Th>
                  <Th>Status</Th>
                  <Th right>Amount Due</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ background: "#fff3cd", borderLeft: "4px solid #d4ad52", padding: "13px 14px", fontWeight: 600, color: "#5a3e00" }}>
                    Cleaning Fee
                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, color: "#8a6000" }}>
                      Professional end-of-tenancy cleaning of the premises.
                    </div>
                  </td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px", fontSize: 11, color: "#8a6000" }}>
                    <em>Required prior to key handover per lease terms.</em>
                  </td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px" }}>{PENDING_BADGE}</td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px", fontWeight: 700, textAlign: "right", color: "#8a6000", fontSize: 15 }}>$350.00</td>
                </tr>
                <tr>
                  <td style={{ background: "#fff3cd", borderLeft: "4px solid #d4ad52", padding: "13px 14px", fontWeight: 600, color: "#5a3e00" }}>
                    Annual Community Development Fee
                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, color: "#8a6000" }}>
                      Mandatory annual contribution to the residential community development fund.
                    </div>
                  </td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px", fontSize: 11, color: "#8a6000" }}>
                    <em>Community Development Act — Suffolk County Ordinance.</em>
                  </td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px" }}>{PENDING_BADGE}</td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px", fontWeight: 700, textAlign: "right", color: "#8a6000", fontSize: 15 }}>$2,000.00</td>
                </tr>
                <tr style={{ background: "#0f1f3d" }}>
                  <td style={{ padding: "16px 14px", color: "#b8c4d4", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }} colSpan={2}>
                    Total Pending Balance — Due Before Key Handover &amp; Registration
                  </td>
                  <td style={{ padding: "16px 14px" }} />
                  <td style={{ padding: "16px 14px", fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#d4ad52", textAlign: "right", fontWeight: 700 }}>
                    $2,350.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal notice */}
          <div style={{ background: "#fff8e8", border: "1px solid #e8c94a", borderRadius: 6, padding: "14px 18px", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 18, lineHeight: 1.1, marginTop: 2 }}>⚖️</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7a5500", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
                Formal Notice — Key Handover &amp; Registration Condition
              </div>
              <div style={{ fontSize: 11.5, color: "#8a6000", lineHeight: 1.75 }}>
                Please be advised that the payment of the{" "}
                <strong>outstanding balance of $2,350.00</strong> is required in full before the keys to the property are handed over and the home is officially registered in the name of Kenneth Kelly.
                <br /><br />
                <strong>Important:</strong> Settlement of this balance is a mandatory condition precedent to completion of the tenancy under Massachusetts landlord-tenant law and the executed lease agreement.
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 32, paddingTop: 20, borderTop: "1px solid #e8e4dc" }}>
            <div>
              <div style={{ height: 56, marginBottom: 0, position: "relative" }}>
                <img src="/signature-1.jpg" alt="Joe Valdez Signature" style={{ height: 52, maxWidth: "100%", objectFit: "contain", objectPosition: "left bottom", display: "block" }} />
              </div>
              <div style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }} />
              <div style={{ fontSize: 10, color: "#5a5048", fontWeight: 600 }}>Joe Valdez</div>
              <div style={{ fontSize: 9, color: "#9a9080", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Lessor / Owner</div>
            </div>
            <div>
              <div style={{ height: 56, marginBottom: 0 }}>
                <img src="/images-sig-2.jpg" alt="Daniel Hall Signature" style={{ height: 52, maxWidth: "100%", objectFit: "contain", objectPosition: "left bottom", display: "block" }} />
              </div>
              <div style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }} />
              <div style={{ fontSize: 10, color: "#5a5048", fontWeight: 600 }}>Daniel Hall, Esq.</div>
              <div style={{ fontSize: 9, color: "#9a9080", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Attorney of Record</div>
            </div>
            <div>
              <div style={{ height: 56, marginBottom: 0 }} />
              <div style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }} />
              <div style={{ fontSize: 10, color: "#5a5048", fontWeight: 600 }}>Kenneth Kelly</div>
              <div style={{ fontSize: 9, color: "#9a9080", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Lessee / Tenant</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ background: "#0f1f3d", margin: "28px -48px -36px", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ color: "#b8c4d4", fontSize: 10, letterSpacing: "0.1em" }}>
              Invitation Homes &nbsp;·&nbsp; Licensed Massachusetts Property Management
            </div>
            <div style={{ color: "#6a7a90", fontSize: 9, letterSpacing: "0.08em" }}>
              Massachusetts Landlord-Tenant Law &nbsp;·&nbsp; Ref: #INV-2026-0902 &nbsp;·&nbsp; Issued: June 23, 2026
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; padding: 0 !important; }
          .statement-document { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
