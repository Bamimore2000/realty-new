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

export default function WendyMitchemRegistrationPage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const [tenantName, setTenantName] = useState("Wendy Mitchem");
  const [propertyAddress, setPropertyAddress] = useState(
    "4927 Highway 76 W, Laurens, SC 29390",
  );
  const [dateIssued, setDateIssued] = useState("June 21, 2026");
  const [registrationId, setRegistrationId] = useState("REG-2026-0902");

  const generatePdfBase64 = async (): Promise<{
    base64: string;
    pdf: jsPDF;
  } | null> => {
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
      result.pdf.save(
        `${tenantName.replace(/\s+/g, "-").toLowerCase()}-registration.pdf`,
      );
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
      const res = await sendCertificateEmail(
        email,
        result.base64,
        `${tenantName.replace(/\s+/g, "-").toLowerCase()}-registration.pdf`,
      );
      if (res.success) {
        toast.success("Certificate emailed successfully!");
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
      {/* Controls */}
      <div
        className="no-print"
        style={{
          maxWidth: 860,
          margin: "0 auto 24px",
          display: "flex",
          gap: 12,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            background: "#fff",
            padding: "16px",
            borderRadius: 8,
            border: "1px solid #d4c9b0",
          }}
        >
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ ...lbl, display: "block" }}>Tenant Name</label>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                fontSize: 13,
              }}
            />
          </div>
          <div style={{ flex: 2, minWidth: 260 }}>
            <label style={{ ...lbl, display: "block" }}>Property Address</label>
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                fontSize: 13,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ ...lbl, display: "block" }}>Date Issued</label>
            <input
              type="text"
              value={dateIssued}
              onChange={(e) => setDateIssued(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                fontSize: 13,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ ...lbl, display: "block" }}>Registration ID</label>
            <input
              type="text"
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                fontSize: 13,
              }}
            />
          </div>
        </div>

        <div
          style={{
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
      </div>

      {/* Certificate */}
      <div
        ref={certificateRef}
        style={{
          maxWidth: 860,
          margin: "0 auto",
          background: "#fff",
          boxShadow: "0 4px 40px rgba(0,0,0,0.12)",
          padding: "48px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            bottom: 16,
            border: "2px solid #b8943a",
            borderRadius: 4,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "1px solid #d4c9b0",
            borderRadius: 4,
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <img
              src="/invitation-home.png"
              alt="Invitation Homes"
              style={{ height: 48, objectFit: "contain", marginBottom: 12 }}
            />
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#8a8070",
                margin: "0 0 4px 0",
              }}
            >
              State of South Carolina · Laurens County
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#0f1f3d",
                margin: "0 0 4px 0",
                letterSpacing: "0.04em",
              }}
            >
              Laurens County Council — Housing & Property Division
            </h2>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8a8070",
                margin: 0,
              }}
            >
              Office of Residential Registration · Laurens District
            </p>
          </div>

          {/* Issuing Agent Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: "1px solid #e8e4dc",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  background: "#f7f4ef",
                  border: "1px solid #e8e4dc",
                  borderRadius: 8,
                  padding: "6px 10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src="/invitation-home.png"
                  alt="Invitation Homes"
                  style={{ height: 40, objectFit: "contain" }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0f1f3d",
                  }}
                >
                  Core Key Realty
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#8a8070",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  Licensed Property Management
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#8a8070",
                    marginTop: 2,
                  }}
                >
                  Lic. No. SC-PMO-2026-902 · Laurens County
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8a8070",
                  marginBottom: 4,
                }}
              >
                Document Reference
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#b8943a",
                }}
              >
                {registrationId}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#8a8070",
                  marginTop: 4,
                }}
              >
                Date Issued:{" "}
                <strong style={{ color: "#1a1a1a" }}>{dateIssued}</strong>
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div
            style={{
              textAlign: "center",
              margin: "28px 0 28px 0",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#b8943a",
                margin: "0 0 10px 0",
              }}
            >
              Official Document
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 38,
                color: "#0f1f3d",
                margin: "0 0 10px 0",
                letterSpacing: "0.02em",
              }}
            >
              Certificate of Registration
            </h1>
            <div
              style={{
                width: 80,
                height: 2,
                background: "linear-gradient(90deg, transparent, #b8943a, transparent)",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Certificate Body */}
          <div
            style={{
              textAlign: "left",
              fontSize: 14,
              lineHeight: 1.8,
              color: "#2a2520",
              marginBottom: 32,
            }}
          >
            <p style={{ marginBottom: 16 }}>
              This is to certify that <strong>{tenantName}</strong> (hereinafter "Registrant") has
              been officially registered as the resident tenant for the property located at:
            </p>

            <div
              style={{
                background: "#f7f4ef",
                padding: "16px 24px",
                borderRadius: 6,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0f1f3d",
                  margin: 0,
                }}
              >
                {propertyAddress}
              </p>
            </div>

            <p style={{ marginBottom: 16 }}>
              The registration has been processed and approved by the Laurens County Council —
              Housing & Property Division, acting in partnership with Core Key Realty and Invitation Homes.
            </p>

            <p style={{ marginBottom: 16 }}>
              All necessary pre-registration requirements have been met, including but not limited to:
              application submission, background check clearance, and initial payment remittances.
            </p>

            <p style={{ margin: 0 }}>
              This certificate is valid as of <strong>{dateIssued}</strong> and is subject to the
              terms and conditions of the lease agreement between the Registrant and the Property Owner.
            </p>
          </div>

          {/* Signatures Section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 32,
              marginTop: 40,
              paddingTop: 24,
              borderTop: "1px solid #e8e4dc",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  height: 64,
                  marginBottom: 0,
                  position: "relative",
                }}
              >
                <img
                  src="/signature-1.jpg"
                  alt="Todd Nicholls Signature"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: 60,
                    opacity: 0.85,
                  }}
                />
              </div>
              <div
                style={{
                  height: 1,
                  background: "#1a1a1a",
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "#1a1a1a",
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                Todd Nicholls
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#8a8070",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Property Owner / Lessor
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  height: 64,
                  marginBottom: 0,
                  position: "relative",
                }}
              >
                <img
                  src="/images-sig-2.jpg"
                  alt="Daniel Hall Signature"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: 55,
                    opacity: 0.8,
                  }}
                />
              </div>
              <div
                style={{
                  height: 1,
                  background: "#1a1a1a",
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "#1a1a1a",
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                Daniel Hall, Esq.
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#8a8070",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Attorney of Record
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  height: 64,
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    border: "3px double #b8943a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff8e8",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#b8943a" }}>
                    SEAL
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: 1,
                  background: "#1a1a1a",
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "#1a1a1a",
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                Core Key Realty
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#8a8070",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Issuing Agent
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 16,
              borderTop: "1px solid #e8e4dc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#9a9080",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              This document is valid only with the official seal and all signatures present.
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#8a8070",
                letterSpacing: "0.06em",
              }}
            >
              Document ID: <strong>{registrationId}</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
