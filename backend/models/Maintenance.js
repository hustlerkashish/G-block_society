// backend/models/Maintenance.js
const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // e.g. "August 2025"
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  dueDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
