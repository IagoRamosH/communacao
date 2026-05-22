const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔹 TIPOS DE CONTA
    role: {
      type: String,
      enum: ["user", "organizer", "admin"],
      default: "user",
    },

    // 🔹 SE É UMA ORGANIZAÇÃO
    isOrganization: {
      type: Boolean,
      default: false,
    },

    // 🔹 STATUS DA ORGANIZAÇÃO
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "approved",
    },

    // 🔹 NOME DA ORGANIZAÇÃO
    organizationName: {
      type: String,
      default: null,
    },

    // 🔹 MEMBROS DA ORGANIZAÇÃO
    members: [memberSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);