import { randomUUID } from "crypto";
import { Schema, model } from "mongoose";
import { IUser } from "database/types/user.type";
import { genSalt, hash } from "bcrypt";
import * as C from "../../constants";

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
        required: true,
        unique: true,
        
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
      const salt = await genSalt(C.SALT_WORK_FACTOR);
      user.password = await hash(user.password, salt);
      next();
    } catch(e: any) {
        next(e);
    }
})

export const User = model<IUser, any>('User', userSchema, 'users');