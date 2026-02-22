import express from "express";
import {
  createBooking,
  getMyBookings,
  getExpertBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/expert-bookings", protect, getExpertBookings);
router.put("/:id/status", protect, updateBookingStatus);

export default router;