import mongoose from "mongoose";
import dotenv from "dotenv";
import Expert from "./models/Expert.js";

dotenv.config();

const experts = [
    {
        _id: "6999a432aa078ab15d7debfb", // ID from user's booking screenshot
        name: "Alex Rivera",
        category: "Frontend",
        description: "Specializing in React, Next.js, and high-performance web applications. Former Lead at unicorn startup.",
        experience: 8,
        rating: 4.8,
        price: 100,
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
        slots: []
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        for (const expert of experts) {
            await Expert.updateOne(
                { _id: scholar_id(expert._id) },
                { $set: expert },
                { upsert: true }
            );
        }

        console.log("Seeding successful! ✅");
        process.exit();
    } catch (err) {
        console.error("Seeding failed: ❌", err);
        process.exit(1);
    }
};

function scholar_id(id) {
    return new mongoose.Types.ObjectId(id);
}

seedDB();
