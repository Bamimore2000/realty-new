"use server";

import { Resend } from "resend";

const rawKey = process.env.RESEND_API_KEY || "";
const cleanKey = rawKey.replace(/['\"]+/g, "").trim();
const resend = new Resend(cleanKey);

export async function sendInvoiceEmail(
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
          <h2 style="color: #0f1f3d; font-size: 20px; font-weight: 700; margin-bottom: 8px;">Important Notice — Mandatory Sale &amp; Purchase Option</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">Dear Tammy L. Grigas,</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
            Please find attached your official Statement of Account and formal notice regarding the transition of 
            <strong>2734 E Johnson St, Madison, WI 53704</strong> to a mandatory sale.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            We wish to inform you that <strong>Invitation Homes is no longer offering this property as a rental unit.</strong> 
            The decision to remove the home from the rental market has been made by the property owner, <strong>Jeff Dianne</strong>, 
            and is effective immediately. As such, a continued tenancy arrangement is no longer available for this address.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            However, in recognition of your <strong>outstanding attitude, reliability, and conduct as a tenant</strong>, and as an act 
            of genuine goodwill, the Lessor has made the decision to extend this purchase opportunity exclusively to you — 
            before the property is listed publicly on the open market. This offer reflects our appreciation for the respectful 
            and cooperative relationship you have maintained throughout your tenancy.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            We are pleased to confirm that your lease deposits and move-in fees of <strong>$2,000.00</strong> are fully paid and cleared. 
            The keys are ready to be handed over immediately upon execution of the purchase agreement.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            The home is offered to you at <strong>$28,908.00</strong>. We are requesting a flat down payment of 
            <strong style="color: #0f1f3d;">$10,000.00</strong> now, with the remaining balance of <strong>$18,908.00</strong> 
            to be paid over <strong>30 years</strong> via affordable monthly installments while you occupy and hold full possession of the home.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 14px;">
            This arrangement has been prepared and reviewed by Attorney of Record <strong>Daniel Hall, Esq.</strong> on behalf of 
            Lessor / Seller <strong>Jeff Dianne</strong>. Please review the attached Statement carefully and do not hesitate to reach 
            out with any questions.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            We look forward to welcoming you as a homeowner.
          </p>
        </div>
        <div style="background: #0f1f3d; padding: 20px 32px; text-align: center;">
          <p style="color: #b8c4d4; font-size: 12px; margin: 0;">Invitation Homes &nbsp;·&nbsp; Licensed Wisconsin Property Management</p>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: `Invitation Homes <${process.env.FROM_EMAIL || "noreply@corekeyrealty.com"}>`,
      to: tenantEmail,
      subject: "Statement of Account & Owner-Financed Option — Invitation Homes",
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

    console.log("✅ Invoice email sent successfully!", response);
    return { success: true };
  } catch (error) {
    console.error("🔥 Error sending invoice email:", error);
    return { success: false, error: "Failed to send email. Check API key or domain limits." };
  }
}
