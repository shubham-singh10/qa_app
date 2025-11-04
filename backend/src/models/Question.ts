import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  description?: string;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: [String], default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model<IQuestion>("Question", QuestionSchema);
