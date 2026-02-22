import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Expert from "../models/Expert.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        const expertExists = await Expert.findOne({ email });

        if (userExists || expertExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: "user",
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Register a new expert
// @route   POST /api/auth/register-expert
export const registerExpert = async (req, res) => {
    const {
        name,
        email,
        password,
        category,
        description,
        experience,
        price,
        profileImage
    } = req.body;

    try {
        const userExists = await User.findOne({ email });
        const expertExists = await Expert.findOne({ email });

        if (userExists || expertExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const expert = await Expert.create({
            name,
            email,
            password: hashedPassword,
            category,
            description,
            experience,
            price,
            profileImage,
            isApproved: false
        });

        if (expert) {
            res.status(201).json({
                _id: expert._id,
                name: expert.name,
                email: expert.email,
                role: "expert",
                category: expert.category,
                token: generateToken(expert._id),
            });
        } else {
            res.status(400).json({ message: "Invalid expert data" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check User collection
        let user = await User.findOne({ email });
        let role = "user";

        if (!user) {
            // Check Expert collection
            user = await Expert.findOne({ email });
            role = "expert";
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || role,
                category: user.category || null,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
