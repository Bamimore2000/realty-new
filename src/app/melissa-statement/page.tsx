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
};

const val: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "#1a1a1a",
  lineHeight: 1.5,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 13,
          fontWeight: 700,
          color: "#0f1f3d",
          letterSpacing: "0.08em",
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

export default function MelissaStatementPage() {
  const statementRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const generatePdfBase64 = async (): Promise<{ base64: string; pdf: jsPDF } | null> => {
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

    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [width, height] });
    pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);
    return { base64: pdf.output("datauristring").split(",")[1], pdf };
  };

  const handleDownload = async () => {
    try {
      const result = await generatePdfBase64();
      if (!result) return;
      result.pdf.save("melissa-cowart-statement.pdf");
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
        "melissa-cowart-statement.pdf"
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
      className="melissa-statement-page"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#f0ede8",
        padding: "40px 20px",
        color: "#1a1a1a",
        minHeight: "100vh",
      }}
    >
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
          placeholder="Tenant email address..."
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
              <Send size={15} /> Send to Tenant
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
            <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.25)" }} />
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
                Licensed Property Management
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
              Official Document
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
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%)",
            height: 4,
          }}
        />

        <div style={{ padding: "36px 48px" }}>
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
                Melissa Cowart
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#8a8070",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginTop: 3,
                }}
              >
                Residential Tenant
              </div>
              <div style={{ display: "flex", gap: 24, marginTop: 10, flexWrap: "wrap" }}>
                <div>
                  <p style={lbl}>Property</p>
                  <p style={val}>2538 Spirit Creek Rd, Hephzibah, GA 30815</p>
                </div>
                <div>
                  <p style={lbl}>Monthly Rent</p>
                  <p style={val}>$800.00 / month</p>
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#eaf4ec",
                border: "1px solid #a5d6a7",
                color: "#1b5e20",
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
              ✓ Fees Cleared — Next Month Due
            </div>
          </div>

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
            <div style={{ background: "#fff", padding: "14px 18px" }}>
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
                Total Paid
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1b5e20",
                }}
              >
                $2,570
              </div>
              <div style={{ fontSize: 10, color: "#9a9080", marginTop: 3 }}>
                Rent (2 Mos) · Deposit · App · Fees
              </div>
            </div>
            <div style={{ background: "#fff", padding: "14px 18px" }}>
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
                Next Due
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#b8943a",
                }}
              >
                $800
              </div>
              <div style={{ fontSize: 10, color: "#9a9080", marginTop: 3 }}>
                Month 3 Rent (unlocks Free Month)
              </div>
            </div>
            <div style={{ background: "#fff", padding: "14px 18px" }}>
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
                Month 4 Status
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#2e7d32",
                }}
              >
                FREE
              </div>
              <div style={{ fontSize: 10, color: "#9a9080", marginTop: 3 }}>
                Goodwill — No Charge
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
              marginBottom: 28,
              paddingBottom: 24,
              borderBottom: "1px solid #e8e4dc",
            }}
          >
            <div>
              <p style={lbl}>Property Address</p>
              <p style={val}>
                2538 Spirit Creek Rd
                <br />
                Hephzibah, GA 30815
              </p>
            </div>
            <div>
              <p style={lbl}>Tenant Name</p>
              <p style={val}>Melissa Cowart</p>
              <p style={{ ...lbl, marginTop: 10 }}>Landlord / Attorney</p>
              <p style={val}>
                Daniel Hall (Landlord)
                <br />
                Rob Adams (Attorney)
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={lbl}>Invoice Reference</p>
              <p
                style={{
                  ...val,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 15,
                  color: "#0f1f3d",
                }}
              >
                #INV-2026-0834
              </p>
              <p style={{ ...lbl, marginTop: 10 }}>Date Issued</p>
              <p style={val}>June 4, 2026</p>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Previous Payments Received</SectionTitle>
            <p style={{ fontSize: 12, color: "#5a5048", fontStyle: "italic", marginBottom: 12 }}>
              Note: Receipts of the payments made prior will be sent over separately.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Description</Th>
                  <Th>Status</Th>
                  <Th right>Amount Paid</Th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td style={{ padding: "12px 14px", color: "#2a2520" }}>
                    Month 1 — Rent
                    <div style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}>Paid in full</div>
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
                      ✓ Paid
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
                    $800.00
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td style={{ padding: "12px 14px", color: "#2a2520" }}>
                    Security Deposit
                    <div style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}>
                      Held in escrow
                    </div>
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
                      ✓ Paid
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
                    $500.00
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td style={{ padding: "12px 14px", color: "#2a2520" }}>
                    Application / Setup Fee
                    <div style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}>
                      Processing and administration
                    </div>
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
                      ✓ Paid
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
                    Month 2 — Rent
                    <div style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}>Paid in full</div>
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
                      ✓ Paid
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
                    $800.00
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td style={{ padding: "12px 14px", color: "#2a2520" }}>
                    Community Dev. Fee + Council Fee + Insurance
                    <div style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}>All fees — paid &amp; cleared</div>
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
                      ✓ Paid
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
                    $400.00
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      background: "#f7f4ef",
                      padding: "10px 14px",
                      textAlign: "right",
                      fontSize: 12,
                      color: "#5a5048",
                      fontStyle: "italic",
                    }}
                  >
                    Total Received to Date:
                  </td>
                  <td
                    style={{
                      background: "#f7f4ef",
                      padding: "10px 14px",
                      textAlign: "right",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#0f1f3d",
                    }}
                  >
                    $2,570.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Next Payment Request — Month 3 Rent</SectionTitle>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Description</Th>
                  <Th>Notes</Th>
                  <Th right>Amount Due</Th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td
                    style={{
                      background: "#fff3cd",
                      borderLeft: "4px solid #d4ad52",
                      padding: "13px 14px",
                      fontWeight: 600,
                      color: "#5a3e00",
                    }}
                  >
                    Month 3 — Rent Payment
                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, color: "#8a6000" }}>
                      Payment of this month's rent now qualifies you for Month 4 completely free of charge.
                    </div>
                  </td>
                  <td
                    style={{
                      background: "#fff3cd",
                      padding: "13px 14px",
                      fontSize: 11,
                      fontStyle: "italic",
                      color: "#8a6000",
                    }}
                  >
                    Upon receipt, a payment confirmation and official receipt will be sent over immediately. Month 4 rent will be waived in full.
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
                    $800.00
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td
                    style={{
                      background: "#eaf4ec",
                      borderLeft: "4px solid #2e7d32",
                      padding: "13px 14px",
                      fontWeight: 600,
                      color: "#1b5e20",
                    }}
                  >
                    Month 4 — Rent (Goodwill Waiver)
                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, color: "#388e3c" }}>
                      Complimentary — no charge. Granted in recognition of your patience and appreciation throughout the tenancy.
                    </div>
                  </td>
                  <td
                    style={{
                      background: "#eaf4ec",
                      padding: "13px 14px",
                      fontSize: 11,
                      fontStyle: "italic",
                      color: "#388e3c",
                    }}
                  >
                    Free Month — automatically applied upon clearance of Month 3 payment.
                  </td>
                  <td
                    style={{
                      background: "#eaf4ec",
                      padding: "13px 14px",
                      fontWeight: 700,
                      textAlign: "right",
                      color: "#2e7d32",
                      fontSize: 16,
                    }}
                  >
                    $0.00
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
                    Amount Now Due
                  </td>
                  <td style={{ background: "#0f1f3d", padding: "16px 14px" }} />
                  <td
                    style={{
                      background: "#0f1f3d",
                      padding: "16px 14px",
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 26,
                      color: "#d4ad52",
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    $800.00
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Goodwill Notice */}
            <div style={{
              marginTop: 20,
              padding: "16px 20px",
              background: "#eaf4ec",
              borderLeft: "4px solid #2e7d32",
              borderRadius: "0 8px 8px 0",
              color: "#1b5e20",
              fontSize: 13,
              lineHeight: 1.7,
            }}>
              <strong style={{ display: "block", marginBottom: 6, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.08em" }}>
                🎁 Goodwill Month — Special Notice
              </strong>
              In recognition of Melissa Cowart's outstanding patience, cooperative attitude, and appreciation expressed throughout the rental process,
              management has elected to grant <strong>Month 4 rent entirely free of charge</strong> as a personal gesture of goodwill.
              Upon clearance of the Month 3 rent payment of <strong>$800.00</strong>, an official receipt will be sent over immediately
              and the Month 4 rent waiver will be formally confirmed in writing — meaning <strong>Melissa will not need to worry about
              next month's rent</strong> at all.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
