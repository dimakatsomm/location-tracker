import { Model, Schema, model } from 'mongoose';
import { ICurrency } from '../types/currency.type';

const currencySchema = new Schema(
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
    symbol: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
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

export const Currency = model<ICurrency, Model<ICurrency>>('Currency', currencySchema, 'currencies');
