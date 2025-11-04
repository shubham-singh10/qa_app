import mongoose, { Schema, Document } from "mongoose";

export interface IAnswer extends Document {
  questionId: mongoose.Types.ObjectId;
  content: string;
  createdBy: mongoose.Types.ObjectId;
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  content: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model<IAnswer>("Answer", AnswerSchema);
