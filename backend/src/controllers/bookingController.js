import Booking from "../models/Booking.js";
import Expert from "../models/Expert.js";
import { io } from "../server.js";

// @desc    Create a new booking
// @route   POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { expertId, date, time, name, email, phone, notes } = req.body;

    // Check if slot already booked
    const existing = await Booking.findOne({ expertId, date, time });
    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const booking = await Booking.create({
      expertId,
      date,
      time,
      name,
      email,
      phone,
      notes,
      status: "pending",
    });

    // Notify Expert and Admins
    io.to(`expert_${expertId}`).emit("new-booking", booking);
    io.to("admin_room").emit("new-booking", booking);

    res.status(201).json(booking);
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Get bookings for a user
// @route   GET /api/bookings/my-bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.user.email })
      .populate("expertId", "name category profileImage")
      .sort("-createdAt");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get bookings for an expert
// @route   GET /api/bookings/expert-bookings
export const getExpertBookings = async (req, res) => {
  try {
    // Assuming req.user is an Expert document because of authMiddleware logic
    const bookings = await Booking.find({ expertId: req.user._id })
      .sort("-createdAt");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update booking status (accept/decline)
// @route   PUT /api/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is the expert for this booking
    if (booking.expertId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    // Notify user or UI (optional for now, but good for real-time sync)
    io.emit("booking-status-updated", { id: booking._id, status });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
