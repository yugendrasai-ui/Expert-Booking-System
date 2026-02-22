import Expert from "../models/Expert.js";

// GET slots for a specific expert and date
export const getExpertSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const expert = await Expert.findById(id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Default slots template
    const defaultSlots = [
      { time: "09:00", available: true },
      { time: "10:00", available: true },
      { time: "11:00", available: true },
      { time: "14:00", available: true },
      { time: "16:00", available: true },
    ];

    // GET ALL BOOKINGS for this expert and date
    // This is the "Universal Truth" source
    const mongoose = await import("mongoose");
    const Booking = mongoose.default.model("Booking");
    const existingBookings = await Booking.find({ expertId: id, date });
    const bookedTimes = existingBookings.map(b => b.time);

    // Merge: If expert has custom slots defined, use those, else use defaults
    const daySlot = expert.slots.find((s) => s.date === date);
    let slotsToReturn = daySlot ? daySlot.times : defaultSlots;

    // OVERRIDE with actual bookings (Safety Layer)
    const finalSlots = slotsToReturn.map(s => ({
      ...s.toObject ? s.toObject() : s, // Handle mongoose doc vs plain object
      available: bookedTimes.includes(s.time) ? false : s.available
    }));

    res.json(finalSlots);
  } catch (err) {
    console.error("getExpertSlots error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET unique categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Expert.distinct("category");
    res.json(categories);
  } catch (err) {
    console.error("getCategories error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET experts (pagination ready)
export const getExperts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const { search, category } = req.query;

    let query = {};

    if (search && search.trim() !== "") {
      // Escape regex special characters
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, "i");

      query.$or = [
        { name: regex },
        { category: regex }
      ];
    }

    if (category && category.trim() !== "") {
      query.category = category.trim();
    }

    const total = await Expert.countDocuments(query);
    const experts = await Expert.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      experts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (err) {
    console.error("getExperts error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET single expert
export const getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    res.json(expert);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// CREATE expert
export const createExpert = async (req, res) => {
  try {
    const expert = new Expert(req.body);
    const saved = await expert.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE expert
export const updateExpert = async (req, res) => {
  try {
    const updated = await Expert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE expert
export const deleteExpert = async (req, res) => {
  try {
    await Expert.findByIdAndDelete(req.params.id);
    res.json({ message: "Expert deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};