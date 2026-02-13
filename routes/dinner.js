const express = require("express");
const router = express.Router();
const GuestDinner = require("../models/GuestDinner");
const { authMiddleware } = require("../Middlewares/auth");

const istTime = () =>
    new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false
    });

/**
 * ============================
 * GET: Logged-in user's dinner attendance
 * ============================
 */
router.get("/", authMiddleware, async (req, res) => {
    const { date } = req.query;

    console.log(`[${istTime()}] ➡️ GET /dinner`);
    console.log(`[${istTime()}] 👤 User:`, req.user?.email);
    console.log(`[${istTime()}] 📅 Query date:`, date);

    if (!date) {
        console.warn(`[${istTime()}] ⚠️ Date missing in query`);
        return res.status(400).json({ success: false, message: "Date is required" });
    }

    try {
        console.log(`[${istTime()}] 🔍 Searching dinner attendance in DB`);

        const attendance = await GuestDinner.findOne({
            email: req.user.email,
            date,
        }).lean();

        console.log(
            `[${istTime()}] ✅ Dinner attendance result:`,
            attendance ? "FOUND" : "NOT FOUND"
        );

        res.json(attendance ?? null);
    } catch (err) {
        console.error(`[${istTime()}] ❌ GET /dinner error:`, err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * ============================
 * POST: Submit / Update dinner attendance
 * ============================
 */
router.post("/", authMiddleware, async (req, res) => {
    const { status, date, count } = req.body;

    console.log(`[${istTime()}] ➡️ POST /dinner`);
    console.log(`[${istTime()}] 👤 User:`, req.user?.email);
    console.log(`[${istTime()}] 📥 Request body:`, req.body);

    if (!date || !status) {
        console.warn(`[${istTime()}] ⚠️ Missing required fields`, { date, status });
        return res.status(400).json({
            success: false,
            message: "Date and status are required",
        });
    }

    try {
        console.log(`[${istTime()}] ♻️ Upserting dinner attendance`);

        const attendance = await GuestDinner.findOneAndUpdate(
            { email: req.user.email, date },
            {
                $set: {
                    name: req.user.name,
                    status,
                    count: status === "yes" ? Number(count || 1) : 0,
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        console.log(`[${istTime()}] ✅ Dinner attendance saved`);

        res.json({
            success: true,
            message: "Dinner attendance saved",
            attendance,
        });
    } catch (err) {
        console.error(`[${istTime()}] ❌ POST /dinner error:`, err);

        if (err.code === 11000) {
            console.warn(`[${istTime()}] ⚠️ Duplicate attendance detected`);
            return res.status(409).json({
                success: false,
                message: "Attendance already exists for this date",
            });
        }

        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * ============================
 * ADMIN: Dinner report (all users)
 * ============================
 */
router.get("/report", async (req, res) => {
    const { date } = req.query;
    const filter = date ? { date } : {};

    console.log(`[${istTime()}] ➡️ GET /dinner/report`);
    console.log(`[${istTime()}] 📅 Report filter date:`, date || "ALL");

    try {
        console.log(`[${istTime()}] 📊 Fetching dinner report from DB`);

        const report = await GuestDinner.find(filter)
            .sort({ date: -1 })
            .lean();

        console.log(
            `[${istTime()}] ✅ Dinner report fetched, count:`,
            report.length
        );

        res.json(report);
    } catch (err) {
        console.error(`[${istTime()}] ❌ GET /dinner/report error:`, err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
