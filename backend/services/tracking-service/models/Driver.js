import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      unique: true,
      trim: true,
      default: function () {
        return "DRV-" + Date.now();
      },
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      default: null,
    },

    licenseNo: {
      type: String,
      trim: true,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
