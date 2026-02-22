import mongoose from "mongoose";

/* =========================
   Time Schema
========================= */

const timeSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

/* =========================
   Slot Schema (Date + Times)
========================= */

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true, // yyyy-mm-dd
    },

    times: [timeSchema],
  },
  { _id: false }
);

/* =========================
   Expert Schema
========================= */

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 4.5,
    },

    price: {
      type: Number,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    // Slots by date
    slots: [slotSchema],
  },
  {
    timestamps: true,
  }
);

const Expert = mongoose.model("Expert", expertSchema);

export default Expert;