const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    licenceFee: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    activationRate: {
      type: Number,
      required: true,
      min: 0,
    },
    manPowerRate: {
      type: Number,
      required: true,
      min: 0,
    },
    gstRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);