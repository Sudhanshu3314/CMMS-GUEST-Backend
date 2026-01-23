// middlewares/auth.js
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ DO NOT fabricate name
        req.user = {
            email: decoded.email,
            name: decoded.name,
            _id: decoded._id,
        };

        if (!req.user.email || !req.user.name) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }

        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
