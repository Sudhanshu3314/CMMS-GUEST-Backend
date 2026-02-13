// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./models/dBase");

const authRoutes = require("./routes/auth");
const lunchRoutes = require("./routes/lunch");
const dinnerRoutes = require("./routes/dinner");

const app = express();
const PORT = process.env.PORT || 8085;

/* =========================
   ✅ CORS – ALLOW ALL ORIGINS
========================= */
app.use(
    cors({
        origin: true, // ✅ allow ALL origins
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);


// ✅ IMPORTANT: handle preflight explicitly
// ✅ IMPORTANT: use regex, NOT "*"
app.options(/.*/, cors());

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(bodyParser.json());

/* =========================
   DEBUG
========================= */
app.use((req, res, next) => {
    console.log(
        `➡️ ${req.method} ${req.url} | Origin: ${req.headers.origin || "no-origin"}`
    );
    next();
});

/* =========================
   ROUTES
========================= */
app.use("/auth", authRoutes);
app.use("/lunch", lunchRoutes);
app.use("/dinner", dinnerRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Server is working!");
});

/* =========================
   SERVER
========================= */
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
