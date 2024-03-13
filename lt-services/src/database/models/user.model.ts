import { randomUUID } from 'crypto';
import { CallbackError, Model, Schema, model } from 'mongoose';
import { isEmail } from 'validator';
import { genSalt, hash } from 'bcrypt';
import * as C from '../../constants';
import { IUser } from '../types/user.type';

const userSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      required: true,
      default: randomUUID,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    emailAddress: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate: [isEmail],
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
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await genSalt(C.SALT_WORK_FACTOR);
    this.password = await hash(this.password, salt);
    next();
  } catch (e) {
    next(e as CallbackError);
  }
});

export const User = model<IUser, Model<IUser>>('User', userSchema, 'users');
