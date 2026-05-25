const mongoose = require("mongoose");

// Representa um evento social criado por usuario, organizacao ou admin.
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    organizer: {
      type: String,
      default: "",
      trim: true,
    },
    goal: {
      type: String,
      default: "",
      trim: true,
    },
    goalType: {
      type: String,
      default: "",
      trim: true,
    },
    goalTotal: {
      type: Number,
      default: 0,
    },
    goalCurrent: {
      type: Number,
      default: 0,
    },
    goalUnit: {
      type: String,
      default: "",
      trim: true,
    },
    volunteers: {
      type: Number,
      default: 0,
    },
    volunteerProfile: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
