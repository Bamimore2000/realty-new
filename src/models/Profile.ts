// models/Profile.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    avatar?: string; // profile picture URL
    role: "worker" | "admin";
    employerCardIssued: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        address: { type: String },
        avatar: { type: String },
        role: { type: String, enum: ["worker", "admin"], default: "worker" },
        employerCardIssued: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
