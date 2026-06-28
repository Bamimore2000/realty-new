"use server";

import { Resend } from "resend";

const rawKey = process.env.RESEND_API_KEY || "";
const cleanKey = rawKey.replace(/['"]+/g, "").trim();
const resend = new Resend(cleanKey);

export async function sendMeetingUpdateEmail(
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
          <img src="${logoUrl}" alt="Core Key Realty" style="height: 44px; object-fit: contain;" />
          <div style="width: 1px; height: 40px; background: rgba(255,255,255,0.25);"></div>
          <div>
            <div style="color: #fff; font-size: 16px; font-weight: 700;">Core Key Realty</div>
            <div style="color: #b8c4d4; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;">Licensed Property Management</div>
          </div>
        </div>
        <div style="background: linear-gradient(90deg, #b8943a 0%, #d4ad52 50%, #b8943a 100%); height: 4px;"></div>
        <div style="background: #fff; padding: 32px;">
          <h2 style="color: #0f1f3d; font-size: 20px; font-weight: 700; margin-bottom: 8px;">Meeting Confirmed — 2734 E Johnson St</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">Dear Tammy L. Grigas,</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
            Please find attached a <strong>confirmed meeting update</strong> regarding your purchase of the property at 2734 E Johnson St, Madison, WI 53704.
          </p>
          <div style="background: #fff8e8; border: 1px solid #e8c94a; border-left: 4px solid #e8c94a; border-radius: 6; padding: 16px 18px; margin-bottom: 14px;">
            <p style="color: #856404; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
              <strong>Quick Summary:</strong>
            </p>
            <ul style="color: #856404; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Today's meeting (Monday, June 15) is no longer feasible</li>
              <li>$6,100.00 down payment received; $3,900.00 remaining</li>
              <li>Remaining balance to be paid as $2,000/day installments over two days (daily bank limit)</li>
              <li>Cashier's check won't work for the landlord (truck driver)</li>
              <li>Meeting confirmed: Wednesday, June 17, 2026</li>
            </ul>
          </div>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            We need to receive the full $10,000.00 down payment to properly prepare and package all required documents for closing.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Please review the attached document for full details.
          </p>
        </div>
        <div style="background: #0f1f3d; padding: 20px 32px; text-align: center;">
          <p style="color: #b8c4d4; font-size: 12px; margin: 0;">Core Key Realty &nbsp;·&nbsp; Licensed Wisconsin Property Management</p>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: `Core Key Realty <${process.env.FROM_EMAIL || "noreply@corekeyrealty.com"}>`,
      to: recipientEmail,
      subject: "Meeting Update — 2734 E Johnson St",
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

    console.log("✅ Meeting update email sent successfully!", response);
    return { success: true };
  } catch (error) {
    console.error("🔥 Error sending meeting update email:", error);
    return { success: false, error: "Failed to send email. Check API key or domain limits." };
  }
}
