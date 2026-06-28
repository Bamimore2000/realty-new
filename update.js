const fs = require('fs');

const file_path = 'src/app/todd-statement/page.tsx';
let c = fs.readFileSync(file_path, 'utf-8');

c = c.replace(/\$2,000/g, '$500');
c = c.replace(/Rent · Deposit received/g, 'Security Deposit received');

c = c.replace(/\$900/g, '$800');
c = c.replace(/\$100 balance \+ \$800 month 3/g, 'Month 1 Rent');

c = c.replace(/\$2,900/g, '$1,300');
c = c.replace(/Rent · Deposit · Fees/g, 'Rent · Deposit');

c = c.replace(
    /<strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:<\/strong> A total[\s\S]*?1139 Sanderson Ave,[\s\S]*?Scranton, PA 18509\./,
    `<strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:</strong> A total of <strong style={{ color: "#5a5048" }}>$800.00</strong> is outstanding for the first month's rent. Full payment is required for the final process of ratification and to meet at the home at 1pm at 836 Rhodora Ave, Reading, PA 19605.`
);
c = c.replace(
    /<strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:<\/strong> A total[\s\S]*?836 Rhodora Ave,[\s\S]*?Reading, PA 19605\./,
    `<strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:</strong> A total of <strong style={{ color: "#5a5048" }}>$800.00</strong> is outstanding for the first month's rent. Full payment is required for the final process of ratification and to meet at the home at 1pm at 836 Rhodora Ave, Reading, PA 19605.`
);

const grid_regex = /(<div\s+style={{\s*display: "grid",\s*gridTemplateColumns: "1fr 1fr 1fr",\s*gap: 24,[\s\S]*?>\s*<div>\s*<p style={lbl}>Property Address<\/p>[\s\S]*?<p style={lbl}>Tenant Name<\/p>\s*<p style={val}>Todd M\. Houser<\/p>\s*<\/div>)/;

const replacement_grid = `$1
            <div>
              <p style={lbl}>Realtor</p>
              <p style={val}>Daniel Hall</p>
              <p style={{ ...lbl, marginTop: 10 }}>Attorney</p>
              <p style={val}>Jose Roberts</p>
            </div>`;

c = c.replace(/gridTemplateColumns: "1fr 1fr 1fr"/g, 'gridTemplateColumns: "1fr 1fr 1fr 1fr"');

const match = c.match(grid_regex);
if (match) {
    c = c.replace(grid_regex, replacement_grid);
}

const oldPaymentsTable = /<div style={{ marginBottom: 28 }}>\s*<SectionTitle>Previous Payments Received<\/SectionTitle>\s*<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>\s*<thead>[\s\S]*?<\/tbody>\s*<\/table>\s*<\/div>/;

const newPaymentsTable = \`<div style={{ marginBottom: 28 }}>
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
          </div>\`;

c = c.replace(oldPaymentsTable, newPaymentsTable);

const oldBalanceTable = /<div style={{ marginBottom: 28 }}>\s*<SectionTitle>Outstanding Balance Due<\/SectionTitle>\s*<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>\s*<thead>[\s\S]*?<\/tbody>\s*<\/table>\s*<\/div>/;

const newBalanceTable = \`<div style={{ marginBottom: 28 }}>
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
          </div>\`;

c = c.replace(oldBalanceTable, newBalanceTable);

fs.writeFileSync(file_path, c);
