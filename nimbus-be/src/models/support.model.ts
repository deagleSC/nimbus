import mongoose, { Schema, Document } from "mongoose";
import {
  SupportRequestStatus,
  SUPPORT_REQUEST_LIMITS,
} from "../enums/support.enums";

export interface ISupportRequest extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  status: SupportRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const supportRequestSchema = new Schema<ISupportRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: SUPPORT_REQUEST_LIMITS.SUBJECT_MIN,
      maxlength: SUPPORT_REQUEST_LIMITS.SUBJECT_MAX,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: SUPPORT_REQUEST_LIMITS.MESSAGE_MIN,
      maxlength: SUPPORT_REQUEST_LIMITS.MESSAGE_MAX,
    },
    status: {
      type: String,
      enum: Object.values(SupportRequestStatus),
      default: SupportRequestStatus.PENDING,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const SupportRequest = mongoose.model<ISupportRequest>(
  "SupportRequest",
  supportRequestSchema
);
