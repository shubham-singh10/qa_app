import mongoose, { Schema, Document } from "mongoose";

export interface IInsight extends Document {
  questionId: mongoose.Types.ObjectId;
  summary: string;
  createdBy: mongoose.Types.ObjectId;
}

const InsightSchema = new Schema<IInsight>({
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  summary: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model<IInsight>("Insight", InsightSchema);
