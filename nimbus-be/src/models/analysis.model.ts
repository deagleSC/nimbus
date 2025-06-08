import mongoose, { Document, Schema } from "mongoose";

interface IAnalysis extends Document {
  gameId: string;
  id: string;
  userId: string;
  provider: string;
  modelName: string;
  object: string;
  created: number;
  choices: Array<{
    logprobs: null;
    finishReason: string;
    nativeFinishReason: string;
    index: number;
    message: {
      role: string;
      content: any;
      refusal: null;
      reasoning: string;
    };
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema = new Schema(
  {
    gameId: { type: String, required: false },
    id: { type: String, required: true },
    userId: { type: String, required: true },
    provider: { type: String, required: true },
    modelName: { type: String, required: true },
    object: { type: String, required: true },
    created: { type: Number, required: true },
    choices: [
      {
        logprobs: { type: Schema.Types.Mixed, default: null },
        finishReason: { type: String, required: true },
        nativeFinishReason: { type: String, required: true },
        index: { type: Number, required: true },
        message: {
          role: { type: String, required: true },
          content: { type: Schema.Types.Mixed, required: true },
          refusal: { type: Schema.Types.Mixed, default: null },
          reasoning: { type: String, required: true },
        },
      },
    ],
    usage: {
      promptTokens: { type: Number, required: true },
      completionTokens: { type: Number, required: true },
      totalTokens: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAnalysis>("Analysis", AnalysisSchema);
