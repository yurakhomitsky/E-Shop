import { Document, Schema, model } from 'mongoose';

export interface User {
  name: string;
  email: string;
  password: string;
  street: string;
  apartment: string;
  city: string;
  zip: string;
  country: string;
  phone: number;
  isAdmin: boolean;
}

export interface UserDocument extends User, Document {}

const schema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  street: {
    type: String,
    default: ''
  },
  apartment: {
    type: String,
    default: ''
  },
  zip: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
});

schema.virtual('id').get(function (this: UserDocument) {
  return this._id.toHexString();
});

schema.set('toJSON', {
  virtuals: true
});

export const UserModel = model<UserDocument>('User', schema);
