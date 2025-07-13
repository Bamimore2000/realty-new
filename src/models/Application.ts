import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    fullName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    state?: string;
    dateOfBirth?: Date;
    gender?: "Male" | "Female" | "Other";
    workingExperience?: string;
    ssn?: string;
    felony?: string;
    validIDFront?: string;
    validIDBack?: string;

    employmentStatus?: string;
    desiredStartDate?: Date;
    hasDriversLicense?: boolean;
    isCitizen?: boolean;
    canWorkLegally?: boolean;
    references?: { name: string; email: string }[];
    educationLevel?: string;
    skills?: string[];
    notes?: string;

    emergencyContactName?: string;
    emergencyContactPhone?: string;
    relationship?: string;

    createdAt: Date;
}

const ApplicationSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },

        phoneNumber: String,
        address: String,
        state: String,
        dateOfBirth: Date,
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        workingExperience: String,
        ssn: String,
        felony: String,
        validIDFront: String,
        validIDBack: String,

        employmentStatus: String,
        desiredStartDate: Date,
        hasDriversLicense: Boolean,
        isCitizen: Boolean,
        canWorkLegally: Boolean,
        references: [
            {
                name: String,
                email: String,
            },
        ],
        educationLevel: String,
        skills: [String],
        notes: String,

        emergencyContactName: String,
        emergencyContactPhone: String,
        relationship: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Applicatione ||
    mongoose.model<IApplication>("Applicatione", ApplicationSchema);
