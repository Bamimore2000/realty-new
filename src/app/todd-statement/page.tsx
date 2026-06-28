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

export default function ToddStatementPage() {
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
      result.pdf.save("todd-m-houser-statement.pdf");
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
        "todd-m-houser-statement.pdf"
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
      className="courtney-statement-page"
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
                Todd M. Houser
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
                  <p style={val}>836 Rhodora Ave, Reading, PA 19605</p>
                </div>
                <div>
                  <p style={lbl}>Monthly Rent</p>
                  <p style={val}>$800.00 / month</p>
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
              ⚠ Balance Pending
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
                $500
              </div>
              <div style={{ fontSize: 10, color: "#9a9080", marginTop: 3 }}>
                Security Deposit received
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
                Total Pending
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
                Month 1 Rent
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
                Total Lease Value
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f1f3d",
                }}
              >
                $1,300
              </div>
              <div style={{ fontSize: 10, color: "#9a9080", marginTop: 3 }}>
                Rent · Deposit
              </div>
            </div>
          </div>

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
              <p style={lbl}>Property Address</p>
              <p style={val}>
                836 Rhodora Ave
                <br />
                Reading, PA 19605
              </p>
            </div>
            <div>
              <p style={lbl}>Tenant Name</p>
              <p style={val}>Todd M. Houser</p>
            </div>
            <div>
              <p style={lbl}>Realtor</p>
              <p style={val}>Daniel Hall</p>
              <p style={{ ...lbl, marginTop: 10 }}>Attorney</p>
              <p style={val}>Jose Roberts</p>
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
                #INV-2026-0392
              </p>
              <p style={{ ...lbl, marginTop: 10 }}>Date Issued</p>
              <p style={val}>May 29, 2026</p>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Previous Payments Received</SectionTitle>
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
                    Application Fee
                    <div style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}>Converted to deposit</div>
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
                    Security Deposit - Part 1
                    <div style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}>Received 5/24/2026</div>
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
                    $130.00
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <td style={{ padding: "12px 14px", color: "#2a2520" }}>
                    Security Deposit - Part 2
                    <div style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}>Received 5/28/2026</div>
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
                    $300.00
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
                    $500.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Outstanding Balance Due</SectionTitle>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Description</Th>
                  <Th>Notes</Th>
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
                    Month 1 — Rent
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
                    Required for move-in and ratification
                  </td>
                  <td
                    style={{
                      background: "#fff3cd",
                      padding: "13px 14px",
                      fontWeight: 600,
                      textAlign: "right",
                      color: "#8a6000",
                    }}
                  >
                    $800.00
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
                    Total Balance Due
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
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid #e8e4dc",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                fontSize: 10.5,
                color: "#9a9080",
                lineHeight: 1.7,
                maxWidth: 340,
                margin: 0,
              }}
            >
              <strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:</strong> A total
              of <strong style={{ color: "#5a5048" }}>$800.00</strong> is outstanding for the first month's rent.
              Full payment is required for the final process of ratification and to meet at the home at 1pm at
              836 Rhodora Ave, Reading, PA 19605.
              <br />
              <br />
              This is an official statement of account issued by Core Key Realty in partnership
              with Invitation Homes.
            </p>
            <div
              style={{
                width: 110,
                height: 110,
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
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  border: "1.5px solid #0f1f3d",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 7,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#0f1f3d",
                    fontWeight: 700,
                  }}
                >
                  Core Key Realty
                </span>
                <span style={{ color: "#b8943a", fontSize: 11 }}>★</span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#0f1f3d",
                    lineHeight: 1.3,
                    margin: "3px 0",
                  }}
                >
                  Invitation
                  <br />
                  Homes
                </span>
                <span style={{ color: "#b8943a", fontSize: 11 }}>★</span>
                <span
                  style={{
                    fontSize: 7,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#0f1f3d",
                    fontWeight: 700,
                  }}
                >
                  Verified &amp; Issued
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }
        @media print {
          .no-print { display: none !important; }
          .courtney-statement-page {
            background: #fff !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .statement-document {
            box-shadow: none !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
