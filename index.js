// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/dBase"); // MongoDB connection

const authRoutes = require("./routes/auth");
const lunchRoutes = require("./routes/lunch");
const dinnerRoutes = require("./routes/dinner");

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for frontend
app.use(
    cors({
        origin: true, // reflect request origin
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// REQUIRED for preflight
app.options("*", cors());

app.use(express.json());

// Debug logs for requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body || "no body");
    next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/lunch", lunchRoutes);
app.use("/dinner", dinnerRoutes);

app.get("/", (req, res) => res.send("Server is working!"));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
