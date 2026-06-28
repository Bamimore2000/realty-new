"use client";

import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Download, Printer, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { sendInvoiceEmail } from "./actions";

// ─── Shared styles ────────────────────────────────────────────────────────────
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
const pillStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 9,
  fontWeight: 700,
  color: "#fff",
};
const blStyle: React.CSSProperties = {
  fontSize: 9,
  color: "#8a8070",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textAlign: "center",
  marginTop: 2,
};

// ─── Sub-components ───────────────────────────────────────────────────────────
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

function Th({
  children,
  right,
}: {
  children?: React.ReactNode;
  right?: boolean;
}) {
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

function MonthGroup({
  pills,
  label,
  color,
  letter,
}: {
  pills: number;
  label: string;
  color: string;
  letter: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: pills }).map((_, i) => (
          <div key={i} style={{ ...pillStyle, background: color }}>
            {letter}
          </div>
        ))}
      </div>
      <span style={blStyle}>{label}</span>
    </div>
  );
}

function PlusSep() {
  return (
    <span
      style={{
        fontSize: 18,
        color: "#d4c9b0",
        fontWeight: 300,
        alignSelf: "flex-start",
        marginTop: 6,
      }}
    >
      +
    </span>
  );
}

function EqualsSep() {
  return (
    <span
      style={{
        fontSize: 18,
        color: "#d4c9b0",
        fontWeight: 300,
        alignSelf: "flex-start",
        marginTop: 6,
      }}
    >
      =
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TammyInvoicePage() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const generatePdfBase64 = async (): Promise<{
    base64: string;
    pdf: jsPDF;
  } | null> => {
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

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [width, height],
    });
    pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);
    return { base64: pdf.output("datauristring").split(",")[1], pdf };
  };

  const handleDownload = async () => {
    try {
      const result = await generatePdfBase64();
      if (!result) return;
      result.pdf.save("tammy-grigas-purchase-statement.pdf");
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    try {
      setIsSending(true);
      const result = await generatePdfBase64();
      if (!result) return;
      const res = await sendInvoiceEmail(
        email,
        result.base64,
        "tammy-grigas-purchase-statement.pdf",
      );
      if (res.success) {
        toast.success("Statement emailed successfully!");
      } else {
        toast.error(res.error || "Failed to send email.");
      }
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
      {/* ── Action Bar ── */}
      <div
        className="no-print"
        style={{
          maxWidth: 780,
          margin: "0 auto 24px",
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="email"
          placeholder="Tenant/Buyer email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #d4c9b0",
            fontSize: 13,
            background: "#fff",
            outline: "none",
          }}
        />
        <button
          onClick={handleSendEmail}
          disabled={isSending}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 8,
            background: "#0f1f3d",
            color: "#fff",
            border: "none",
            cursor: isSending ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600,
            opacity: isSending ? 0.7 : 1,
          }}
        >
          {isSending ? (
            <>
              <RefreshCw
                size={15}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Sending…
            </>
          ) : (
            <>
              <Send size={15} /> Send to Tenant
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 8,
            background: "#b8943a",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Download size={15} /> Download PDF
        </button>
        <button
          onClick={() => window.print()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 8,
            background: "#fff",
            color: "#0f1f3d",
            border: "1px solid #d4c9b0",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Printer size={15} /> Print
        </button>
      </div>

      {/* ── Document Container ── */}
      <div
        ref={invoiceRef}
        className="statement-document"
        style={{
          maxWidth: 780,
          margin: "0 auto",
          background: "#fff",
          boxShadow: "0 4px 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#0f1f3d",
            padding: "28px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 8,
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/invitation-home.png"
                alt="Invitation Homes"
                style={{ height: 44, objectFit: "contain" }}
              />
            </div>
            <div
              style={{
                width: 1,
                height: 48,
                background: "rgba(255,255,255,0.25)",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  lineHeight: 1.2,
                }}
              >
                Invitation Homes
              </div>
              <div
                style={{
                  color: "#b8c4d4",
                  fontSize: 10,
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: 3,
                }}
              >
                Licensed Property Management · State of Wisconsin
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#b8c4d4",
                marginBottom: 6,
                margin: "0 0 6px",
              }}
            >
              Official Legal Document
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
              }}
            >
              Statement of Account
            </h2>
            <p
              style={{
                color: "#6a7a90",
                fontSize: 9,
                letterSpacing: "0.1em",
                margin: "6px 0 0",
                textTransform: "uppercase",
              }}
            >
              Owner-Financed Purchase Transition
            </p>
          </div>
        </div>

        {/* Gold strip */}
        <div
          style={{
            background:
              "linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%)",
            height: 4,
          }}
        />

        <div style={{ padding: "36px 48px" }}>
          {/* Metadata Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 24,
              marginBottom: 28,
              paddingBottom: 24,
              borderBottom: "1px solid #e8e4dc",
            }}
          >
            <div>
              <p style={labelStyle}>Premises Address</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>
                2734 E Johnson St
                <br />
                Madison, WI 53704
              </p>
            </div>
            <div>
              <p style={labelStyle}>Lessee / Buyer</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Tammy L. Grigas</p>
              <p style={{ ...labelStyle, marginTop: 10 }}>Lessor / Seller</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Jeff Dianne</p>
            </div>
            <div>
              <p style={labelStyle}>Attorney of Record</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Daniel Hall, Esq.</p>
              <p style={{ ...labelStyle, marginTop: 10 }}>Governing Jurisdiction</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Dane County, Wisconsin</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={labelStyle}>Invoice Reference</p>
              <p
                style={{
                  ...valueStyle,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 15,
                  color: "#0f1f3d",
                  marginTop: 4,
                }}
              >
                #INV-2024-0842
              </p>
              <p style={{ ...labelStyle, marginTop: 10 }}>Date Updated</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>June 4, 2026</p>
            </div>
          </div>

          {/* Keys Ready & Occupancy Clearance Banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#eaf4ec",
              border: "1px solid #a5d6a7",
              borderRadius: 6,
              padding: "14px 18px",
              marginBottom: 28,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 280 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#2e7d32",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8L6.5 11.5L13 5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1b5e20",
                    margin: 0,
                  }}
                >
                  Move-In Fees Paid — Keys Ready for Delivery
                </p>
                <span style={{ fontSize: 11, color: "#388e3c" }}>
                  All statutory lease obligations, including the security deposit ($700.00) and $2,000.00 move-in fees, are fully satisfied. Possession is ready to be delivered pending purchase option deposit.
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <MonthGroup pills={4} label="4 Paid" color="#0f1f3d" letter="P" />
              <PlusSep />
              <MonthGroup pills={3} label="3 Free" color="#d4ad52" letter="F" />
              <PlusSep />
              <MonthGroup
                pills={5}
                label="5 Covered"
                color="#2e7d32"
                letter="C"
              />
              <EqualsSep />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    ...pillStyle,
                    background: "#2e7d32",
                    width: 36,
                    height: 36,
                    fontSize: 11,
                  }}
                >
                  12
                </div>
                <span style={blStyle}>Complete</span>
              </div>
            </div>
          </div>

          {/* Legal Preamble */}
          <div
            style={{
              background: "#f7f4ef",
              border: "1px solid #e8e4dc",
              borderLeft: "4px solid #0f1f3d",
              borderRadius: 4,
              padding: "14px 18px",
              marginBottom: 16,
              fontSize: 11.5,
              color: "#5a5048",
              lineHeight: 1.75,
            }}
          >
            <strong style={{ color: "#0f1f3d", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Mandatory Sale Notice &amp; Conveyance Authority —
            </strong>{" "}
            This Statement of Account is issued by Invitation Homes to Tammy L. Grigas (hereinafter "Lessee / Buyer") to provide
            formal notice that the Premises located at <strong>2734 E Johnson St, Madison, WI 53704</strong> has been <strong>permanently
            removed from the rental market</strong> by the property owner, <strong>Jeff Dianne</strong>, effective immediately.
            Continued tenancy on a rental basis is no longer available for this address. The property is mandatorily transitioning
            to a sale at a purchase price of <strong>$28,908.00</strong>.
          </div>

          {/* Goodwill Notice */}
          <div
            style={{
              background: "#f0f7ff",
              border: "1px solid #b8d4f0",
              borderLeft: "4px solid #1a5fa8",
              borderRadius: 4,
              padding: "14px 18px",
              marginBottom: 28,
              fontSize: 11.5,
              color: "#1a3a5c",
              lineHeight: 1.75,
            }}
          >
            <strong style={{ color: "#1a5fa8", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Exclusive Goodwill Offer to Current Lessee —
            </strong>{" "}
            In recognition of Tammy L. Grigas's <strong>outstanding conduct, positive attitude, and reliability</strong> as a tenant
            throughout her tenancy, the Lessor has elected — as an act of genuine goodwill — to extend this purchase
            opportunity <strong>exclusively to the current Lessee</strong> prior to any public listing. All previous tenancy
            obligations, security deposit fees, and move-in fees amounting to <strong>$2,000.00</strong> have been paid in full
            and are hereby acknowledged as cleared. Under the authorization of the property owner, Invitation Homes offers
            an <strong>Owner-Financed Lease-to-Own Conveyance Option</strong>: an initial flat down payment of <strong>$10,000.00</strong>
            is required immediately, with the remaining principal of <strong>$18,908.00</strong> payable over a
            <strong>30-year amortization schedule</strong> while the Lessee holds peaceful, continuous possession of the Premises.
          </div>

          {/* Previous Payments Received (including the paid $2,000 fees) */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Schedule of Remittances &amp; Satisfied Payments</SectionTitle>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Item / Description</Th>
                  <Th>Remittance Method</Th>
                  <Th>Status</Th>
                  <Th right>Amount Remitted</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td>
                    Rent Payment — 4 Months Upfront
                    <div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>
                      Satisfies the initial 4-month occupancy period under the $700.00/month rent schedule
                    </div>
                  </Td>
                  <Td note>Bitcoin / Cash App</Td>
                  <Td>
                    <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: "#eaf4ec", color: "#1b5e20" }}>
                      ✓ Cleared
                    </span>
                  </Td>
                  <Td mono>$2,800.00</Td>
                </Tr>
                <Tr>
                  <Td>
                    Security Deposit
                    <div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>
                      Wisconsin Stat. § 704.28 compliance; held in trust account
                    </div>
                  </Td>
                  <Td note>Apple Pay</Td>
                  <Td>
                    <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: "#eaf4ec", color: "#1b5e20" }}>
                      ✓ Cleared
                    </span>
                  </Td>
                  <Td mono>$700.00</Td>
                </Tr>
                <Tr>
                  <Td>Application Processing Fee</Td>
                  <Td note>Zelle</Td>
                  <Td>
                    <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: "#eaf4ec", color: "#1b5e20" }}>
                      ✓ Cleared
                    </span>
                  </Td>
                  <Td mono>$55.00</Td>
                </Tr>
                <Tr>
                  <Td>
                    Pre-Occupancy Move-In Fees
                    <div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>
                      Includes: Council Fee ($200), Community Development Fee ($500), Annual Rental Insurance ($1,000), Caution Fee ($300)
                    </div>
                  </Td>
                  <Td note>Bank Remittance</Td>
                  <Td>
                    <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: "#eaf4ec", color: "#1b5e20" }}>
                      ✓ Paid &amp; Settled
                    </span>
                  </Td>
                  <Td mono>$2,000.00</Td>
                </Tr>
                <tr>
                  <td colSpan={3} style={{ background: "#f7f4ef", padding: "10px 14px", textAlign: "right", fontSize: 12, color: "#5a5048", fontStyle: "italic" }}>
                    Total Remittances Cleared to Date:
                  </td>
                  <td style={{ background: "#f7f4ef", padding: "10px 14px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#1b5e20" }}>
                    $5,555.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* New Balance Due — Purchase Option Down Payment */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Required Remittance — Owner-Financed Down Payment</SectionTitle>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Obligation / Escrow Item</Th>
                  <Th>Statutory Basis / Terms</Th>
                  <Th right>Amount Due</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      background: "#fff3cd",
                      borderLeft: "4px solid #d4ad52",
                      padding: "13px 14px",
                      fontWeight: 600,
                      color: "#5a3e00",
                    }}
                  >
                    Owner-Financed Initial Down Payment
                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, color: "#8a6000" }}>
                      Flat option deposit required to execute land contract and release physical keys.
                    </div>
                  </td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px", fontSize: 11, color: "#8a6000" }}>
                    <em>
                      Pursuant to Wis. Stat. § 706.02 and Wis. Stat. § 708.09, this initial down payment
                      establishes the buyer's equitable interest in the property. Once cleared,
                      possession is delivered under a formal purchase contract, with the remaining principal
                      balance financed over 30 years.
                    </em>
                  </td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px", fontWeight: 700, textAlign: "right", color: "#8a6000", fontSize: 16 }}>
                    $10,000.00
                  </td>
                </tr>
                <tr style={{ background: "#0f1f3d" }}>
                  <td
                    style={{
                      padding: "16px 14px",
                      color: "#b8c4d4",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Balance Now Due &amp; Owing
                  </td>
                  <td style={{ padding: "16px 14px" }} />
                  <td
                    style={{
                      padding: "16px 14px",
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 28,
                      color: "#d4ad52",
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    $10,000.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Owner-Financed Purchase Schedule Details */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Wisconsin Owner-Financed Purchase Terms Summary</SectionTitle>
            <div style={{ background: "#fcfbfa", border: "1px solid #e8e4dc", borderRadius: 8, padding: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                <div>
                  <span style={labelStyle}>Total Purchase Price</span>
                  <p style={{ ...valueStyle, fontSize: 15, fontWeight: 700, color: "#0f1f3d", marginTop: 4 }}>$28,908.00</p>
                </div>
                <div>
                  <span style={labelStyle}>Initial Down Payment</span>
                  <p style={{ ...valueStyle, fontSize: 15, fontWeight: 700, color: "#b8943a", marginTop: 4 }}>$10,000.00</p>
                </div>
                <div>
                  <span style={labelStyle}>Remaining Principal</span>
                  <p style={{ ...valueStyle, fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginTop: 4 }}>$18,908.00</p>
                </div>
                <div>
                  <span style={labelStyle}>Financing Term</span>
                  <p style={{ ...valueStyle, fontSize: 15, fontWeight: 700, color: "#2e7d32", marginTop: 4 }}>30 Years / 360 Mos</p>
                </div>
              </div>
              <div style={{ width: "100%", height: 1, background: "#e8e4dc", margin: "14px 0" }} />
              <p style={{ fontSize: 11, color: "#666", margin: 0, lineHeight: 1.6 }}>
                <strong>Financing Amortization Note:</strong> Under the owner-financed agreement, the remaining balance of <strong>$18,908.00</strong> 
                will be amortized over 360 monthly payments (approx. <strong>$52.52/month</strong> on a principal basis, subject to final land contract interest, tax, 
                and escrow allocations). The Lessee / Buyer maintains the right to occupy the Premises continuously during the entire 30-year contract term, 
                provided payments are made according to the schedule. Prepayment is allowed at any time without penalty.
              </p>
            </div>
          </div>

          {/* Transition Notice Panel */}
          <div
            style={{
              background: "#fff8e8",
              border: "1px solid #e8c94a",
              borderRadius: 6,
              padding: "14px 18px",
              marginBottom: 28,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontSize: 18, lineHeight: 1.1, marginTop: 2 }}>⚖️</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7a5500", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
                Formal Notice — Mandatory Sale &amp; Escrow Clearance Condition
              </div>
              <div style={{ fontSize: 11.5, color: "#8a6000", lineHeight: 1.75 }}>
                Be it formally known that <strong>this property is no longer available for lease or rental</strong>. The Lessor, Jeff Dianne, has made
                an irrevocable decision to remove the Premises from the rental market. The Lessee, Tammy L. Grigas, is hereby notified
                that her existing rental arrangement cannot be renewed or continued. However, owing entirely to the Lessee's
                <strong>exemplary attitude, cooperative conduct, and good standing</strong> during the tenancy, the Lessor — as a
                personal gesture of goodwill — has chosen to offer the property for purchase exclusively to the current Lessee
                before it is listed on the open market.
                <br /><br />
                All move-in fees and initial occupancy deposits are fully cleared and satisfied. The sole remaining condition
                precedent to handing over the keys and executing the Land Contract is the remittance of the flat down payment of
                <strong> $10,000.00</strong>. Upon clearance of this payment, keys will be delivered immediately and full
                possessory rights transferred. This arrangement is drafted and reviewed by Attorney of Record{" "}
                <strong>Daniel Hall, Esq.</strong> on behalf of Lessor / Seller <strong>Jeff Dianne</strong>.
              </div>
            </div>
          </div>

          {/* Footer note + seal */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              paddingTop: 24,
              borderTop: "1px solid #e8e4dc",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 420 }}>
              <p
                style={{
                  fontSize: 10,
                  color: "#9a9080",
                  lineHeight: 1.8,
                  margin: "0 0 10px",
                }}
              >
                <strong style={{ color: "#5a5048" }}>Disclaimer:</strong> This
                document constitutes an official Statement of Account issued under the
                authority of Invitation Homes, a licensed property management entity
                operating in the State of Wisconsin. Conveyance of interest is subject to the
                execution of a formal Land Contract of sale satisfying Wis. Stat. § 706.02.
                This document does not bind either party to final contract terms; it outlines the financial
                conditions required to deliver keys and occupancy.
              </p>
              <p style={{ fontSize: 10, color: "#9a9080", lineHeight: 1.8, margin: 0 }}>
                <strong style={{ color: "#5a5048" }}>Lessor / Seller:</strong> Jeff Dianne &nbsp;|&nbsp;
                <strong style={{ color: "#5a5048" }}>Attorney:</strong> Daniel Hall, Esq. &nbsp;|&nbsp;
                <strong style={{ color: "#5a5048" }}>Ref:</strong> #INV-2024-0842
              </p>
            </div>

            {/* Official seal */}
            <div
              style={{
                width: 116,
                height: 116,
                borderRadius: "50%",
                border: "3px double #0f1f3d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 94,
                  height: 94,
                  borderRadius: "50%",
                  border: "1px solid #d4c9b0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 7,
                    fontWeight: 700,
                    color: "#0f1f3d",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.3,
                  }}
                >
                  Invitation
                  <br />
                  Homes
                </div>
                <div
                  style={{
                    width: 28,
                    height: 1,
                    background: "#d4c9b0",
                    margin: "5px auto",
                  }}
                />
                <div
                  style={{
                    fontSize: 6,
                    color: "#9a9080",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.4,
                  }}
                >
                  Licensed
                  <br />
                  Wisconsin
                </div>
              </div>
            </div>
          </div>

          {/* Signature block */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
              marginTop: 32,
              paddingTop: 20,
              borderTop: "1px solid #e8e4dc",
            }}
          >
            {/* Jeff Dianne */}
            <div>
              <div style={{ height: 56, marginBottom: 0, position: "relative" }}>
                <img
                  src="/robinson-allan-sig.png"
                  alt="Jeff Dianne Signature"
                  style={{
                    height: 52,
                    maxWidth: "100%",
                    objectFit: "contain",
                    objectPosition: "left bottom",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }}
              />
              <div style={{ fontSize: 10, color: "#5a5048", fontWeight: 600 }}>
                Jeff Dianne
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#9a9080",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Lessor / Seller
              </div>
            </div>

            {/* Daniel Hall */}
            <div>
              <div style={{ height: 56, marginBottom: 0 }}>
                <img
                  src="/daniel-hall-sig.png"
                  alt="Daniel Hall Signature"
                  style={{
                    height: 52,
                    maxWidth: "100%",
                    objectFit: "contain",
                    objectPosition: "left bottom",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }}
              />
              <div style={{ fontSize: 10, color: "#5a5048", fontWeight: 600 }}>
                Daniel Hall, Esq.
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#9a9080",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Attorney of Record
              </div>
            </div>

            {/* Lessee — blank */}
            <div>
              <div style={{ height: 56, marginBottom: 0 }} />
              <div
                style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }}
              />
              <div style={{ fontSize: 10, color: "#5a5048", fontWeight: 600 }}>
                Tammy L. Grigas
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#9a9080",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Lessee / Buyer
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div
            style={{
              background: "#0f1f3d",
              margin: "28px -48px -36px",
              padding: "14px 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ color: "#b8c4d4", fontSize: 10, letterSpacing: "0.1em" }}>
              Invitation Homes &nbsp;·&nbsp; Licensed Wisconsin Property Management
            </div>
            <div style={{ color: "#6a7a90", fontSize: 9, letterSpacing: "0.08em" }}>
              Wis. Stat. Ch. 704 &amp; 706 &nbsp;·&nbsp; Ref: #INV-2024-0842 &nbsp;·&nbsp; Issued: May 28, 2026
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
