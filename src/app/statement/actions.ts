"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendStatementEmail(
  email: string,
  pdfBase64: string,
  fileName: string,
  tenantName: string,
  propertyAddress: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Core Key Realty <no-reply@corekeyrealty.com>",
      to: email,
      subject: `💰 Statement of Account - ${propertyAddress}`,
      html: `
        <div style="font-family: 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.6;">
          <div style="text-align: center; border-bottom: 2px solid #111827; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-size: 24px; text-transform: uppercase; margin: 0; color: #111827;">Statement of Account</h1>
            <p style="font-size: 14px; color: #6b7280; margin: 5px 0 0 0;">${propertyAddress}</p>
          </div>
          
          <div style="padding: 0 10px;">
            <p>Dear ${tenantName},</p>
            
            <p>Please find attached your official <strong>Statement of Account</strong> for the property at ${propertyAddress}.</p>
            
            <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border: 1px solid #fcd34d; margin: 25px 0;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #92400e;">Important Payment Reminder:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Outstanding balance: <strong>$200.00</strong></li>
                <li>Payment due by 9:00 AM today</li>
                <li>Complete payment required for move-in</li>
              </ul>
            </div>
            
            <p>Your statement shows a total paid amount of $2,170.00 with $200.00 remaining due. Please settle the outstanding balance to complete your move-in process.</p>
            
            <p>If you have any questions about your statement, please contact our office immediately.</p>
            
            <p style="margin-top: 40px; border-top: 1px solid #e5e7eb; pt: 20px;">
              Best regards,<br>
              <strong>Core Key Realty</strong><br>
              Licensed Property Management
            </p>
          </div>
          
          <div style="margin-top: 50px; text-align: center; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">
            <p>© ${new Date().getFullYear()} Core Key Realty • In partnership with Invitation Homes</p>
            <p>Dougherty County Housing Division</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email Service Error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
