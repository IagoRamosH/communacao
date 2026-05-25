const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Guarda dados de acesso, perfil e informacoes de aprovacao da organizacao.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "organization", "organizer", "admin"],
      default: "user",
    },
    organizationName: {
      type: String,
      default: null,
      trim: true,
    },
    organizationStatus: {
      type: String,
      enum: ["none", "eligible", "pending", "approved", "rejected"],
      default: "none",
    },
    organizationApprovedAt: {
      type: Date,
      default: null,
    },
    organizationApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    affiliates: [affiliateSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
