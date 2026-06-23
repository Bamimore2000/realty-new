"use client";

import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { Download, Printer, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { sendStatementEmail } from "./actions";

const lbl: React.CSSProperties = { fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a8070", fontWeight: 600, margin: 0 };
const val: React.CSSProperties = { fontSize: 13, color: "#1a1a1a", fontWeight: 500, lineHeight: 1.5, margin: 0 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };

function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: "#0f1f3d", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "#d4c9b0" }} />
    </div>
  );
}

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return <th style={{ color: "#b8c4d4", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", padding: "10px 14px", fontWeight: 500, textAlign: right ? "right" : "left" }}>{children}</th>;
}
function Td({ children, mono, note }: { children?: React.ReactNode; mono?: boolean; note?: boolean }) {
  return <td style={{ padding: "12px 14px", color: "#2a2520", textAlign: mono ? "right" : "left", fontStyle: note ? "italic" : "normal", fontSize: note ? 11 : 13, fontWeight: mono ? 500 : 400 }}>{children}</td>;
}

const CLEARED = <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: "#eaf4ec", color: "#1b5e20" }}>✓ Cleared</span>;
const PENDING = <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: "#fff3cd", color: "#8a6000" }}>⏳ Pending</span>;

export default function TanyaMarieMendyStatementPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState("");

  const genPdf = async () => {
    const el = ref.current; if (!el) return null;
    const w = el.scrollWidth, h = el.scrollHeight;
    const url = await toJpeg(el, { pixelRatio: 2, quality: 0.95, skipAutoScale: true, style: { margin: "0", maxWidth: "none" } });
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [w, h] });
    pdf.addImage(url, "JPEG", 0, 0, w, h);
    return { base64: pdf.output("datauristring").split(",")[1], pdf };
  };

  const handleDownload = async () => {
    try { const r = await genPdf(); if (!r) return; r.pdf.save("tanya-marie-mendy-statement.pdf"); toast.success("Downloaded!"); }
    catch { toast.error("Failed to generate PDF."); }
  };

  const handleEmail = async () => {
    if (!email) { toast.error("Enter an email address."); return; }
    try {
      setSending(true);
      const r = await genPdf(); if (!r) return;
      const res = await sendStatementEmail(email, r.base64, "tanya-marie-mendy-statement.pdf");
      res.success ? toast.success("Statement emailed!") : toast.error(res.error || "Failed.");
    } catch { toast.error("An error occurred."); } finally { setSending(false); }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f0ede8", padding: "40px 20px", minHeight: "100vh" }}>
      {/* Controls */}
      <div className="no-print" style={{ maxWidth: 780, margin: "0 auto 24px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input type="email" placeholder="Tenant email..." value={email} onChange={e => setEmail(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 8, border: "1px solid #d4c9b0", fontSize: 13, background: "#fff", outline: "none" }} />
        <button onClick={handleEmail} disabled={sending} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "#0f1f3d", color: "#fff", border: "none", cursor: sending ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, opacity: sending ? 0.7 : 1 }}>
          {sending ? <><RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : <><Send size={15} /> Send to Tenant</>}
        </button>
        <button onClick={handleDownload} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "#b8943a", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          <Download size={15} /> Download PDF
        </button>
        <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "#fff", color: "#0f1f3d", border: "1px solid #d4c9b0", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          <Printer size={15} /> Print
        </button>
      </div>

      {/* Document */}
      <div ref={ref} className="statement-document" style={{ maxWidth: 780, margin: "0 auto", background: "#fff", boxShadow: "0 4px 40px rgba(0,0,0,0.12)" }}>
        {/* Header */}
        <div style={{ background: "#0f1f3d", padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: "6px 10px" }}><img src="/invitation-home.png" alt="Logo" style={{ height: 44, objectFit: "contain" }} /></div>
            <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.25)" }} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 17, fontWeight: 700 }}>Invitation Homes</div>
              <div style={{ color: "#b8c4d4", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3 }}>Licensed Property Management · State of Idaho</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8c4d4", margin: "0 0 6px" }}>Official Legal Document</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>Statement of Account</h2>
          </div>
        </div>
        <div style={{ background: "linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%)", height: 4 }} />

        <div style={{ padding: "36px 48px" }}>
          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #e8e4dc" }}>
            <div><p style={lbl}>Premises Address</p><p style={{ ...val, marginTop: 4 }}>6550 Kelso Lake Rd<br />Athol, ID 83801</p></div>
            <div>
              <p style={lbl}>Lessee / Tenant</p><p style={{ ...val, marginTop: 4 }}>Mrs. Tanya Marie Mendy</p>
              <p style={{ ...lbl, marginTop: 10 }}>Lessor / Owner</p><p style={{ ...val, marginTop: 4 }}>Alan Scott</p>
            </div>
            <div>
              <p style={lbl}>Attorney of Record</p><p style={{ ...val, marginTop: 4 }}>Daniel Hall, Esq.</p>
              <p style={{ ...lbl, marginTop: 10 }}>Governing Jurisdiction</p><p style={{ ...val, marginTop: 4 }}>Kootenai County, Idaho</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={lbl}>Invoice Reference</p><p style={{ ...val, fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#0f1f3d", marginTop: 4 }}>#INV-2026-0903</p>
              <p style={{ ...lbl, marginTop: 10 }}>Date Issued</p><p style={{ ...val, marginTop: 4 }}>June 23, 2026</p>
            </div>
          </div>

          {/* Paid banner */}
          <div style={{ display: "flex", alignItems: "center", background: "#eaf4ec", border: "1px solid #a5d6a7", borderRadius: 6, padding: "14px 18px", marginBottom: 28, gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2e7d32", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1b5e20", margin: 0 }}>Initial Fees Fully Satisfied — $740.00</p>
              <span style={{ fontSize: 11, color: "#388e3c" }}>Application fee ($140.00) and security deposit ($600.00) have been received and fully cleared.</span>
            </div>
          </div>

          {/* Notice */}
          <div style={{ background: "#f7f4ef", border: "1px solid #e8e4dc", borderLeft: "4px solid #0f1f3d", borderRadius: 4, padding: "14px 18px", marginBottom: 28, fontSize: 11.5, color: "#5a5048", lineHeight: 1.75 }}>
            <strong style={{ color: "#0f1f3d", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>Possession &amp; Key Handover Notice — </strong>
            This Statement of Account is issued by Invitation Homes to <strong>Mrs. Tanya Marie Mendy</strong> (hereinafter "Lessee") confirming receipt of initial payments. The Lessor, <strong>Alan Scott</strong>, and Attorney of Record, <strong>Daniel Hall, Esq.</strong>, acknowledge these payments. Keys will be handed over upon full payment of the <strong>$900.00</strong> outstanding balance.
          </div>

          {/* Paid table */}
          <div style={{ marginBottom: 28 }}>
            <SecTitle>Schedule of Satisfied Payments</SecTitle>
            <table style={tbl}>
              <thead><tr style={{ background: "#0f1f3d" }}><Th>Item / Description</Th><Th>Statutory Basis</Th><Th>Status</Th><Th right>Amount Remitted</Th></tr></thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <Td>Application Fee<div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>Processing and background screening</div></Td>
                  <Td note>Administrative</Td><Td>{CLEARED}</Td><Td mono>$140.00</Td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede8" }}>
                  <Td>Security Deposit<div style={{ fontSize: 10, color: "#8a8070", marginTop: 2 }}>Refundable damage deposit</div></Td>
                  <Td note>Idaho Code Title 55</Td><Td>{CLEARED}</Td><Td mono>$600.00</Td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ background: "#f7f4ef", padding: "10px 14px", textAlign: "right", fontSize: 12, color: "#5a5048", fontStyle: "italic" }}>Total Remittances Cleared to Date:</td>
                  <td style={{ background: "#f7f4ef", padding: "10px 14px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#1b5e20" }}>$740.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pending table */}
          <div style={{ marginBottom: 28 }}>
            <SecTitle>Outstanding Balance — Required Prior to Key Handover</SecTitle>
            <table style={tbl}>
              <thead><tr style={{ background: "#0f1f3d" }}><Th>Obligation / Item</Th><Th>Statutory Basis / Terms</Th><Th>Status</Th><Th right>Amount Due</Th></tr></thead>
              <tbody>
                <tr>
                  <td style={{ background: "#fff3cd", borderLeft: "4px solid #d4ad52", padding: "13px 14px", fontWeight: 600, color: "#5a3e00" }}>
                    Remaining Balance — Key Handover Fee
                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, color: "#8a6000" }}>Required payment prior to handover of keys and commencement of tenancy.</div>
                  </td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px", fontSize: 11, color: "#8a6000" }}><em>Pursuant to Idaho landlord-tenant law and executed lease agreement.</em></td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px" }}>{PENDING}</td>
                  <td style={{ background: "#fff3cd", padding: "13px 14px", fontWeight: 700, textAlign: "right", color: "#8a6000", fontSize: 16 }}>$900.00</td>
                </tr>
                <tr style={{ background: "#0f1f3d" }}>
                  <td colSpan={2} style={{ padding: "16px 14px", color: "#b8c4d4", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>Total Balance Now Due — Keys Handed Over Upon Full Payment</td>
                  <td style={{ padding: "16px 14px" }} />
                  <td style={{ padding: "16px 14px", fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#d4ad52", textAlign: "right", fontWeight: 700 }}>$900.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal */}
          <div style={{ background: "#fff8e8", border: "1px solid #e8c94a", borderRadius: 6, padding: "14px 18px", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 18, lineHeight: 1.1, marginTop: 2 }}>⚖️</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7a5500", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>Formal Notice — Key Handover Condition</div>
              <div style={{ fontSize: 11.5, color: "#8a6000", lineHeight: 1.75 }}>
                The outstanding balance of <strong>$900.00</strong> must be paid in full before the keys to the property are handed over to <strong>Mrs. Tanya Marie Mendy</strong>. Settlement of this amount is a mandatory condition under the executed lease agreement.
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 32, paddingTop: 20, borderTop: "1px solid #e8e4dc" }}>
            <div>
              <div style={{ height: 56, marginBottom: 0 }}><img src="/signature-1.jpg" alt="Alan Scott" style={{ height: 52, maxWidth: "100%", objectFit: "contain", objectPosition: "left bottom", display: "block" }} /></div>
              <div style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }} />
              <div style={{ fontSize: 10, color: "#5a5048", fontWeight: 600 }}>Alan Scott</div>
              <div style={{ fontSize: 9, color: "#9a9080", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Lessor / Owner</div>
            </div>
            <div>
              <div style={{ height: 56, marginBottom: 0 }}><img src="/images-sig-2.jpg" alt="Daniel Hall" style={{ height: 52, maxWidth: "100%", objectFit: "contain", objectPosition: "left bottom", display: "block" }} /></div>
              <div style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }} />
              <div style={{ fontSize: 10, color: "#5a5048", fontWeight: 600 }}>Daniel Hall, Esq.</div>
              <div style={{ fontSize: 9, color: "#9a9080", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Attorney of Record</div>
            </div>
            <div>
              <div style={{ height: 56, marginBottom: 0 }} />
              <div style={{ height: 1, background: "#1a1a1a", marginBottom: 6 }} />
              <div style={{ fontSize: 10, color: "#5a5048", fontWeight: 600 }}>Mrs. Tanya Marie Mendy</div>
              <div style={{ fontSize: 9, color: "#9a9080", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Lessee / Tenant</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ background: "#0f1f3d", margin: "28px -48px -36px", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ color: "#b8c4d4", fontSize: 10, letterSpacing: "0.1em" }}>Invitation Homes &nbsp;·&nbsp; Licensed Idaho Property Management</div>
            <div style={{ color: "#6a7a90", fontSize: 9 }}>Idaho Landlord-Tenant Law &nbsp;·&nbsp; Ref: #INV-2026-0903 &nbsp;·&nbsp; Issued: June 23, 2026</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media print { .no-print { display: none !important; } body { background: #fff !important; padding: 0 !important; } .statement-document { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; } }
      `}</style>
    </div>
  );
}
