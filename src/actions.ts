'use server';
import sgMail from '@sendgrid/mail';


import User from '@/models/User';
import { nanoid } from 'nanoid';
import { connectToDatabase } from '@/lib/mongoose';
import { z } from 'zod';
import { IToken, Token } from './models/Token';
import { revalidatePath } from 'next/cache';
import { sendEmailToApplicant } from './utils';

// ✅ Declare formSchema
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
});

// ✅ Infer type from formSchema




export async function createUserAction(rawData: unknown) {
    // Validate input
    const data = formSchema.parse(rawData);

    await connectToDatabase();

    const existing = await User.findOne({ email: data.email });

    if (existing) {
        return {
            success: true,
            message: "User already exists",
            referralLink: existing.referralLink,
            error: null
        };
    }

    const key = Math.floor(1000 + Math.random() * 9000).toString();
    const referralLink = `https://corekeyrealty.com/register?ref=${key}`;

    const user = await User.create({ name: data.name, email: data.email, key, referralLink });
    console.log("User created:", user);

    return {
        success: true,
        message: "User created successfully",
        referralLink,
        error: null
    };
}


const US_STATES = new Set([
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
]);

function isUSState(region?: string) {
    return region !== undefined && US_STATES.has(region);
}

export async function getRegionFromIp(ip: string): Promise<string> {
    try {
        const res = await fetch(`https://ipinfo.io/${ip}/json?token=79b5916c8371af`);

        if (!res.ok) throw new Error('Failed to fetch geo info');
        console.log("haaaaaaaaaaa", res, ip)
        const data = await res.json();
        console.log("data", data);
        const region = data.region;

        return isUSState(region) ? region : 'Texas';
    } catch {
        return 'Texas';
    }
}


export async function createToken() {
    await connectToDatabase();

    const token = nanoid(10); // generates a unique 10-character string
    const exists = await Token.findOne({ value: token });

    if (exists) return createToken(); // try again if not unique

    const newToken = await Token.create({ value: token });
    revalidatePath('/admin/tokens');

    return newToken;
}



export async function getAllTokens() {
    await connectToDatabase();

    // Use lean<IToken>() so TS knows the shape of returned docs
    const tokens = await Token.find().sort({ createdAt: -1 }).lean<IToken[]>();

    return tokens.map((t) => ({
        id: t._id.toString(), // _id now typed, no error
        value: t.value,
        used: t.used,
        createdAt: t.createdAt,
    }));
}

import { uploadToCloudinary } from "@/lib/cloudinary";
import Application from './models/Application';
import { applicantSchema } from './lib/applicantSchema';

export async function uploadImage(fileBase64: string) {
    if (!fileBase64) throw new Error("No file provided");
    const url = await uploadToCloudinary(fileBase64, "corekey/applicants");
    return url;
}


export async function verifyTokenAndDelete(tokenValue: string) {
    await connectToDatabase();

    try {
        const token = await Token.findOne({ value: tokenValue });

        if (!token || token.used) {
            return { success: false, message: "Invalid or expired token" };
        }

        token.used = true;
        await token.save(); // mark as used

        return { success: true, ref: token.value }; // or you can store a `ref` field
    } catch (err) {
        console.error("Token verification error:", err);
        return { success: false, message: "Server error" };
    }
}



