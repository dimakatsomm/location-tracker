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
      required: false,
      trim: true,
    },
    region: {
      type: String,
      required: false,
      trim: true,
    },
    currency: {
      type: Schema.Types.Mixed,
      required: true,
      code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minLength: 2,
        maxLength: 3,

      },
      name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
      },
      symbol: {
        type: String,
        required: false,
        trim: true,
      }
    },
    language: {
      type: Object,
      required: true,
      code: {
        type: String,
        required: true,
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
      nativeName: {
        type: String,
        required: false,
        trim: true,
      }
    },
    flag: {
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
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Country = model<ICountry, Model<ICountry>>('Country', countrySchema, 'countries');
