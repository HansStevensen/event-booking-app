# EventTix - Event Ticket Booking Application

A full-stack Event Ticket Booking Application built with React (Vite), Node.js, Express, and MongoDB.

---

## 📁 Project Structure
```text
event-tix/
├── backend/          # Node.js + Express backend server
│   ├── models/       # Mongoose schemas (User, Event, Booking)
│   ├── uploads/      # Uploaded event poster images (static folder)
│   ├── .env          # Backend environment configurations (port, mongo URI)
│   └── index.js      # Main Express app & API routes
└── frontend/         # React + Vite frontend application
    ├── src/
    │   ├── components/  # Reusable React components & Route Guards
    │   ├── pages/       # Page components (Home, Login, Register, Admin, AddEvent)
    │   ├── App.tsx      # Main routing configuration (React Router v6)
    │   └── main.tsx     # App entry point
    ├── tailwind.config.js # Tailwind CSS configurations
    └── package.json     # Frontend dependencies
```

---

## 🚀 How to Setup and Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 1. Setup Backend (Server)
1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend` folder and add your MongoDB connection string and port:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   PORT=5000
   ```
4. Run the backend server in development mode:
   ```bash
   npx nodemon index.js
   ```
   *The backend will run on `http://localhost:5000`.*

### 2. Setup Frontend (Client)
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 🔑 Default Admin Account (For Testing)
If you inserted the admin document manually into MongoDB Atlas, you can use these credentials to access the admin dashboard (`/admin`):
*   **Username:** `admin`
*   **Password:** `admin123`

---

## 🛠️ API Endpoints Summary

### Authentication & Profile
*   `POST /api/register` - Register a new user (with duplicate checks for username & email)
*   `POST /api/login` - Login and get user `id` & `role`
*   `GET /api/profile/:id` - Fetch user profile details
*   `PUT /api/profile/:id` - Update user profile details

### Events (Admin)
*   `POST /api/events` - Add new event with image upload (Multer)
*   `GET /api/events` - Get all events
*   `GET /api/events/:id` - Get specific event details
*   `PUT /api/events/:id` - Edit event details and poster image
*   `DELETE /api/events/:id` - Delete an event

### Bookings (Transaction)
*   `POST /api/bookings` - Create a booking (automatically decreases event quota)
*   `PUT /api/bookings/:id/payment` - Confirm ticket payment (status changed to `paid`)
*   `PUT /api/bookings/:id/cancel` - Cancel a booking (automatically refunds ticket quantity to quota)
*   `GET /api/bookings/user/:userId` - Get booking history for a specific user
*   `GET /api/bookings` - Get all bookings (Admin view)
