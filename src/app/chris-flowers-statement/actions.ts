"use server";

import { Resend } from "resend";

const rawKey = process.env.RESEND_API_KEY || "";
const cleanKey = rawKey.replace(/['"]+/g, "").trim();
const resend = new Resend(cleanKey);

export async function sendStatementEmail(
  tenantEmail: string,
  pdfBase64: string,
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const logoUrl = `${baseUrl}/invitation-home.png`;

    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f0ede8;">
        <div style="background: #0f1f3d; padding: 28px 32px; display: flex; align-items: center; gap: 16px;">
          <img src="${logoUrl}" alt="Invitation Homes" style="height: 44px; object-fit: contain;" />
          <div style="width: 1px; height: 40px; background: rgba(255,255,255,0.25);"></div>
          <div>
            <div style="color: #fff; font-size: 16px; font-weight: 700;">Invitation Homes</div>
            <div style="color: #b8c4d4; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;">Licensed Property Management</div>
          </div>
        </div>
        <div style="background: linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%); height: 4px;"></div>
        <div style="background: #fff; padding: 32px;">
          <h2 style="color: #0f1f3d; font-size: 20px; font-weight: 700; margin-bottom: 8px;">Official Notice & Statement of Account</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">Dear Chris Flowers,</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            Please find attached your updated Statement of Account for the property at
            <strong>260 W 18th St, San Bernadino, CA 92405</strong>.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            We are pleased to confirm that your initial payments totaling <strong>$615.00</strong> — 
            consisting of Application Fee ($65.00) and Security Deposit ($550.00) — have been 
            <strong style="color: #2e7d32;">received and fully cleared</strong>.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            Per California landlord-tenant law, this email is to formally request the <strong>First Month's Rent of $1,000.00</strong>.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px; background: #fff8e8; border-left: 4px solid #e8c94a; padding: 12px 16px; border-radius: 0 6px 6px 0;">
            <strong>Important Notice:</strong> Payment of the first month's rent is the <strong>absolute final and only remaining obstacle</strong> delaying your move-in. 
            Once this final $1,000.00 is settled, everything will be completely done. You will immediately receive the keys and full possessory rights to the home.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            If you have any questions, please don't hesitate to reach out to Landlord Alejandra Sanchez or Attorney of Record Daniel Hall.
          </p>
        </div>
        <div style="background: #0f1f3d; padding: 20px 32px; text-align: center;">
          <p style="color: #b8c4d4; font-size: 12px; margin: 0;">Invitation Homes &nbsp;·&nbsp; Licensed California Property Management</p>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: `Invitation Homes <${process.env.FROM_EMAIL || "noreply@corekeyrealty.com"}>`,
      to: tenantEmail,
      subject: "Your Statement of Account — Invitation Homes",
      html,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64,
        },
      ],
    });

    if (response.error) {
      console.error("Resend API Error:", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending statement email:", error);
    return { success: false, error: "Failed to send email. Check API key or domain limits." };
  }
}
