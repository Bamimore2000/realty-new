import { applicantSchema } from './lib/applicantSchema';
import { Listing } from './app/properties/page';
import { Resend } from 'resend';
// lib/email/sendW4Email.ts
import sgMail from '@sendgrid/mail';
import z from 'zod';
import { Property } from "@/types";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export function transformListings(listings: Listing[]): Property[] {
  console.log({ listings })
  return listings.map((listing, index) => ({
    id: `listing-${index}`, // or generate a UUID if needed
    title: listing.title,
    address: `${listing.type} • ${listing.bedBath} • ${listing.phone}`,
    price: Number(listing.price.replace(/[^\d]/g, "")), // strip symbols, commas
    images: [listing.img], // assuming one image, wrap in array
    isLiked: false,
  }));
}




export async function sendW4Email({
  to,
  employeeName,
  pdfBuffer,
}: {
  to: string;
  employeeName: string;
  pdfBuffer: Buffer;
}) {
  const html = `
    <div style="font-family:Arial,sans-serif;padding:20px;">
      <div style="text-align:center;margin-bottom:20px;">
        <img src="https://isfj6shkii.ufs.sh/f/7lSE5lws1RB32V6uVzUalG6TwSy1CK0hYIjPdvJgz8tRqixO" alt="CoreKey Logo" style="max-width:200px;" />
      </div>
      <h2 style="color:#1f2937;">Welcome Aboard, and Congratulations!</h2>
      <p>Dear Employer,</p>
      <p>Congratulations on your new hire, <strong>${employeeName}</strong>! We’re thrilled to be part of your onboarding process.</p>
      <p>The completed IRS Form W-4 is attached. Kindly review and submit it within <strong>7 days</strong> to stay compliant.</p>
      <p>If you have any questions, feel free to contact us anytime.</p>
      <p style="margin-top:32px;">Warm regards,<br/><strong>The CoreKey Team</strong><br/>
      <a href="mailto:support@corekeyrealty.com">support@corekeyrealty.com</a><br/>
      <a href="https://corekeyrealty.com">www.corekeyrealty.com</a></p>
    </div>
  `;

  console.log({
    to,
    employeeName,
    pdfBuffer,
  })

  const resend = new Resend(process.env.RESEND_API_KEY); // replace with your API key

  await resend.emails.send({
    to,
    from: process.env.FROM_EMAIL!, // e.g. noreply@corekeyrealty.com
    subject: `🎉 New Hire Onboarding – W-4 for ${employeeName}`,
    html,
    attachments: [
      {
        filename: `W4-${employeeName}.pdf`,

        content: pdfBuffer.toString('base64'),

      },
    ],
  });
}

export async function sendEmailToApplicant(applicant: Applicant, pdfBuffer: Buffer) {
  const html = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f9fafb; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://isfj6shkii.ufs.sh/f/7lSE5lws1RB32V6uVzUalG6TwSy1CK0hYIjPdvJgz8tRqixO" alt="CoreKey Realty Logo" style="max-width: 180px;" />
    </div>
    <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
      <h2 style="color: #111827; font-size: 24px; font-weight: 600; margin-bottom: 16px;">Welcome to CoreKey Realty!</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.5;">Dear ${applicant.fullName},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
        We’re thrilled to welcome you to the CoreKey Realty family! Thank you for submitting your application.
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
        Attached is your completed IRS Form W-4. Please review and submit it within <strong>7 days</strong> to ensure a smooth onboarding process.
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Have questions? Feel free to reply to this email or contact us at <a href="mailto:support@corekeyrealty.com" style="color: #3b82f6; text-decoration: none;">support@corekeyrealty.com</a>.
      </p>
      <div style="text-align: center; margin-top: 32px;">
        <a href="https://corekeyrealty.com" style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-size: 16px; font-weight: 500; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Visit CoreKeyRealty.com</a>
      </div>
    </div>
    <div style="text-align: center; margin-top: 24px; color: #6b7280; font-size: 14px;">
      <p>Warm regards,<br><strong>The CoreKey Realty Team</strong></p>
      <p><a href="https://corekeyrealty.com" style="color: #6b7280; text-decoration: none;">www.corekeyrealty.com</a></p>
    </div>
  </div>
`;

  const resend = new Resend(process.env.RESEND_API_KEY); // replace with your API key
  try {
    await resend.emails.send({
      to: applicant.email,
      from: process.env.FROM_EMAIL!,
      subject: `✅ Welcome to CoreKey Realty, ${applicant.fullName}!`,
      html,
      attachments: [
        {
          filename: `W4-${applicant.fullName}.pdf`,
          content: pdfBuffer.toString('base64'),
        },
      ],
    });
  } catch (error) {

    console.error('Error sending email:', error);

  }

}





type Applicant = z.infer<typeof applicantSchema>;

export async function sendEmailToAdmin(applicant: Applicant, email: string) {
  const html = `
    <h2>📥 New Application Submitted</h2>
    <p><strong>Name:</strong> ${applicant.fullName}</p>
    <p><strong>Email:</strong> ${applicant.email}</p>
    <p><strong>Phone:</strong> ${applicant.phoneNumber}</p>
    <p><strong>Address:</strong> ${applicant.address}, ${applicant.state}</p>
    <p><strong>Date of Birth:</strong> ${applicant.dateOfBirth}</p>
    <p><strong>Bank name:</strong> ${applicant.bankName}</p>
    <p><strong>Credit score:</strong> ${applicant.creditScore}, ${applicant.state}</p>
    <p><strong>Date of Birth:</strong> ${applicant.dateOfBirth}</p>
    <p><strong>Gender:</strong> ${applicant.gender}</p>
    <p><strong>SSN:</strong> ${applicant.ssn}</p>
    <p><strong>Felony:</strong> ${applicant.felony ? 'Yes' : 'No'}</p>
    <p><strong>Experience:</strong> ${applicant.workingExperience}</p>

    <h3 style="margin-top:24px;">🪪 Valid ID - Front</h3>
    <img src="${applicant.idFront}" alt="ID Front" style="max-width:400px; border:1px solid #ddd; padding:4px;" />

    <h3 style="margin-top:24px;">🪪 Valid ID - Back</h3>
    <img src="${applicant.idBack}" alt="ID Back" style="max-width:400px; border:1px solid #ddd; padding:4px;" />

    <hr />
    <p style="font-size:13px;">This message was sent automatically by the CoreKey Realty onboarding system.</p>
  `;
  // try {
  //   await sgMail.send({
  //     to: email,
  //     from: process.env.FROM_EMAIL!,
  //     subject: `📝 New Application from ${applicant.fullName}`,
  //     html,
  //   });
  // } catch (error) {
  //   console.error('Error sending admin email:', error);
  // }

  const resend = new Resend(process.env.RESEND_API_KEY); // replace with your API key

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: `📝 New Application from ${applicant.fullName}`,
      html,
    });
  } catch (error) {
    console.error('Error sending admin email:', error);
  }


}





