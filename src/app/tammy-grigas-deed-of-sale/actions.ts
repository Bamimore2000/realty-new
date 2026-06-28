"use server";

import { Resend } from "resend";

const rawKey = process.env.RESEND_API_KEY || "";
const cleanKey = rawKey.replace(/['"]+/g, "").trim();
const resend = new Resend(cleanKey);

export async function sendDeedEmail(
  recipientEmail: string,
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
          <h2 style="color: #0f1f3d; font-size: 20px; font-weight: 700; margin-bottom: 8px;">Warranty Deed — Pending Final Payment</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">Dear Tammy L. Grigas,</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
            Please find attached your <strong>official Warranty Deed</strong> for the property at <strong>2734 E Johnson St, Madison, WI 53704</strong>.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            This deed is ready to be executed and recorded <strong>after receipt of the $10,000.00 down payment on Monday, June 15, 2026</strong>.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            As a recap, the total purchase price is <strong>$28,908.00</strong>:
          </p>
          <ul style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            <li>$10,000.00 initial down payment (pending receipt June 15, 2026)</li>
            <li>$18,908.00 remaining principal to be financed over 30 years via land contract</li>
          </ul>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            After your payment is received and cleared, we will hold a <strong>home handover meeting</strong> at the property on Monday, June 15, 2026 at 10:00 AM where we will hand over the keys, sign final paperwork, and formally convey possession.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            This deed has been prepared and reviewed by Attorney of Record <strong>Daniel Hall, Esq.</strong> on behalf of the seller, Jeff Dianne.
          </p>
        </div>
        <div style="background: #0f1f3d; padding: 20px 32px; text-align: center;">
          <p style="color: #b8c4d4; font-size: 12px; margin: 0;">Invitation Homes &nbsp;·&nbsp; Licensed Wisconsin Property Management</p>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: `Invitation Homes <${process.env.FROM_EMAIL || "noreply@corekeyrealty.com"}>`,
      to: recipientEmail,
      subject: "Warranty Deed — 2734 E Johnson St",
      html,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64,
        },
      ],
    });

    if (response.error) {
      console.error("❌ Resend API Error:", response.error);
      return { success: false, error: response.error.message };
    }

    console.log("✅ Deed email sent successfully!", response);
    return { success: true };
  } catch (error) {
    console.error("🔥 Error sending deed email:", error);
    return { success: false, error: "Failed to send email. Check API key or domain limits." };
  }
}