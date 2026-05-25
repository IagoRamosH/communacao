const mongoose = require("mongoose");

// Registra a participacao de um usuario em um evento e se ele atuara como voluntario.
const participationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    kind: {
      type: String,
      enum: ["participant", "volunteer"],
      default: "participant",
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

participationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Participation", participationSchema);
