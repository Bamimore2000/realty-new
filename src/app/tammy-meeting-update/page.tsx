"use client";

import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Download, Printer, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { sendMeetingUpdateEmail } from "./actions";

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

function Td({
  children,
  note,
  mono,
  right,
}: {
  children?: React.ReactNode;
  note?: boolean;
  mono?: boolean;
  right?: boolean;
}) {
  return (
    <td
      style={{
        padding: "10px 14px",
        borderBottom: "1px solid #e8e4dc",
        fontSize: 12,
        fontFamily: mono
          ? "'Courier New', Courier, monospace"
          : "'DM Sans', sans-serif",
        color: note ? "#8a8070" : "#1a1a1a",
        textAlign: right ? "right" : "left",
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}

function Tr({ children }: { children: React.ReactNode }) {
  return <tr style={{ background: "#fff" }}>{children}</tr>;
}

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  border: "1px solid #e8e4dc",
  borderRadius: 6,
  overflow: "hidden",
};

export default function TammyMeetingUpdatePage() {
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
      result.pdf.save("tammy-meeting-update.pdf");
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
      const res = await sendMeetingUpdateEmail(
        email,
        result.base64,
        "tammy-meeting-update.pdf",
      );
      if (res.success) toast.success("Meeting update emailed successfully!");
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
      <div style={{ maxWidth: 780, margin: "0 auto", marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => window.print()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#fff",
              border: "1px solid #e8e4dc",
              borderRadius: 6,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              color: "#1a1a1a",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f7f4ef")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
          >
            <Printer size={14} />
            Print
          </button>
          <button
            onClick={handleDownload}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#0f1f3d",
              border: "none",
              borderRadius: 6,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              color: "#fff",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1a3050")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#0f1f3d")}
          >
            <Download size={14} />
            Download PDF
          </button>
        </div>

        <div
          ref={statementRef}
          style={{
            background: "#fff",
            padding: 48,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            borderRadius: 8,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 32,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0f1f3d",
                  marginBottom: 4,
                }}
              >
                Core Key Realty
              </div>
              <div style={lbl}>Seller</div>
              <div style={val}>Jeff Dianne</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={lbl}>Document</div>
              <div style={val}>Meeting Update</div>
              <div style={{ marginTop: 12 }}>
                <div style={lbl}>Date Issued</div>
                <div style={val}>June 15, 2026</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                background: "#0f1f3d",
                color: "#fff",
                padding: "14px 20px",
                borderRadius: 6,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                To: Tammy L. Grigas
              </div>
              <div style={{ fontSize: 11, color: "#b8c4d4" }}>
                Tenant/Buyer · 2734 E Johnson St, Madison, WI 53704
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Important Update: Meeting Confirmed</SectionTitle>
            <div
              style={{
                background: "#fff8e8",
                border: "1px solid #e8c94a",
                borderLeft: "4px solid #e8c94a",
                borderRadius: 6,
                padding: "20px 22px",
                fontSize: 13,
                color: "#856404",
                lineHeight: 1.8,
              }}
            >
              <p style={{ margin: "0 0 16px 0" }}>
                A meeting today (Monday, June 15, 2026) is{" "}
                <strong>no longer feasible</strong>.
              </p>
              <p style={{ margin: "0 0 16px 0" }}>
                The full $10,000.00 down payment must be received to properly
                prepare and package all required documents for the closing and
                handover.
              </p>
              <p style={{ margin: "0 0 0 0" }}>
                We are confirming the handover meeting for{" "}
                <strong>Wednesday, June 17, 2026</strong>.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Payment Status</SectionTitle>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Description</Th>
                  <Th right>Amount</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td>
                    Initial Down Payment - Paid
                    <div
                      style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}
                    >
                      Certified funds received
                    </div>
                  </Td>
                  <Td right mono>
                    $6,100.00
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    Initial Down Payment - Remaining (Daily Installments)
                    <div
                      style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}
                    >
                      $2,000/day over two days (daily bank limit)
                    </div>
                  </Td>
                  <Td right mono>
                    $3,900.00
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>Total Down Payment Required</strong>
                  </Td>
                  <Td right mono style={{ fontWeight: 700 }}>
                    $10,000.00
                  </Td>
                </Tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Confirmed Meeting Details</SectionTitle>
            <div
              style={{
                background: "#f7f4ef",
                border: "1px solid #e8e4dc",
                borderRadius: 6,
                padding: "18px 20px",
                fontSize: 12,
                lineHeight: 1.8,
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: "#0f1f3d" }}>Date:</span>{" "}
                Wednesday, June 17, 2026
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: "#0f1f3d" }}>
                  Location:
                </span>{" "}
                2734 E Johnson St, Madison, WI 53704
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: "#0f1f3d" }}>
                  Attendees:
                </span>
                <br />
                • Jeff Dianne (Seller)
                <br />
                • Tammy L. Grigas (Buyer)
                <br />• Daniel Hall, Esq. (Attorney of Record)
              </div>
              <div style={{ margin: 0 }}>
                <span style={{ fontWeight: 700, color: "#0f1f3d" }}>Note:</span>
                <br />
                • Cashier's check won't work for the landlord (truck driver);
                remaining $3,900.00 will be sent in $2,000/day installments over
                two days
                <br />• Valid photo identification
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <SectionTitle>Next Steps</SectionTitle>
            <div
              style={{
                fontSize: 12,
                lineHeight: 1.8,
                color: "#333",
              }}
            >
              <p style={{ margin: "0 0 10px 0" }}>
                1. Remit remaining{" "}
                <strong>$3,900.00 in $2,000/day installments</strong> over two
                days (daily bank limit).
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                2. Meeting is confirmed for{" "}
                <strong>Wednesday, June 17, 2026</strong>.
              </p>
              <p style={{ margin: 0 }}>
                3. At the meeting: keys will be handed over, final paperwork
                will be signed, and full possession of the property will be
                conveyed.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <div style={{ display: "flex", gap: 48 }}>
              <div style={{ flex: 1 }}>
                <div style={lbl}>Prepared By</div>
                <div
                  style={{
                    ...val,
                    marginTop: 8,
                    paddingTop: 4,
                    borderTop: "1px solid #d4c9b0",
                  }}
                >
                  Jeff Dianne
                </div>
                <div style={lbl}>Seller</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={lbl}>Attorney</div>
                <div
                  style={{
                    ...val,
                    marginTop: 8,
                    paddingTop: 4,
                    borderTop: "1px solid #d4c9b0",
                  }}
                >
                  Daniel Hall, Esq.
                </div>
                <div style={lbl}>Attorney of Record</div>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#0f1f3d",
              padding: "12px 48px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ color: "#b8c4d4", fontSize: 9 }}>
              Core Key Realty · Licensed Wisconsin Property Management
            </div>
            <div style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>
              Issued: June 15, 2026
            </div>
          </div>

          <div style={{ height: 40 }} />
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <input
            type="email"
            placeholder="Enter recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 6,
              border: "1px solid #e8e4dc",
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            onClick={handleSendEmail}
            disabled={isSending}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#b8943a",
              border: "none",
              borderRadius: 6,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: isSending ? "not-allowed" : "pointer",
              color: "#fff",
              opacity: isSending ? 0.6 : 1,
            }}
          >
            {isSending ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
