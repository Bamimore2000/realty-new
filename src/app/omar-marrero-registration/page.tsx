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

export default function OmarMarreroRegistrationPage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const [tenantName, setTenantName] = useState("Omar Marrero");
  const [propertyAddress, setPropertyAddress] = useState(
    "179 Eisley Rd, Milton, PA 17847",
  );
  const [dateIssued, setDateIssued] = useState("June 12, 2026");
  const [registrationId, setRegistrationId] = useState("REG-2026-0848");

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
      </div>

      {/* Certificate Document */}
      <div
        ref={certificateRef}
        style={{
          maxWidth: 860,
          margin: "0 auto",
          background: "#fff",
          boxShadow: "0 4px 40px rgba(0,0,0,0.14)",
          position: "relative",
        }}
      >
        {/* Outer decorative border */}
        <div
          style={{
            position: "absolute",
            inset: 14,
            border: "2px solid #c8b97a",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 18,
            border: "1px solid #e0d4a8",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "36px 48px 0 48px",
          }}
        >
          {/* Government / Council Banner */}
          <div
            style={{
              textAlign: "center",
              borderBottom: "2px solid #0f1f3d",
              paddingBottom: 16,
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#8a8070",
                margin: "0 0 4px 0",
              }}
            >
              State of Pennsylvania · Northumberland County
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
              Northumberland County Council — Housing & Property Division
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
              Office of Residential Registration · Milton District
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
                  Administración de Propiedades Licenciada
                </div>
                <div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>
                  Lic. No. PA-PMO-2024-3822 · Northumberland County
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
              <div style={{ fontSize: 10, color: "#8a8070", marginTop: 4 }}>
                Date Issued:{" "}
                <strong style={{ color: "#1a1a1a" }}>{dateIssued}</strong>
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div style={{ textAlign: "center", margin: "28px 0 28px 0" }}>
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
                margin: "0 0 12px 0",
                lineHeight: 1.1,
              }}
            >
              Certificate of Tenant Registration
            </h1>
            <div
              style={{
                width: 80,
                height: 3,
                background: "linear-gradient(90deg, #b8943a, #d4ad52, #b8943a)",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Tenant & Property Info Box */}
          <div
            style={{
              background: "#f7f4ef",
              border: "1px solid #d4c9b0",
              padding: "24px 28px",
              marginBottom: 28,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div>
              <p style={lbl}>Registered Tenant</p>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0f1f3d",
                  margin: 0,
                }}
              >
                {tenantName}
              </p>
            </div>
            <div>
              <p style={lbl}>Property Address</p>
              <p style={{ ...val, fontSize: 15, margin: 0 }}>
                {propertyAddress}
              </p>
            </div>
            <div>
              <p style={lbl}>County</p>
              <p style={{ ...val, margin: 0 }}>
                Northumberland County, Pennsylvania
              </p>
            </div>
            <div>
              <p style={lbl}>Tenancy Type</p>
              <p style={{ ...val, margin: 0 }}>Residential — Long Term Lease</p>
            </div>
          </div>

          {/* Body Text */}
          <div
            style={{
              fontSize: 14,
              color: "#374151",
              lineHeight: 1.9,
              marginBottom: 28,
              textAlign: "justify",
            }}
          >
            <p style={{ margin: "0 0 16px 0" }}>
              This is to certify, in accordance with the statutes and
              regulations of the{" "}
              <strong>State of Pennsylvania Housing Authority</strong> and the{" "}
              <strong>
                Northumberland County Council — Housing & Property Division
              </strong>
              , that the residential property located at{" "}
              <strong>{propertyAddress}</strong> has been duly registered,
              reviewed, and officially allocated to the named tenant,{" "}
              <strong>{tenantName}</strong>.
            </p>
            <p style={{ margin: "0 0 16px 0" }}>
              This registration was processed and approved under the authority
              of Core Key Realty (Lic. No. PA-PMO-2024-3822), a fully licensed
              property management firm operating within the jurisdiction of
              Northumberland County. All requisite documentation, background
              screening, lease compliance reviews, and statutory filings have
              been completed in accordance with the{" "}
              <em>Pennsylvania Residential Tenancy Act</em> and the applicable
              local housing ordinances.
            </p>
            <p style={{ margin: 0 }}>
              This certificate grants <strong>{tenantName}</strong> the
              exclusive and legally recognized right of occupancy of the
              above-mentioned premises, subject to the terms and conditions of
              the duly executed lease agreement on file with this office. Any
              transfer, subletting, or modification of tenancy must be formally
              registered with the Northumberland County Council — Housing &
              Property Division and Core Key Realty.
            </p>
          </div>

          {/* Legal Notice Box */}
          <div
            style={{
              background: "#0f1f3d",
              color: "#b8c4d4",
              fontSize: 11,
              padding: "12px 20px",
              letterSpacing: "0.06em",
              lineHeight: 1.6,
              marginBottom: 36,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: 18,
                color: "#d4ad52",
                flexShrink: 0,
                marginTop: -2,
              }}
            >
              §
            </span>
            <span>
              <strong style={{ color: "#fff" }}>Legal Notice:</strong> This
              document has been issued under the authority of the Northumberland
              County Council and the Pennsylvania Department of Community
              Affairs (DCA). Falsification or misuse of this certificate is a
              violation of Pennsylvania law and may result in civil or criminal
              penalties. This certificate is valid only for the named tenant and
              address above.
            </span>
          </div>

          {/* Signatures */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 0,
              paddingBottom: 48,
            }}
          >
            {/* Signature 1 */}
            <div style={{ textAlign: "center", minWidth: 180 }}>
              <div
                style={{ position: "relative", height: 70, marginBottom: 8 }}
              >
                <img
                  src="/daniel-hall-sig.png"
                  alt="Aswad Rhinehart Signature"
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
              <div style={{ borderTop: "1px solid #0f1f3d", paddingTop: 8 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0f1f3d",
                    margin: "0 0 2px 0",
                  }}
                >
                  Aswad Rhinehart
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "#8a8070",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: 0,
                  }}
                >
                  Landlord & Authorized Agent
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "#8a8070",
                    margin: "2px 0 0 0",
                  }}
                >
                  Core Key Realty
                </p>
              </div>
            </div>

            {/* Stamp */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  border: "5px solid #0f1f3d",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  transform: "rotate(-12deg)",
                  background: "rgba(15,31,61,0.04)",
                  position: "relative",
                  boxShadow: "0 0 0 2px #fff, 0 0 0 4px rgba(15,31,61,0.15)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 10,
                    border: "2px dashed #b8943a",
                    borderRadius: "50%",
                  }}
                />
                <p
                  style={{
                    fontSize: 9,
                    color: "#0f1f3d",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    margin: "0 0 3px 0",
                  }}
                >
                  Northumberland County
                </p>
                <div
                  style={{
                    width: 44,
                    height: 1,
                    background: "#b8943a",
                    margin: "4px 0",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 14,
                    color: "#0f1f3d",
                    fontWeight: 700,
                    margin: "0 0 2px 0",
                    lineHeight: 1,
                  }}
                >
                  APPROVED
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 12,
                    color: "#0f1f3d",
                    fontWeight: 700,
                    margin: "0 0 4px 0",
                    lineHeight: 1,
                  }}
                >
                  & REGISTERED
                </p>
                <div
                  style={{
                    width: 44,
                    height: 1,
                    background: "#b8943a",
                    margin: "4px 0",
                  }}
                />
                <p
                  style={{
                    fontSize: 8,
                    color: "#8a6000",
                    margin: 0,
                    letterSpacing: "0.1em",
                  }}
                >
                  HOUSING DIVISION
                </p>
              </div>
            </div>

            {/* Signature 2 */}
            <div style={{ textAlign: "center", minWidth: 180 }}>
              <div
                style={{ position: "relative", height: 70, marginBottom: 8 }}
              >
                <img
                  src="/robinson-allan-sig.png"
                  alt="Daniel Signature"
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
              <div style={{ borderTop: "1px solid #0f1f3d", paddingTop: 8 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0f1f3d",
                    margin: "0 0 2px 0",
                  }}
                >
                  Daniel, Esq.
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "#8a8070",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: 0,
                  }}
                >
                  Attorney of Record
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "#8a8070",
                    margin: "2px 0 0 0",
                  }}
                >
                  Bar No. PA-2014-00193
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: "#0f1f3d",
            padding: "16px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: "#b8c4d4",
              fontSize: 10,
              margin: 0,
              letterSpacing: "0.1em",
            }}
          >
            Core Key Realty · In partnership with Invitation Homes
          </p>
          <p style={{ color: "#6b7a94", fontSize: 10, margin: 0 }}>
            Northumberland County Council · Housing &amp; Property Division ·
            Milton, PA 17847
          </p>
        </div>

        {/* Gold accent bar */}
        <div
          style={{
            background:
              "linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%)",
            height: 5,
          }}
        />
      </div>
    </div>
  );
}
