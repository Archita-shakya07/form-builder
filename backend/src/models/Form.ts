import mongoose, { Document, Schema } from 'mongoose';

export interface IField {
  id: string;
  type: 'text' | 'email' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'date' | 'textarea' | 'rating';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface IForm extends Document {
  title: string;
  description?: string;
  user: mongoose.Types.ObjectId;
  fields: IField[];
  isPublished: boolean;
  shareableLink: string;
  views: number;
  submissions: number;
}

const fieldSchema = new Schema<IField>({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'email', 'number', 'dropdown', 'checkbox', 'radio', 'date', 'textarea', 'rating'],
    required: true 
  },
  label: { type: String, required: true },
  placeholder: String,
  required: { type: Boolean, default: false },
  options: [String]
});

const formSchema = new Schema<IForm>({
  title: { type: String, required: true },
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fields: [fieldSchema],
  isPublished: { type: Boolean, default: false },
  shareableLink: { type: String, unique: true, sparse: true },
  views: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 }
}, { timestamps: true });

export const Form = mongoose.model<IForm>('Form', formSchema);
