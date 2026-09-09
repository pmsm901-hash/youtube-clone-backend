import mongoose from "mongoose";

const channelSchema = mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim:true,
    },
    channelBanner: {
      type: String,
      default: "",
      trim:true,
    },
    channelAvatar: { type: String, default: "", trim: true, },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  },
);
const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
