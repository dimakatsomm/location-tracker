import { Model, Schema, model } from 'mongoose';
import { ICountry } from '../types/country.type';

const countrySchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minLength: 2,
      maxLength: 2,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    capital: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    currencyCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minLength: 2,
      maxLength: 3,
    },
    languageCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minLength: 2,
      maxLength: 3,
    },
    flag: {
      type: String,
      required: true,
      trim: true,
    },
    diallingCode: {
      type: String,
      required: false,
      trim: true,
    },
    isoCode: {
      type: String,
      required: false,
      uppercase: true,
      trim: true,
      minLength: 2,
      maxLength: 3,
    },
  },
  {
    timestamps: false,
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

export const Country = model<ICountry, Model<ICountry>>('Country', countrySchema, 'countries');
