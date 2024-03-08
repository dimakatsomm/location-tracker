import { Schema, model } from "mongoose";
import { ICountry } from "database/types/country.type";

const countrySchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        minLength: 2,
        maxLength: 2
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    capital: {
        type: String,
        required: true,
        trim: true
    },
    region: {
        type: String,
        required: true,
        trim: true
    },
    currencyCode: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minLength: 2,
        maxLength: 3
    },
    languageCode: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minLength: 2,
        maxLength: 3
    },
    flag: {
        type: String,
        required: true,
        trim: true
    },
    diallingCode: {
        type: String,
        required: false,
        trim: true
    },
    isoCode: {
        type: String,
        required: false,
        uppercase: true,
        trim: true,
        minLength: 2,
        maxLength: 3
    },
}, { timestamps: false });

export const Country = model<ICountry, any>('Countries', countrySchema);