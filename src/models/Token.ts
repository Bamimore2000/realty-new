// models/token.ts
import { Schema, models, model } from "mongoose";

const tokenSchema = new Schema(
    {
        value: { type: String, required: true, unique: true },
        used: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Token = models.Tokenr || model("Tokenr", tokenSchema);

export interface IToken {
    _id: { toString(): string };
    value: string;
    used: boolean;
    createdAt: Date;
}

