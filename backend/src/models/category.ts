import { Document, model, Schema } from 'mongoose';


export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface CategoryDocument extends Category, Document {}

const schema = new Schema<CategoryDocument>({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  color: {
    type: String
  }
});

export const CategoryModel = model<CategoryDocument>('Category', schema);
