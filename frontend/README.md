# ExpertConnect - Expert Booking System

ExpertConnect is a full-stack platform that connects clients with industry experts for personalized consulting sessions. The system features a unified authentication flow, real-time booking management, and a dedicated expert dashboard.

## 🚀 Key Features

- **Expert Discovery**: Browse and search experts by name or category (AI/ML, Frontend, Backend, etc.).
- **Unified Authentication**: Secure login and registration for both regular users and experts.
- **Real-time Bookings**: Book sessions through an interactive calendar with instant slot availability updates.
- **Expert Dashboard**: Dedicated interface for experts to manage their schedules, accept/decline bookings, and track progress.
- **Live Notifications**: Instant popup notifications for experts when new bookings are requests.
- **Modern UI**: Polished, responsive design built with Tailwind CSS and Shadcn UI components.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Icons**: Lucide React
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form with Zod validation

### Backend
- **Server**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Auth**: JSON Web Tokens (JWT) & BcryptJS
- **Real-time**: Socket.IO
- **Environment**: Dotenv

## 📂 Project Structure

```text
Expert-Booking-System/
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # API logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   └── server.js       # Entry point
│   └── .env.example        # Environment template
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities and API helpers
│   └── .env.example        # Environment template
└── requirements.txt        # Combined dependency list
```

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB instance (Atlas or Local)

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your `MONGO_URI` and `JWT_SECRET`.
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`.
4. Start the frontend:
   ```bash
   npm run dev
   ```

## 🌐 Deployment Guide

### 1. Backend (Render.com)
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Select the `backend` directory.
4. Render will automatically detect the `render.yaml` file and set up the configuration.
5. Add your secret environment variables (`MONGO_URI`, `JWT_SECRET`) in the Render Dashboard under **Environment**.
6. Deployment will start automatically. Your API URL will be something like `https://expert-api.onrender.com`.

### 2. Frontend (Vercel.com)
1. Create a new project on Vercel.
2. Connect your GitHub repository.
3. Select the `frontend` directory as the root.
4. In the **Environment Variables** section, add:
   - `VITE_API_BASE_URL`: `https://your-backend-url.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://your-backend-url.onrender.com`
5. Click **Deploy**. Vercel will use the `vercel.json` file to handle routing automatically.

## 🛡️ Authentication
- **Users**: Can register, browse experts, and book sessions.
- **Experts**: Must register via the "Expert Join" page to gain access to the dashboard.

## 📄 License
This project is licensed under the ISC License.
