"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCertificateEmail(
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
      subject: `🏘️ Certificate of Tenant Registration - ${propertyAddress}`,
      html: `
        <div style="font-family: 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.6;">
          <div style="text-align: center; border-bottom: 2px solid #111827; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-size: 24px; text-transform: uppercase; margin: 0; color: #111827;">Certificate of Tenant Registration</h1>
            <p style="font-size: 14px; color: #6b7280; margin: 5px 0 0 0;">${propertyAddress}</p>
          </div>
          
          <div style="padding: 0 10px;">
            <p>Dear ${tenantName},</p>
            
            <p>Please find attached your official <strong>Certificate of Tenant Registration</strong> for the property at ${propertyAddress}.</p>
            
            <p>This certificate has been issued under the authority of the Dougherty County Council — Housing & Property Division and Core Key Realty.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 25px 0;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #111827;">Important Information:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>This certificate grants you exclusive occupancy rights</li>
                <li>Keep a copy for your records</li>
                <li>Any changes to tenancy must be registered</li>
              </ul>
            </div>
            
            <p>If you have any questions, please don't hesitate to contact our office.</p>
            
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
