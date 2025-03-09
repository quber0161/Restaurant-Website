import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // 🟢 Store user ID in `req.userId`

        next();
    } catch (error) {
        console.error("❌ Error in authMiddleware:", error);
        res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

export default authMiddleware;
