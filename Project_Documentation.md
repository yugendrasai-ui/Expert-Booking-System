# Project Documentation: ExpertConnect - Expert Booking System

## 1. Project Overview
ExpertConnect is a full-stack platform designed to bridge the gap between clients and industry experts. It provides a seamless interface for discovering experts, booking sessions through an interactive calendar, and managing schedules via a dedicated expert dashboard.

## 2. Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Icons**: Lucide React
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM

### Backend
- **Server**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS
- **Real-time**: Socket.IO
- **Environment**: Dotenv

## 3. Project Structure

```text
Expert-Booking-System/
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration (DB connection)
│   │   ├── controllers/    # API logic (auth, booking, expert)
│   │   ├── middleware/     # Auth and error handling
│   │   ├── models/         # MongoDB schemas (User, Expert, Booking)
│   │   ├── routes/         # API endpoints
│   │   ├── seed.js         # Sample data seeding
│   │   └── server.js       # Entry point & socket setup
│   └── .env                # Environment variables
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # UI components (Shadcn + Custom)
│   │   ├── context/        # Auth context for state sharing
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components (Home, Login, Dashboard, etc.)
│   │   ├── lib/            # Utilities (axios setup, utils)
│   │   ├── App.tsx         # Main application routes
│   │   └── main.tsx        # Application entry point
│   ├── public/             # Static assets
│   └── .env                # API and Socket URLs
└── package.json            # Root configuration
```

## 4. Backend Architecture

### Models
- **User**: Stores client information (name, email, password, role).
- **Expert**: Stores expert-specific details (bio, category, availability, rating).
- **Booking**: Manages the relationship between users and experts (date, time, status).

### Controllers
- **authController.js**: Handles user registration, login, and token generation.
- **bookingController.js**: Manages create, read, update, and delete (CRUD) operations for bookings.
- **expertController.js**: Handles expert profile management and listing.

### Socket.io Integration
Used for real-time notifications. When a user books a session, the expert receives an immediate popup notification on their dashboard.

## 5. Frontend Architecture

### Core Components
- **Navbar**: Responsive navigation with auth-aware links.
- **ExpertCard**: Displays expert information in a grid.
- **BookingCalendar**: Interactive date and time slot selector.
- **NotificationSystem**: Handles incoming socket.io events.

### Context API
- **AuthContext.tsx**: Manages the user's authentication state globally, persisting the JWT across page refreshes.

## 6. API Endpoints (Summary)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User/Expert registration |
| POST | `/api/auth/login` | Authentication & JWT issuance |
| GET | `/api/experts` | List all available experts |
| GET | `/api/experts/:id` | Get detailed expert profile |
| POST | `/api/bookings` | Create a new session request |
| GET | `/api/bookings/my` | List current user's bookings |
| PATCH | `/api/bookings/:id` | Update booking status (Accept/Decline) |

## 7. Setup and Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or Local)

### Steps
1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd Expert-Booking-System
   ```
2. **Backend**:
   ```bash
   cd backend
   npm install
   # Configure .env with MONGO_URI and JWT_SECRET
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Configure .env with VITE_API_BASE_URL
   npm run dev
   ```

## 8. Deployment
- **Backend**: Hosted on Render.com using `render.yaml` configuration.
- **Frontend**: Hosted on Vercel.com with proper environment variable mapping.
