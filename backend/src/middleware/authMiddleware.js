import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Expert from "../models/Expert.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Try to find in User collection first
            let user = await User.findById(decoded.id).select("-password");

            // If not found, try Expert collection
            if (!user) {
                user = await Expert.findById(decoded.id).select("-password");
            }

            if (!user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401).json({ message: "Not authorized as an admin" });
    }
};

export const expertOrAdmin = (req, res, next) => {
    // Both Experts and Admins can access certain dashboards
    if (req.user && (req.user.role === "admin" || req.user.role === "expert" || req.user.category)) {
        next();
    } else {
        res.status(401).json({ message: "Not authorized as an expert or admin" });
    }
};
