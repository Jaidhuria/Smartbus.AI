import mongoose from "mongoose";

const liveLocationSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
      index: true,
    },

    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },

    speed: {
      type: Number,
      default: 0,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

liveLocationSchema.index({ busId: 1, timestamp: -1 });


export default mongoose.model("LiveLocation", liveLocationSchema);
