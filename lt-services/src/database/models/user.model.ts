import { randomUUID } from "crypto";
import { Schema, model } from "mongoose";
import { IUser } from "database/types/user.type";

const userSchema = new Schema({
    _id: {
        type: Schema.Types.UUID,
        required: true,
        unique: true,
        default: randomUUID
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const User = model<IUser, any>('User', userSchema, 'users');