export async function submitApplication(formData: unknown, ref: string) {
    try {
        await connectToDatabase();
        const email = await findUserByKey(ref);
        console.log("email", email.email);
        // return { success: false, message: "Invalid referral key" };

        const parsed = applicantSchema.parse(formData);

        console.log("Parsed application data:", parsed);
        // return { success: false, message: "Application data is invalid" };

        const saved = await Application.create({
            fullName: parsed.fullName,
            email: parsed.email,
            phoneNumber: parsed.phoneNumber,
            address: parsed.address,
            state: parsed.state,
            dateOfBirth: parsed.dateOfBirth,
            gender: parsed.gender,
            workingExperience: parsed.workingExperience,
            ssn: parsed.ssn,
            felony: parsed.felony,
            validIDFront: parsed.idFront,
            validIDBack: parsed.idBack,

            // Expanded default fields
            employmentStatus: "",
            desiredStartDate: undefined,
            hasDriversLicense: false,
            isCitizen: false,
            canWorkLegally: false,
            references: [],
            educationLevel: "",
            skills: [],
            notes: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
            relationship: "",
        });

        console.log("Application saved:", saved);

        // 1. Generate filled W-4
        const base64 = await fillW4EmployerFields({
            startDate: '2025-07-13',
            ein: '3425647577',
            companyAddress: `Core Key Realty\n7155 Old Katy Rd Ste N210, Houston,\nTX 77024`,
        });
        const pdfBuffer = Buffer.from(base64, 'base64');

        // 2. Send summary to admin
        await sendEmailToAdmin(parsed, email.email);
        // 3. Send welcome + W-4 PDF to applicant
        await sendEmailToApplicant(parsed, pdfBuffer);

        return { success: true, id: saved._id };
    } catch (err) {
        console.error("Application submission failed:", err);
        return { success: false, message: 'Internal Server Error' };
    }
}


// app/actions/fillW4EmployerFields.ts

import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { sendEmailToAdmin } from './utils';




/**
 * Fills employer fields in a W-4 PDF and returns the base64-encoded PDF.
 */
export async function fillW4EmployerFields({
    startDate,
    ein,
    companyAddress,
}: {
    startDate: string;
    ein: string;
    companyAddress: string;
}) {
    const inputPdfPath = path.join(process.cwd(), 'public', 'fw4.pdf');
    const pdfBytes = await fs.readFile(inputPdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // ✅ Set employer fields correctly
    form.getTextField('topmostSubform[0].Page1[0].f1_14[0]').setText(startDate);        // First Date of Employment
    form.getTextField('topmostSubform[0].Page1[0].f1_15[0]').setText(ein);              // EIN
    form.getTextField('topmostSubform[0].Page1[0].f1_13[0]').setText(companyAddress);   // Employer Name & Address

    const modifiedPdf = await pdfDoc.save();
    return Buffer.from(modifiedPdf).toString('base64'); // return as base64 for emailing or preview
}



export async function findUserByKey(key: string) {

    if (!/^\d{4}$/.test(key)) {
        return { success: false, message: 'Invalid key format' };
    }

    const user = await User.findOne({ key });

    if (!user) {
        return { success: false, message: 'No user found with this key' };
    }

    return {
        success: true,
        email: user.email,
        name: user.name,
        referralLink: user.referralLink,
    };
}


export async function sendBulkEmails({
    recipients,
    phoneNumber,
}: {
    recipients: string[];
    phoneNumber: string;
}) {
    if (!Array.isArray(recipients) || recipients.length === 0) {
        return { success: false, message: "No valid recipients provided." };
    }

    if (!phoneNumber) {
        return { success: false, message: "Phone number is required." };
    }

    const fromEmail = process.env.CAREER_EMAIL || "careers@corekeyrealty.com";

    const messages = recipients.map((email) => ({
        to: email,
        from: fromEmail,
        trackingSettings: {
            clickTracking: {
                enable: false,
                enableText: false,
            },
        },
        subject: "Virtual Assistant Role at Core Key Realty",
        text: `
Greetings,

We found your profile on JobGet and would like to offer you a Virtual Assistant position at Core Key Realty.

This is a remote role involving email management, scheduling, and client support.

Visit https://corekeyrealty.com to learn more.

If you're interested and ready to begin, please send us a text message to request the registration address and access token:

📱 Text: ${phoneNumber}

Thank you for your time.

Best regards,  
Core Key Realty Careers Team
    `.trim(),
    }));

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    try {
        await Promise.all(messages.map((msg) => sgMail.send(msg)));
        return { success: true };
    } catch (error: unknown) {

        console.error("Error sending bulk emails:", error);
        return {
            success: false,
            message: "Failed to send some or all emails.",
        };
    }
}




