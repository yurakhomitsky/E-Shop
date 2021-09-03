import { Document, Schema, model, Types, ObjectId } from 'mongoose';

export interface Product {
  name: string;
  description: string;
  richDescription: string;
  image: string;
  images: string[];
  brand: string;
  price: number;
  category: ObjectId,
  countInStock: number;
  rating: number;
  numOfReviews: number;
  isFeatured: boolean;
  dateCreated: Date;
}

export interface ProductDocument extends Product, Document {}

const schema = new Schema<ProductDocument>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  richDescription: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  brand: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 999
  },
  rating: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

export const ProductModel = model<ProductDocument>('Product', schema);
