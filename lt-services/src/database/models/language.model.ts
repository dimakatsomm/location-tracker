import { Model, Schema, model } from 'mongoose';
import { ILanguage } from '../types/language.type';

const languageSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minLength: 2,
      maxLength: 3,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: false,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Language = model<ILanguage, Model<ILanguage>>('Language', languageSchema, 'languages');
