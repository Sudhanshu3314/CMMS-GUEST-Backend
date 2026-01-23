// models/db.js
const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_CONN;
if (!mongo_url) {
    console.error("MONGO_CONN not set in .env");
    process.exit(1);
}

mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection error:", err));
