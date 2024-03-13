import { randomUUID } from 'crypto';
import { Model, Schema, model } from 'mongoose';
import { ILocation } from '../types/location.type';

const locationSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      required: true,
      default: randomUUID,
    },
    _userId: {
      type: Schema.Types.UUID,
      required: true,
      ref: 'User',
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
  {
    timestamps: true,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: function (doc, ret) {
        ret.id = doc._id;
        ret.userId = doc._userId;
        delete ret._id;
        delete ret._userId;
        delete ret.__v;
      },
    },
  },
);

locationSchema.index({ latitude: 1, longitude: 1 }, { unique: false });

export const Location = model<ILocation, Model<ILocation>>('Location', locationSchema, 'locations');
