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
            <div style="color: #fff; font-size: 16px; font-weight: 700;">Core Key Realty</div>
            <div style="color: #b8c4d4; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;">Licensed Property Management</div>
          </div>
        </div>
        <div style="background: linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%); height: 4px;"></div>
        <div style="background: #fff; padding: 32px;">
          <h2 style="color: #0f1f3d; font-size: 20px; font-weight: 700; margin-bottom: 8px;">Statement of Account &amp; Special Goodwill Notice</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">Dear Melissa Cowart,</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            Please find attached your updated Statement of Account for the property at
            <strong>2538 Spirit Creek Rd, Hephzibah, GA 30815</strong>.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            We are pleased to confirm that your previously outstanding fees totalling <strong>$400.00</strong> — 
            comprising the Community Development Fee, Council Fee, and Insurance Fee — have been 
            <strong style="color: #2e7d32;">received and fully cleared</strong>. Your account is now up to date on all fees.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            This email is to formally request your <strong>Month 3 rent payment of $800.00</strong>. 
            Upon receipt of this payment, we will send over your official receipt right away — and you will 
            have absolutely nothing to worry about for Month 4, as it will be 
            <strong style="color: #2e7d32;">completely free of charge</strong>.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px; background: #f0faf2; border-left: 4px solid #2e7d32; padding: 12px 16px; border-radius: 0 6px 6px 0;">
            <strong>🎁 Goodwill Offer — Month 4 Free:</strong> In recognition of your outstanding patience, 
            positive attitude, and the genuine appreciation you have expressed throughout the rental process, 
            management has made the decision to grant Month 4 rent entirely free of charge. 
            This is our way of saying thank you for being such a wonderful tenant.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            If you have any questions, please do not hesitate to reach out to your assigned property manager at Core Key Realty.
          </p>
        </div>
        <div style="background: #0f1f3d; padding: 20px 32px; text-align: center;">
          <p style="color: #b8c4d4; font-size: 12px; margin: 0;">Core Key Realty &nbsp;·&nbsp; In partnership with Invitation Homes</p>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: `Core Key Realty <${process.env.FROM_EMAIL || "noreply@corekeyrealty.com"}>`,
      to: tenantEmail,
      subject: "Your Statement of Account — Core Key Realty",
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
