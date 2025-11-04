import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    problemTitle: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // the participant other than the host
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    // Stream video call ID
    callId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
