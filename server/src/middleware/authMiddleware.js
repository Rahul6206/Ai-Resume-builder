const jwt = require("jsonwebtoken");
const User = require("../models/users");


const verifyToken = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Invalid token.",
            });
        }

        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token signature.",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Unauthorized access.",
        });
    }
};

module.exports = verifyToken;
