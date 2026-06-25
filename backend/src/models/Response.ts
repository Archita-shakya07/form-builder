import mongoose, { Document, Schema } from 'mongoose';

export interface IResponse extends Document {
  form: mongoose.Types.ObjectId;
  answers: Map<string, any>;
  submittedAt: Date;
}

const responseSchema = new Schema<IResponse>({
  form: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: { type: Map, of: Schema.Types.Mixed, required: true },
}, { timestamps: true });

export const Response = mongoose.model<IResponse>('Response', responseSchema);