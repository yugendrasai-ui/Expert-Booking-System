// dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

import expertRoutes from "./routes/expertRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";

/* =========================
   Config
========================= */

dotenv.config();

const app = express();

/* =========================
   Middlewares
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   Create HTTP Server
========================= */

const server = http.createServer(app);

/* =========================
   Socket.IO Setup
========================= */

export const io = new Server(server, {
   cors: {
      origin: "http://localhost:8080", // frontend
      methods: ["GET", "POST"],
   },
});

/* =========================
   Socket Events
========================= */

io.on("connection", (socket) => {
   console.log("User connected:", socket.id);

   socket.on("join-expert-room", (expertId) => {
      socket.join(`expert_${expertId}`);
      console.log(`Expert ${expertId} joined their room`);
   });

   socket.on("join-admin-room", () => {
      socket.join("admin_room");
      console.log("Admin joined admin room");
   });

   socket.on("slotBooked", (data) => {
      console.log("Slot booked:", data);
      io.emit("slotUpdated", data);
   });

   socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
   });
});

/* =========================
   Routes
========================= */

app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

/* =========================
   MongoDB
========================= */

console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
   .connect(process.env.MONGO_URI)
   .then(() => console.log("MongoDB Connected ✅"))
   .catch((err) => console.error("MongoDB Error ❌", err));

/* =========================
   Test Route
========================= */

app.get("/", (req, res) => {
   res.send("Backend running ✅");
});

app.get("/api/debug", (req, res) => {
   res.json({
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      readyState: mongoose.connection.readyState,
      collections: Object.keys(mongoose.connection.collections)
   });
});

/* =========================
   Start Server
========================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});