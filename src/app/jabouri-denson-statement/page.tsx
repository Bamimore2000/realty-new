"use client";

import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Download, Printer, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { sendStatementEmail } from "./actions";

const lbl: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#8a8070",
  fontWeight: 600,
  marginBottom: 4,
  margin: 0,
};

const val: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "#1a1a1a",
  lineHeight: 1.5,
  margin: 0,
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

export default function JabouriDensonStatementPage() {
  const statementRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const generatePdfBase64 = async (): Promise<{
    base64: string;
    pdf: jsPDF;
  } | null> => {
    const element = statementRef.current;
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
      result.pdf.save("jabouri-denson-statement.pdf");
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
      const res = await sendStatementEmail(
        email,
        result.base64,
        "jabouri-denson-statement.pdf",
      );
      if (res.success) toast.success("Statement emailed successfully!");
      else toast.error(res.error || "Failed to send email.");
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
      {/* ── Toolbar ── */}
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
          placeholder="Lessee email address..."
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
          type="button"
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
              <RefreshCw size={15} className="spin-icon" /> Sending…
            </>
          ) : (
            <>
              <Send size={15} /> Send to Lessee
            </>
          )}
        </button>
        <button
          type="button"
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
          type="button"
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

      {/* ── Document ── */}
      <div
        ref={statementRef}
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
                }}
              >
                Core Key Realty
              </div>
              <div
                style={{
                  color: "#b8c4d4",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: 3,
                }}
              >
                Licensed Property Management · State of Georgia
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
              Pursuant to O.C.G.A. § 44-7-1 et seq.
            </p>
          </div>
        </div>

        {/* Gold accent bar */}
        <div
          style={{
            background:
              "linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%)",
            height: 4,
          }}
        />

        <div style={{ padding: "36px 48px" }}>
          {/* Lessee card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              background: "#f7f4ef",
              border: "1px solid #e8e4dc",
              borderRadius: 8,
              padding: "18px 22px",
              marginBottom: 24,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f1f3d",
                }}
              >
                Jabouri Denson
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#8a8070",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginTop: 3,
                }}
              >
                Lessee — Residential Tenancy Agreement
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p style={lbl}>Premises</p>
                  <p style={{ ...val, marginTop: 4 }}>
                    2300 Hilltop Dr, Albany, GA 31707
                  </p>
                </div>
                <div>
                  <p style={lbl}>Monthly Rent Obligation</p>
                  <p style={{ ...val, marginTop: 4 }}>$700.00 / month</p>
                </div>
                <div>
                  <p style={lbl}>Jurisdiction</p>
                  <p style={{ ...val, marginTop: 4 }}>
                    Dougherty County, Georgia
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#fff3cd",
                border: "1px solid #d4ad52",
                color: "#8a6000",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "5px 12px",
                borderRadius: 20,
                whiteSpace: "nowrap",
                alignSelf: "flex-start",
              }}
            >
              ⚠ Pending Remittance
            </div>
          </div>

          {/* Summary tiles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 1,
              background: "#e8e4dc",
              border: "1px solid #e8e4dc",
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            {[
              {
                label: "Total Remitted",
                value: "$500",
                sub: "Security deposit satisfied in full",
              },
              {
                label: "Balance Outstanding",
                value: "$700",
                sub: "First-month rent obligation",
                warn: true,
              },
              {
                label: "Total Lease Obligation",
                value: "$1,200",
                sub: "Deposit · Rent (Month 1)",
              },
            ].map((t, i) => (
              <div key={i} style={{ background: "#fff", padding: "14px 18px" }}>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#9a9080",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  {t.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: t.warn ? "#b8943a" : i === 0 ? "#1b5e20" : "#0f1f3d",
                  }}
                >
                  {t.value}
                </div>
                <div style={{ fontSize: 10, color: "#9a9080", marginTop: 3 }}>
                  {t.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Details grid */}
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
              <p style={lbl}>Leased Premises</p>
              <p style={{ ...val, marginTop: 4 }}>
                2300 Hilltop Dr
                <br />
                Albany, GA 31707
              </p>
            </div>
            <div>
              <p style={lbl}>Lessee</p>
              <p style={{ ...val, marginTop: 4 }}>Jabouri Denson</p>
              <p style={{ ...lbl, marginTop: 10 }}>Lessor / Realtor</p>
              <p style={{ ...val, marginTop: 4 }}>Daniel Hall</p>
            </div>
            <div>
              <p style={lbl}>Attorney of Record</p>
              <p style={{ ...val, marginTop: 4 }}>Robinson Allan, Esq.</p>
              <p style={{ ...lbl, marginTop: 10 }}>Governing Law</p>
              <p style={{ ...val, marginTop: 4 }}>O.C.G.A. § 44-7-1 et seq.</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={lbl}>Account Reference</p>
              <p
                style={{
                  ...val,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 15,
                  color: "#0f1f3d",
                  marginTop: 4,
                }}
              >
                #INV-2026-0847
              </p>
              <p style={{ ...lbl, marginTop: 10 }}>Date of Issuance</p>
              <p style={{ ...val, marginTop: 4 }}>June 12, 2026</p>
            </div>
          </div>

          {/* Legal preamble */}
          <div
            style={{
              background: "#f7f4ef",
              border: "1px solid #e8e4dc",
              borderLeft: "4px solid #0f1f3d",
              borderRadius: 4,
              padding: "14px 18px",
              marginBottom: 28,
              fontSize: 11,
              color: "#5a5048",
              lineHeight: 1.75,
            }}
          >
            <strong
              style={{
                color: "#0f1f3d",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Preamble &amp; Governing Authority —
            </strong>{" "}
            This Statement of Account is issued by Core Key Realty (hereinafter
            "Lessor" or "Managing Agent"), acting on behalf of the property
            owner, to Jabouri Denson (hereinafter "Lessee"), in connection with
            the proposed residential lease of the premises located at
            <strong> 2300 Hilltop Dr, Albany, GA 31707</strong> (hereinafter
            "the Premises"). This document is issued pursuant to the Georgia
            Landlord–Tenant Act, O.C.G.A. § 44-7-1 et seq., and the Georgia
            Security Deposit Act, O.C.G.A. § 44-7-30 et seq. All monetary
            obligations set forth herein constitute binding financial conditions
            precedent to the execution and ratification of the residential lease
            agreement and the conveyance of right of occupancy to the Lessee.
          </div>

          {/* Remittances received */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>
              Schedule of Remittances Received — Security Deposit Satisfied
            </SectionTitle>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Item / Description</Th>
                  <Th>Statutory Reference</Th>
                  <Th>Status</Th>
                  <Th right>Amount</Th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td style={{ padding: "12px 14px", color: "#2a2520" }}>
                    Non-Refundable Application Fee
                    <div
                      style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}
                    >
                      Deemed refundable per agreement; credited in full toward
                      security deposit obligation
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      fontSize: 11,
                      color: "#9a9080",
                      fontStyle: "italic",
                    }}
                  >
                    O.C.G.A. § 44-7-32
                  </td>
                  <td style={{ padding: "12px 14px" }}>
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
                      ✓ Credited
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      textAlign: "right",
                      fontWeight: 500,
                      color: "#2a2520",
                    }}
                  >
                    $70.00
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td style={{ padding: "12px 14px", color: "#2a2520" }}>
                    Security Deposit — Direct Remittance
                    <div
                      style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}
                    >
                      Cash remittance received; applied toward required security
                      deposit of $500.00. Combined with credited application fee
                      ($70.00), deposit obligation is discharged in full.
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      fontSize: 11,
                      color: "#9a9080",
                      fontStyle: "italic",
                    }}
                  >
                    O.C.G.A. § 44-7-31
                  </td>
                  <td style={{ padding: "12px 14px" }}>
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
                      ✓ Received
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      textAlign: "right",
                      fontWeight: 500,
                      color: "#2a2520",
                    }}
                  >
                    $430.00
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      background: "#f7f4ef",
                      padding: "10px 14px",
                      textAlign: "right",
                      fontSize: 12,
                      color: "#5a5048",
                      fontStyle: "italic",
                    }}
                  >
                    Total Remitted to Date (Deposit Cleared):
                  </td>
                  <td
                    style={{
                      background: "#f7f4ef",
                      padding: "10px 14px",
                      textAlign: "right",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#1b5e20",
                    }}
                  >
                    $500.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Outstanding balance */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>
              Outstanding Obligation — Condition Precedent to Lease Ratification
            </SectionTitle>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Obligation</Th>
                  <Th>Legal Basis / Notes</Th>
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
                    First Month's Rent — Advance Rent Obligation
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        marginTop: 4,
                        color: "#8a6000",
                      }}
                    >
                      The final financial condition required to complete
                      registration and release keys
                    </div>
                  </td>
                  <td
                    style={{
                      background: "#fff3cd",
                      padding: "13px 14px",
                      fontSize: 11,
                      color: "#8a6000",
                    }}
                  >
                    <em>
                      Pursuant to Georgia landlord-tenant law, remittance of
                      advance rent is required prior to final execution of lease
                      instruments. Upon full satisfaction of this obligation,
                      the paperwork registration shall be completed and we will
                      immediately head down to the home to convey right of
                      occupancy and seal the rental.
                    </em>
                  </td>
                  <td
                    style={{
                      background: "#fff3cd",
                      padding: "13px 14px",
                      fontWeight: 700,
                      textAlign: "right",
                      color: "#8a6000",
                      fontSize: 16,
                    }}
                  >
                    $700.00
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      background: "#0f1f3d",
                      padding: "16px 14px",
                      color: "#b8c4d4",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Balance Due &amp; Owing
                  </td>
                  <td style={{ background: "#0f1f3d", padding: "16px 14px" }} />
                  <td
                    style={{
                      background: "#0f1f3d",
                      padding: "16px 14px",
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 28,
                      color: "#d4ad52",
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    $700.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deposit confirmed notice */}
          <div
            style={{
              background: "#eaf4ec",
              border: "1px solid #a3d4ab",
              borderRadius: 6,
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontSize: 18, lineHeight: 1.1, marginTop: 2 }}>
              ✅
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#1b5e20",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Security Deposit — Obligation Discharged in Full
              </div>
              <div
                style={{ fontSize: 11.5, color: "#2e7d32", lineHeight: 1.7 }}
              >
                Pursuant to O.C.G.A. § 44-7-31, the Lessee's security deposit
                obligation of <strong>$500.00</strong> has been satisfied in
                full. Said deposit comprises a direct cash remittance of{" "}
                <strong>$430.00</strong> and the credited refundable application
                fee of <strong>$70.00</strong>, applied by mutual written
                agreement of the parties. The Lessor acknowledges receipt and
                confirms the deposit is held in trust in accordance with Georgia
                law.{" "}
                <strong>No further deposit obligation is outstanding.</strong>
              </div>
            </div>
          </div>

          {/* Formal legal notice */}
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
            <div style={{ fontSize: 18, lineHeight: 1.1, marginTop: 2 }}>
              ⚖️
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7a5500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Formal Notice — Pending Condition Precedent
              </div>
              <div
                style={{ fontSize: 11.5, color: "#8a6000", lineHeight: 1.75 }}
              >
                Be it formally known that the sole and exclusive remaining
                encumbrance preventing the final completion of the paperwork
                registration and the delivery of the property keys for the
                Premises at <strong>2300 Hilltop Dr, Albany, GA 31707</strong>{" "}
                is the outstanding first month's rent obligation of{" "}
                <strong>$700.00</strong>. All other financial conditions
                precedent, including the security deposit, have been duly
                satisfied and cleared in full. Upon receipt and clearance of
                this final remittance, Core Key Realty and the authorized agents
                shall finalize the registration paperwork and{" "}
                <strong>head down to the home immediately</strong> to formally
                convey the right of occupancy to the Lessee,{" "}
                <strong>Jabouri Denson</strong>, and seal the rental. This
                notice is issued with the review and authorization of Attorney
                of Record <strong>Robinson Allan, Esq.</strong>
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
                document constitutes an official Statement of Account issued
                under the authority of Core Key Realty, a licensed property
                management entity operating in the State of Georgia. All rights
                and obligations contained herein are governed by the Official
                Code of Georgia Annotated (O.C.G.A.), including but not limited
                to the Georgia Residential Landlord–Tenant Act (§ 44-7-1 et
                seq.) and the Georgia Security Deposit Act (§ 44-7-30 et seq.).
                This statement does not constitute a legally executed lease
                agreement. Ratification of the tenancy is contingent upon full
                satisfaction of all outstanding obligations identified herein.
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "#9a9080",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                <strong style={{ color: "#5a5048" }}>Lessor / Realtor:</strong>{" "}
                Daniel Hall &nbsp;|&nbsp;
                <strong style={{ color: "#5a5048" }}>Attorney:</strong> Robinson
                Allan, Esq. &nbsp;|&nbsp;
                <strong style={{ color: "#5a5048" }}>Ref:</strong>{" "}
                #INV-2026-0847
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
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    lineHeight: 1.5,
                  }}
                >
                  Core Key
                  <br />
                  Realty
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
                    lineHeight: 1.5,
                  }}
                >
                  Licensed
                  <br />
                  Georgia
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
            {/* Daniel Hall */}
            <div>
              <div
                style={{ height: 56, marginBottom: 0, position: "relative" }}
              >
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
                Daniel Hall
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
                Authorized Signatory — Lessor / Realtor
              </div>
            </div>

            {/* Robinson Allan */}
            <div>
              <div style={{ height: 56, marginBottom: 0 }}>
                <img
                  src="/robinson-allan-sig.png"
                  alt="Robinson Allan Signature"
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
                Robinson Allan, Esq.
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
                Jabouri Denson
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
                Acknowledged — Lessee
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
            <div
              style={{ color: "#b8c4d4", fontSize: 10, letterSpacing: "0.1em" }}
            >
              Core Key Realty &nbsp;·&nbsp; In partnership with Invitation Homes
              &nbsp;·&nbsp; State of Georgia
            </div>
            <div
              style={{ color: "#6a7a90", fontSize: 9, letterSpacing: "0.08em" }}
            >
              O.C.G.A. § 44-7-1 et seq. &nbsp;·&nbsp; Ref: #INV-2026-0847
              &nbsp;·&nbsp; Issued: June 12, 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
