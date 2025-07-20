import { z } from "zod";
const phoneRegex =
    /^(\+?\d{1,4}[-.\s]?)?(\(?\d{3,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}$/;

const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;

export const applicantSchema = z.object({
    fullName: z.string().min(1, "Full Name is required"),

    email: z.string().email("Invalid email address"),

    state: z.string().min(1, "State is required"),

    phoneNumber: z
        .string()
        .optional()
        .refine((val) => !val || phoneRegex.test(val), {
            message: "Invalid phone number format",
        }),

    address: z.string().optional(),

    dateOfBirth: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                const date = new Date(val);
                return !isNaN(date.getTime()) && date < new Date();
            },
            { message: "Date of birth must be in the past" }
        ),

    workingExperience: z
        .string()
        .min(10, "Please describe your experience")
        .optional(),

    gender: z.enum(["Male", "Female", "Other"]),

    ssn: z
        .string()
        .optional()
        .refine((val) => !val || ssnRegex.test(val), {
            message: "SSN must be in the format XXX-XX-XXXX",
        }),

    felony: z.string().optional(),

    idFront: z.string().optional(),

    idBack: z.string().optional(),
    // SsnImage: z.string().optional(),
    // Mother: z.string().optional(),

    bankName: z.string().min(1, "Bank name is required").optional(),

    creditScore: z
        .number()
        .min(300, "Credit score must be at least 300")
        .max(850, "Credit score must not exceed 850")
        .optional(),
});
