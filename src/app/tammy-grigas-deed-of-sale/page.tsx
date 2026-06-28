"use client";

import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Download, Printer, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { sendDeedEmail } from "./actions";

// Shared styles
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

export default function TammyGrigasDeedOfSalePage() {
  const deedRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const generatePdfBase64 = async (): Promise<{
    base64: string;
    pdf: jsPDF;
  } | null> => {
    const element = deedRef.current;
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
      result.pdf.save("tammy-grigas-deed-of-sale.pdf");
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
      const res = await sendDeedEmail(
        email,
        result.base64,
        "tammy-grigas-deed-of-sale.pdf",
      );
      if (res.success) {
        toast.success("Deed emailed successfully!");
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
      {/* Action Bar */}
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
          placeholder="Recipient email address..."
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
              <Send size={15} /> Send
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

      {/* Document Container */}
      <div
        ref={deedRef}
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
              WARRANTY DEED
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
              Full Title Transfer & Conveyance
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
              <p style={labelStyle}>Property Address</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>
                2734 E Johnson St
                <br />
                Madison, WI 53704
              </p>
            </div>
            <div>
              <p style={labelStyle}>Grantor (Seller)</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Jeff Dianne</p>
              <p style={{ ...labelStyle, marginTop: 10 }}>Grantee (Buyer)</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Tammy L. Grigas</p>
            </div>
            <div>
              <p style={labelStyle}>Notary Public</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>
                Sarah K. Miller, Not. Pub.
              </p>
              <p style={{ ...labelStyle, marginTop: 10 }}>Date Issued</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>June 12, 2026</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={labelStyle}>Deed Reference</p>
              <p
                style={{
                  ...valueStyle,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 15,
                  color: "#0f1f3d",
                  marginTop: 4,
                }}
              >
                #DEED-2026-0842
              </p>
              <p style={{ ...labelStyle, marginTop: 10 }}>County</p>
              <p style={{ ...valueStyle, marginTop: 4 }}>Dane County, WI</p>
            </div>
          </div>

          {/* Property History */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Property History & Chain of Title</SectionTitle>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Date</Th>
                  <Th>Grantor</Th>
                  <Th>Grantee</Th>
                  <Th>Document Type</Th>
                  <Th right>Book/Page</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td>June 12, 2026</Td>
                  <Td>Jeff Dianne</Td>
                  <Td>Tammy L. Grigas</Td>
                  <Td>Warranty Deed</Td>
                  <Td mono>412 / 892</Td>
                </Tr>
                <Tr>
                  <Td>April 5, 2019</Td>
                  <Td>Robert & Linda Peterson</Td>
                  <Td>Jeff Dianne</Td>
                  <Td>Quitclaim Deed</Td>
                  <Td mono>358 / 441</Td>
                </Tr>
                <Tr>
                  <Td>July 12, 2008</Td>
                  <Td>Milwaukee Savings Bank</Td>
                  <Td>Robert & Linda Peterson</Td>
                  <Td>Trustee's Deed</Td>
                  <Td mono>291 / 156</Td>
                </Tr>
                <Tr>
                  <Td>March 2, 1992</Td>
                  <Td>William J. Carter</Td>
                  <Td>Milwaukee Savings Bank</Td>
                  <Td>Warranty Deed</Td>
                  <Td mono>215 / 734</Td>
                </Tr>
              </tbody>
            </table>
          </div>

          {/* Legal Description */}
          <div
            style={{
              background: "#fcfbfa",
              border: "1px solid #e8e4dc",
              borderRadius: 8,
              padding: 18,
              marginBottom: 28,
            }}
          >
            <SectionTitle>Legal Description of Property</SectionTitle>
            <p
              style={{
                fontSize: 12,
                color: "#333",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              Lot 17, Block 4, of EASTSIDE ADDITION, in the City of Madison,
              Dane County, Wisconsin, according to the recorded plat thereof in
              Plat Book 12, Page 56, records of Dane County, Wisconsin.
              <br />
              <br />
              Together with all and singular the rights, privileges,
              hereditaments, and appurtenances thereunto belonging or in anywise
              appertaining, and the reversion and reversions, remainder and
              remainders, rents, issues, and profits thereof.
            </p>
          </div>

          {/* Consideration */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Consideration & Payment Details</SectionTitle>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#0f1f3d" }}>
                  <Th>Description</Th>
                  <Th>Method</Th>
                  <Th right>Amount</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td>
                    Total Purchase Price
                    <div
                      style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}
                    >
                      Full purchase price for the property
                    </div>
                  </Td>
                  <Td note>Owner-Financed</Td>
                  <Td mono>$28,908.00</Td>
                </Tr>
                <Tr>
                  <Td>
                    Initial Down Payment (Pending)
                    <div
                      style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}
                    >
                      Flat option deposit due June 15, 2026
                    </div>
                  </Td>
                  <Td note>Certified Funds</Td>
                  <Td mono>$10,000.00</Td>
                </Tr>
                <Tr>
                  <Td>
                    Remaining Principal Balance
                    <div
                      style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}
                    >
                      Financed over 30 years via land contract
                    </div>
                  </Td>
                  <Td note>Promissory Note</Td>
                  <Td mono>$18,908.00</Td>
                </Tr>
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      background: "#fff3cd",
                      padding: "10px 14px",
                      textAlign: "right",
                      fontSize: 12,
                      color: "#856404",
                      fontStyle: "italic",
                    }}
                  >
                    DEED TO BE RECORDED AFTER DOWN PAYMENT RECEIVED
                  </td>
                  <td
                    style={{
                      background: "#fff3cd",
                      padding: "10px 14px",
                      textAlign: "right",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#856404",
                    }}
                  >
                    ⏳ PENDING PAYMENT
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Handover Meeting */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle>Home Handover Meeting</SectionTitle>
            <div
              style={{
                background: "#fff8e8",
                border: "1px solid #e8c94a",
                borderLeft: "4px solid #e8c94a",
                borderRadius: 6,
                padding: "18px 20px",
                fontSize: 12,
                color: "#856404",
                lineHeight: 1.8,
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Meeting Details
              </strong>
              <p style={{ margin: "0 0 8px 0" }}>
                After payment of the $10,000.00 down payment on{" "}
                <strong>Monday, June 15, 2026</strong>, a meeting will be held
                at the property for the official handover.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Location:</strong> 2734 E Johnson St, Madison, WI 53704
                <br />
                <strong>Time:</strong> 10:00 AM
                <br />
                <strong>Attendees:</strong> Jeff Dianne (Seller), Tammy L.
                Grigas (Buyer), Daniel Hall, Esq. (Attorney)
              </p>
              <p style={{ marginTop: 12, marginBottom: 0 }}>
                During this meeting, physical keys will be handed over, final
                paperwork will be signed, and full possession of the property
                will be conveyed.
              </p>
            </div>
          </div>

          {/* Granting Clause */}
          <div
            style={{
              background: "#f7f4ef",
              border: "1px solid #e8e4dc",
              borderLeft: "4px solid #b8943a",
              borderRadius: 4,
              padding: "18px 20px",
              marginBottom: 28,
              fontSize: 12,
              color: "#333",
              lineHeight: 1.9,
            }}
          >
            <strong
              style={{
                color: "#0f1f3d",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              GRANTING CLAUSE
            </strong>
            KNOW ALL MEN BY THESE PRESENTS, That JEFF DIANNE, Grantor, of Dane
            County, Wisconsin, for and in consideration of the sum of Ten
            Thousand and 00/100 Dollars ($10,000.00) in hand paid, and a
            promissory note for the balance of Eighteen Thousand Nine Hundred
            Eight and 00/100 Dollars ($18,908.00), the receipt whereof is hereby
            acknowledged, does hereby GRANT, BARGAIN, SELL, CONVEY and CONFIRM
            unto TAMMY L. GRIGAS, Grantee, of Dane County, Wisconsin, the real
            property described above, together with all and singular the
            appurtenances thereunto belonging, TO HAVE AND TO HOLD the same unto
            the said Grantee, her heirs and assigns forever.
          </div>

          {/* Covenants */}
          <div
            style={{
              background: "#f0f7ff",
              border: "1px solid #b8d4f0",
              borderRadius: 6,
              padding: "14px 18px",
              marginBottom: 28,
              fontSize: 11.5,
              color: "#1a3a5c",
              lineHeight: 1.75,
            }}
          >
            <strong
              style={{
                color: "#1a5fa8",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              COVENANTS OF WARRANTY
            </strong>
            <br />
            <br />
            That the Grantor is lawfully seized of said premises in fee simple;
            that the Grantor has good right to sell and convey the same; that
            the Grantee shall and may peacefully and quietly have, hold, use,
            occupy, possess, and enjoy the same; and that said premises are free
            from all encumbrances, liens, or claims whatsoever, except the
            promissory note for the remaining balance. That the Grantor will
            WARRANT AND DEFEND the title to said premises unto the said Grantee,
            her heirs and assigns, forever.
          </div>

          {/* Signatures Block */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              marginBottom: 32,
            }}
          >
            {/* Grantor Signature */}
            <div>
              <div
                style={{ height: 56, marginBottom: 0, position: "relative" }}
              >
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
              <div
                style={{
                  fontSize: 11,
                  color: "#5a5048",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
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
                Grantor / Seller
              </div>
            </div>

            {/* Grantee Signature */}
            <div>
              <div style={{ height: 56, marginBottom: 0 }} />
              <div
                style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "#5a5048",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
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
                Grantee / Buyer
              </div>
            </div>
          </div>

          {/* Notary Block */}
          <div
            style={{
              border: "2px double #0f1f3d",
              borderRadius: 8,
              padding: 24,
              marginBottom: 32,
              background: "#fff",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid #e8e4dc",
              }}
            >
              <strong
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 14,
                  color: "#0f1f3d",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                STATE OF WISCONSIN
                <br />
                DANE COUNTY, SS.
              </strong>
            </div>

            <p
              style={{
                fontSize: 11,
                color: "#333",
                lineHeight: 1.7,
                marginBottom: 16,
              }}
            >
              On this <strong>12th day of June, 2026</strong>, before me, a
              Notary Public in and for said County and State, personally
              appeared <strong>Jeff Dianne</strong>, known to me (or proved to
              me on the basis of satisfactory evidence) to be the person whose
              name is subscribed to the within instrument and acknowledged that
              he executed the same in his authorized capacity.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              <div>
                <div style={{ height: 48, marginBottom: 0 }} />
                <div
                  style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }}
                />
                <div
                  style={{
                    fontSize: 10,
                    color: "#5a5048",
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  Sarah K. Miller
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
                  Notary Public
                </div>
              </div>

              <div>
                <p style={{ fontSize: 10, color: "#5a5048", margin: 0 }}>
                  My Commission Expires: <strong>October 31, 2029</strong>
                </p>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    border: "2px solid #b8943a",
                    borderRadius: "50%",
                    marginLeft: "auto",
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    background: "#fff8e8",
                  }}
                >
                  <div
                    style={{
                      fontSize: 7,
                      color: "#0f1f3d",
                      lineHeight: 1.2,
                      fontWeight: 600,
                    }}
                  >
                    NOTARY
                    <br />
                    SEAL
                    <br />
                    DANE CO., WI
                  </div>
                </div>
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
                <strong style={{ color: "#5a5048" }}>Recording Info:</strong>{" "}
                This instrument is to be recorded in the Office of the Register
                of Deeds, Dane County, Wisconsin. Conveyance tax paid in full.
                Deed recorded at the request of Tammy L. Grigas.
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "#9a9080",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                <strong style={{ color: "#5a5048" }}>Prepared By:</strong>{" "}
                Daniel Hall, Esq. &nbsp;|&nbsp;
                <strong style={{ color: "#5a5048" }}>Ref:</strong>{" "}
                #DEED-2026-0842
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
              Invitation Homes &nbsp;·&nbsp; Licensed Wisconsin Property
              Management
            </div>
            <div
              style={{ color: "#6a7a90", fontSize: 9, letterSpacing: "0.08em" }}
            >
              Wis. Stat. § 706.02 &nbsp;·&nbsp; Ref: #DEED-2026-0842
              &nbsp;·&nbsp; Issued: June 12, 2026
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
