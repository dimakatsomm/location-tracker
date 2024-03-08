import { Schema, model } from "mongoose";
import { ICurrency } from "database/types/currency.type";

const currencySchema = new Schema({
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
    symbol: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 3
    }
}, { timestamps: false });

export const Currency = model<ICurrency, any>('Currencies', currencySchema);