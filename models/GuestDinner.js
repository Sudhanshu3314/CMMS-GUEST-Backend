const mongoose = require("mongoose");

const guestDinnerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        date: { type: String, required: true }, // YYYY-MM-DD
        status: { type: String, enum: ["yes", "no"], required: true },
        count: { type: Number, default: 1 },
    },
    { timestamps: true }
);

// 🔥 Ensure one record per user per date
guestDinnerSchema.index({ email: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("GuestDinner", guestDinnerSchema);
