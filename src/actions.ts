'use server';

import User from '@/models/User';
import { nanoid } from 'nanoid';
import { connectToDatabase } from '@/lib/mongoose';
import { z } from 'zod';
import { IToken, Token } from './models/Token';
import { revalidatePath } from 'next/cache';

// ✅ Declare formSchema
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
});

// ✅ Infer type from formSchema


// ✅ Use formSchema for validation at runtime
export async function createUserAction(rawData: unknown) {
    // Validate input
    const data = formSchema.parse(rawData);

    await connectToDatabase();

    const existing = await User.findOne({ email: data.email });
    if (existing) {
        return { error: "User already exists", referralLink: existing.referralLink };
    }

    const key = Math.floor(1000 + Math.random() * 9000).toString();
    const referralLink = `https://corekeyrealty.com/register?ref=${key}`;

    const user = await User.create({ name: data.name, email: data.email, key, referralLink });
    console.log("User created:", user);

    return { success: true, referralLink };
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



export async function submitApplication(formData: unknown) {
    try {
        await connectToDatabase();

        // Validate input (optional but strongly recommended)
        const parsed = applicantSchema.parse(formData);

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

            // Defaults for extended fields
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

        return { success: true, id: saved._id };
    } catch (error: unknown) {
        console.error("Validation or database error:", error);
        console.error("Application submission failed:", error);
        return {
            success: false,
            message:
                "Internal Server Error",
        };
    }
}
