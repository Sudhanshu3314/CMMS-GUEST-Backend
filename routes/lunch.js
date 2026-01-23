const express = require("express");
const router = express.Router();
const GuestLunch = require("../models/GuestLunch");
const { authMiddleware } = require("../Middlewares/auth");

// GET attendance for logged-in user
router.get("/", authMiddleware, async (req, res) => {
    const { date } = req.query;
    try {
        const attendance = await GuestLunch.findOne({ email: req.user.email, date });
        res.json(attendance || {});
    } catch (err) {
        console.error("GET /lunch error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST submit/update attendance
router.post("/", authMiddleware, async (req, res) => {
    const { status, date, count } = req.body;

    if (!date || !status) return res.status(400).json({ success: false, message: "Missing fields" });

    try {
        const existing = await GuestLunch.findOne({ email: req.user.email, date });

        if (existing) {
            existing.status = status;
            existing.count = status === "yes" ? count : 0;
            await existing.save();
            return res.json({ success: true, message: "Attendance updated" });
        }

        const newAttendance = new GuestLunch({
            email: req.user.email,
            name: req.user.name , // fallback
            date,
            status,
            count: status === "yes" ? count : 0,
        });

        await newAttendance.save();
        res.json({ success: true, message: "Attendance submitted" });

    } catch (err) {
        console.error("POST /lunch error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Admin: get all lunch reports
router.get("/report", authMiddleware, async (req, res) => {
    const { admin, date } = req.query;
    if (admin !== "true") return res.status(403).json({ success: false, message: "Unauthorized" });

    const query = date ? { date } : {};
    try {
        const report = await GuestLunch.find(query).sort({ date: -1 }).lean();
        res.json(report);
    } catch (err) {
        console.error("GET /lunch/report error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
