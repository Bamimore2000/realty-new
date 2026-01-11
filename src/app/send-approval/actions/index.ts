"use server";

import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  propertyAddress: z.string().min(5),
});

const schema2 = z.object({
  destination: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  htmlContent: z.string().min(1, "Message content is required"),
  sourcePrefix: z.string().min(1, "Source prefix is required"),
});

export async function sendMessage(formData: FormData) {
  try {
    console.log("📨 sendMessage called");

    const destination = formData.get("destination");
    const subject = formData.get("subject");
    const htmlContent = formData.get("htmlContent");
    const sourcePrefix = formData.get("sourcePrefix");

    console.log("📥 Raw form data:", {
      destination,
      subject,
      sourcePrefix,
      contentLength: htmlContent?.toString().length,
    });

    const parsed = schema2.safeParse({
      destination,
      subject,
      htmlContent,
      sourcePrefix,
    });

    if (!parsed.success) {
      console.error("❌ Validation failed:", parsed.error.flatten());

      return { message: "Invalid form data", error: parsed.error.flatten() };
    }

    const fromEmail = `${parsed.data.sourcePrefix}@corekeyrealty.com`;

    console.log("📤 Sending email via Resend…");
    console.log("From:", fromEmail);
    console.log("To:", parsed.data.destination);
    console.log("Subject:", parsed.data.subject);
    console.log(
      "HTML Content Preview:",
      parsed.data.htmlContent.substring(0, 200)
    );

    const response = await resend.emails.send({
      from: fromEmail,
      to: parsed.data.destination,
      subject: parsed.data.subject,
      html: parsed.data.htmlContent,
    });

    console.log("✅ Email sent successfully");
    console.log("✅ Resend response:", response);

    return { message: "Message sent successfully", data: response };
  } catch (error) {
    console.error("🔥 Email send failed:", error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error("🔥 Error name:", error.name);
      console.error("🔥 Error message:", error.message);
      console.error("🔥 Error stack:", error.stack);
    }

    // Log if it's a Resend API error
    if (typeof error === "object" && error !== null) {
      console.error("🔥 Full error object:", JSON.stringify(error, null, 2));
    }

    return {
      message: "Failed to send message",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendLeaseAgreement(formData: FormData) {
  try {
    console.log("📨 sendLeaseAgreement called");

    const email = formData.get("email");
    const fullName = formData.get("fullName");
    const propertyAddress = formData.get("propertyAddress");
    const file = formData.get("pdf") as File | null;

    console.log("📥 Raw form data:", {
      email,
      fullName,
      propertyAddress,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
    });

    const parsed = schema.safeParse({
      email,
      fullName,
      propertyAddress,
    });

    if (!parsed.success) {
      console.error("❌ Zod validation failed:", parsed.error.flatten());
      return { message: "Invalid form data" };
    }

    if (!file) {
      console.error("❌ Invalid or missing DOCX");
      return { message: "Please upload a valid DOCX file" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    console.log("📎 Attachment ready:", buffer.length, "bytes");

    const html = buildLeaseAgreementEmail({
      fullName: parsed.data.fullName,
      propertyAddress: parsed.data.propertyAddress,
    });

    console.log("📤 Sending email via Resend…");

    const sanitizedAddress = parsed.data.propertyAddress
      .replace(/[\r\n]+/g, " ")
      .trim();

    await resend.emails.send({
      from: "approval@corekeyrealty.com", // make sure domain verified
      to: parsed.data.email,
      subject: `Lease Agreement – ${sanitizedAddress}`,
      html,
      attachments: [
        {
          filename: file.name,
          content: buffer.toString("base64"),
        },
      ],
    });

    return { message: "Lease agreement sent successfully" };
  } catch (error) {
    console.error("🔥 Email send failed:", error);
    return { message: "Failed to send lease agreement" };
  }
}

function buildLeaseAgreementEmail({
  fullName,
  propertyAddress,
}: {
  fullName: string;
  propertyAddress: string;
}) {
  // sanitize line breaks
  const sanitizedAddress = propertyAddress.replace(/[\r\n]+/g, " ").trim();

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e5e7eb; font-family: Arial, Helvetica, sans-serif;">
        <!-- Logo -->
        <tr>
          <td align="center" style="padding-bottom: 24px;">
            <img
              src="https://dokumfe7mps0i.cloudfront.net/media/logos/2022/06/283238_1655844560.7826822_InvitationHomesBoldedcmykRevLogo.png"
              alt="Invitation Homes"
              width="220"
              style="display: block; max-width: 220px; height: auto;"
            />
          </td>
        </tr>

        <!-- Heading -->
        <tr>
          <td style="color: #111827; font-size: 20px; font-weight: bold; padding-bottom: 16px;">
            Lease Agreement – Invitation Homes
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="color: #374151; font-size: 15px; line-height: 1.6; padding-bottom: 12px;">
            Dear ${fullName},
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="color: #374151; font-size: 15px; line-height: 1.6; padding-bottom: 12px;">
            We are pleased to provide the lease agreement for the following property:
          </td>
        </tr>

        <!-- Property Address -->
        <tr>
          <td style="color: #111827; font-size: 15px; font-weight: bold; padding-bottom: 16px;">
            ${sanitizedAddress}
          </td>
        </tr>

        <!-- Instructions -->
        <tr>
          <td style="color: #374151; font-size: 15px; line-height: 1.6; padding-bottom: 12px;">
            Please find the <strong>Invitation Homes Lease Agreement</strong> attached to this email in DOCX format.
            Kindly review the document carefully and follow the instructions outlined within to proceed.
          </td>
        </tr>

        <tr>
          <td style="color: #374151; font-size: 15px; line-height: 1.6; padding-bottom: 12px;">
            If you have any questions or require further assistance, please contact our leasing team.
          </td>
        </tr>

        <!-- Closing -->
        <tr>
          <td style="color: #374151; font-size: 15px; line-height: 1.6; padding-top: 24px;">
            Sincerely,<br />
            <strong>Invitation Homes Leasing Team</strong>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="border-top: 1px solid #e5e7eb; padding-top: 24px; color: #6b7280; font-size: 12px; line-height: 1.4;">
            This email and any attachments may contain confidential information intended solely for the recipient.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}
