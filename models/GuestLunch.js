const mongoose = require("mongoose");

const guestLunchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    status: { type: String, enum: ["yes", "no"], required: true },
    count: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model("GuestLunch", guestLunchSchema);
