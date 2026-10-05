// backend/models/Portfolio.js
const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    exchange: {
      type: String,
      default: "NSE",
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    averagePrice: {
      type: Number,
      required: true,
      min: [0, "Average price cannot be negative"],
    },
    totalInvested: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

portfolioSchema.index({ user: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model("Portfolio", portfolioSchema);
