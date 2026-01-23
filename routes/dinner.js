const express = require("express");
const router = express.Router();
const GuestDinner = require("../models/GuestDinner");
const { authMiddleware } = require("../Middlewares/auth");

/**
 * ============================
 * GET: Logged-in user's dinner attendance
 * ============================
 */
router.get("/", authMiddleware, async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ success: false, message: "Date is required" });
    }

    try {
        const attendance = await GuestDinner.findOne({
            email: req.user.email,
            date,
        }).lean();

        res.json(attendance ?? null); // return null if no record
    } catch (err) {
        console.error("GET /dinner error:", err);
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

    if (!date || !status) {
        return res.status(400).json({
            success: false,
            message: "Date and status are required",
        });
    }

    try {
        const attendance = await GuestDinner.findOneAndUpdate(
            { email: req.user.email, date }, // date included
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

        res.json({
            success: true,
            message: "Dinner attendance saved",
            attendance,
        });
    } catch (err) {
        console.error("POST /dinner error:", err);

        if (err.code === 11000) {
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
router.get("/report", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access only",
        });
    }

    const { date } = req.query;
    const filter = date ? { date } : {};

    try {
        const report = await GuestDinner.find(filter)
            .sort({ date: -1 })
            .lean();

        res.json(report);
    } catch (err) {
        console.error("GET /dinner/report error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
