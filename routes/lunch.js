const express = require("express");
const router = express.Router();
const GuestLunch = require("../models/GuestLunch");
const { authMiddleware } = require("../Middlewares/auth");

const istTime = () =>
    new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false
    });

// GET attendance for logged-in user
router.get("/", authMiddleware, async (req, res) => {
    const { date } = req.query;

    console.log(`[${istTime()}] ➡️ GET /lunch`);
    console.log(`[${istTime()}] 👤 User:`, req.user?.email);
    console.log(`[${istTime()}] 📅 Query date:`, date);

    try {
        console.log(`[${istTime()}] 🔍 Searching attendance in DB`);
        const attendance = await GuestLunch.findOne({ email: req.user.email, date });

        console.log(
            `[${istTime()}] ✅ Lunch Attendance result:`,
            attendance ? "FOUND" : "NOT FOUND"
        );

        res.json(attendance || {});
    } catch (err) {
        console.error(`[${istTime()}] ❌ GET /lunch error:`, err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST submit/update attendance
router.post("/", authMiddleware, async (req, res) => {
    const { status, date, count } = req.body;

    console.log(`[${istTime()}] ➡️ POST /lunch`);
    console.log(`[${istTime()}] 👤 User:`, req.user?.email);
    console.log(`[${istTime()}] 📥 Request body:`, req.body);

    if (!date || !status) {
        console.warn(`[${istTime()}] ⚠️ Missing fields`, { date, status });
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try {
        console.log(`[${istTime()}] 🔍 Checking existing attendance`);
        const existing = await GuestLunch.findOne({ email: req.user.email, date });

        if (existing) {
            console.log(`[${istTime()}] ♻️ Existing record found, updating`);

            existing.status = status;
            existing.count = status === "yes" ? count : 0;

            await existing.save();
            console.log(`[${istTime()}] ✅ Attendance updated`);

            return res.json({ success: true, message: "Attendance updated" });
        }

        console.log(`[${istTime()}] 🆕 Creating new attendance entry`);
        const newAttendance = new GuestLunch({
            email: req.user.email,
            name: req.user.name,
            date,
            status,
            count: status === "yes" ? count : 0,
        });

        await newAttendance.save();
        console.log(`[${istTime()}] ✅ Attendance submitted`);

        res.json({ success: true, message: "Attendance submitted" });

    } catch (err) {
        console.error(`[${istTime()}] ❌ POST /lunch error:`, err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Public: get all lunch reports
router.get("/report", async (req, res) => {
    const { date } = req.query;
    const query = date ? { date } : {};

    console.log(`[${istTime()}] ➡️ GET /lunch/report`);
    console.log(`[${istTime()}] 📅 Query date:`, date || "ALL");

    try {
        console.log(`[${istTime()}] 📊 Fetching report from DB`);
        const report = await GuestLunch.find(query)
            .sort({ date: -1 })
            .lean();

        console.log(`[${istTime()}] ✅ Report fetched, count:`, report.length);

        res.json(report);
    } catch (err) {
        console.error(`[${istTime()}] ❌ GET /lunch/report error:`, err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
