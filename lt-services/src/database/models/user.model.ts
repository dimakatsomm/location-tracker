import { randomUUID } from "crypto";
import { Schema, model } from "mongoose";
import { IUser } from "database/types/user.type";
import { genSalt, hash } from "bcrypt";
import * as C from "../../constants";
import { isEmail } from "validator";

const userSchema = new Schema({
    _id: {
        type: Schema.Types.UUID,
        required: true,
        unique: true,
        default: randomUUID
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    emailAddress: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate: [ isEmail ],
        
    },
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
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