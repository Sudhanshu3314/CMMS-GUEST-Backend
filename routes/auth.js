// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const sendOtpEmail = require("../Utils/sendEmail");

const router = express.Router();

// SEND OTP
router.post("/send-otp", async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) return res.status(400).json({ success: false, message: "Missing fields" });
        if (!email.endsWith("@igidr.ac.in")) return res.status(400).json({ success: false, message: "Use IGIDR email" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        await Otp.deleteMany({ email }); // remove old OTPs

        await Otp.create({
            email,
            name,
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendOtpEmail(email, otp);

        res.json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// VERIFY OTP
// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = await Otp.findOne({ email });
        if (!record) {
            return res.status(400).json({ success: false, message: "OTP expired or invalid" });
        }

        if (record.expiresAt < new Date()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        const isMatch = await bcrypt.compare(otp, record.otp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // ✅ name ALWAYS comes from DB
        const name = record.name;

        await Otp.deleteOne({ email });

        const token = jwt.sign(
            { email, name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            token,
            user: { email, name }
        });

    } catch (err) {
        console.error("VERIFY OTP error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
