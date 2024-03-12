import { randomUUID } from 'crypto';
import { Schema, model } from 'mongoose';
import { ILocation } from 'database/types/location.type';

const locationSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      required: true,
      unique: true,
      default: randomUUID,
    },
    userId: {
      type: Schema.Types.UUID,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minLength: 2,
      maxLength: 3,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

locationSchema.index({ latitude: 1, longitude: 1 }, { unique: false });

export const Location = model<ILocation, any>('Location', locationSchema, 'locations');
