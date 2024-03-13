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
  {
    timestamps: true,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: function (doc, ret) {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

userSchema.pre(['save', 'findOneAndUpdate'], { document: true, query: false }, async function (next) {
  console.log(this.isModified('password'));

  try {
    const salt = await genSalt(C.SALT_WORK_FACTOR);
    const hashedPassword = await hash(this.password, salt);
    next();
  } catch (e) {
    next(e as CallbackError);
  }
});

export const User = model<IUser, Model<IUser>>('User', userSchema, 'users');
