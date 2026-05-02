import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    routeId: {
      type: String,
      required: true,
      trim: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    
    activeTripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TripLog",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bus", busSchema);
