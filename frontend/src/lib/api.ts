import axios from "axios";
import type { Expert } from "@/components/ExpertCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/* ============================
   TYPES
============================ */

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingPayload {
  expertId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

/* ============================
   EXPERT APIs
============================ */

// Get categories
export async function fetchCategories(): Promise<string[]> {
  try {
    const res = await axios.get(`${API_BASE}/experts/categories`);
    return res.data;
  } catch (err) {
    console.error("Fetch categories failed:", err);
    return [];
  }
}

// Get all experts
export async function fetchExperts(
  page = 1,
  limit = 6,
  search = "",
  category = ""
): Promise<{ experts: Expert[]; totalPages: number }> {
  try {
    const res = await axios.get(`${API_BASE}/experts`, {
      params: { page, limit, search, category },
    });
    return res.data;
  } catch (err) {
    console.error("Fetch experts failed:", err);
    return { experts: [], totalPages: 1 };
  }
}

// Get single expert
export async function fetchExpertById(id: string): Promise<Expert | null> {
  try {
    const res = await axios.get(`${API_BASE}/experts/${id}`);

    // Map _id → id for frontend
    return {
      ...res.data,
      id: res.data._id,
    };
  } catch (err) {
    console.error("Fetch expert failed:", err);
    return null;
  }
}

/* ============================
   SLOTS API
============================ */

export async function fetchTimeSlots(
  expertId: string,
  date: string
): Promise<TimeSlot[]> {
  try {
    const res = await axios.get(
      `${API_BASE}/experts/${expertId}/slots`,
      {
        params: { date },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Fetch slots failed:", err);

    // fallback demo slots
    return [
      { time: "09:00", available: true },
      { time: "10:00", available: true },
      { time: "11:00", available: true },
      { time: "14:00", available: true },
      { time: "16:00", available: true },
    ];
  }
}

// Helper for auth headers
const authHeader = (token?: string) => ({
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

/* ============================
   BOOKING API
============================ */

export async function createBooking(payload: BookingPayload, token?: string) {
  try {
    const res = await axios.post(
      `${API_BASE}/bookings`,
      payload,
      authHeader(token)
    );

    return { ...res.data, success: true };
  } catch (err: any) {
    console.error("Booking failed:", err);

    return {
      success: false,
      message: err.response?.data?.message || "Booking failed",
    };
  }
}

// Get bookings for the logged in user
export async function fetchMyBookings(token: string) {
  try {
    const res = await axios.get(`${API_BASE}/bookings/my-bookings`, authHeader(token));
    return res.data;
  } catch (err) {
    console.error("Fetch my bookings failed:", err);
    return [];
  }
}
