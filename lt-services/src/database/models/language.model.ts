import { Schema, model } from "mongoose";
import { ILanguage } from "database/types/language.type";

const languageSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        minLength: 2,
        maxLength: 3
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: false });

export const Language = model<ILanguage, any>('Languages', languageSchema);