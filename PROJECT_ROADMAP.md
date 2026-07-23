# EventTix - Project Roadmap & Implementation Plan

## Product Vision & Concept
EventTix is an Enterprise Event Ticketing & Gatekeeper Ecosystem built for event promoters (e.g. PT EventTix Indonesia). It covers public event catalog browsing, rich event detail inspection, ticket ordering, payment & cancellation simulation, user profile management, admin event CRUD & transaction monitoring, E-Ticket QR code generation, and mobile gatekeeper scanner verification.

---

## 👥 User Roles & Access Control
- **Customer (`role === 'user'`)**: Browse events, view event details, select ticket quantities, book tickets, manage ticket history (`MyBookings`), simulate payment/cancellation, and manage personal profile.
- **Admin (`role === 'admin'`)**: Full administrative access. Manage events (Create, Read, Update, Delete with venue & schedule details), monitor live customer transactions, and scan/verify E-Ticket QR codes on-site.

---

## 📋 Master Roadmap & Checklist

### FASE 1: Core Flow Fixes, JWT Security & Data Safety
- [ ] **1.1 Home Page Flow Adjustment (`src/pages/Home.tsx`)**
  - Change all event card buttons from direct "Book Ticket" to "View Details" / "Select Ticket" pointing to `/event/:id`.
- [ ] **1.2 Backend Delete Event Protection (`backend/index.js`)**
  - Add backend validation in `DELETE /api/events/:id` to disallow event deletion if active/paid customer bookings exist for that event.
- [ ] **1.3 Venue & Schedule Fields Expansion (`AddEvent.tsx` & `EditEvent.tsx`)**
  - Add inputs for detailed venue address, Google Maps link, open gate time, show start time, and terms & conditions.
- [ ] **1.4 Admin Dashboard Manual/Auto Refresh (`src/pages/Admin.tsx`)**
  - Add a "Refresh Data" button and background polling to update transaction tables live.
- [ ] **1.5 JWT Authentication & Middleware Security (`jsonwebtoken`)**
  - Generate signed JWT token on login (`POST /api/login`).
  - Add `verifyToken` & `verifyAdmin` backend middleware to protect write/delete API endpoints against token forgery or unauthorized access.

---

### FASE 2: User Profile & Payment Timer
- [ ] **2.1 User Profile Management (`src/pages/Profile.tsx`)**
  - Create profile view/edit page using `GET /api/profile/:id` and `PUT /api/profile/:id` (Name, Email, Phone, DOB, and Password update).
- [ ] **2.2 Payment Countdown Timer (`src/pages/MyBookings.tsx`)**
  - Display a 15-minute countdown timer on `pending` bookings. Automatically flag expired bookings.

---

### FASE 3: Interactive E-Ticket & Gatekeeper Scanner
- [ ] **3.1 E-Ticket QR Code Generator (`src/pages/MyBookings.tsx`)**
  - Generate a unique QR Code image for `paid` tickets using `qrcode.react`.
- [ ] **3.2 Gatekeeper QR Code Scanner (`src/pages/Validator.tsx`)**
  - Create camera-based QR scanner page using `@html5-qrcode` for event staff on-site.
  - Implement verification API `POST /api/bookings/verify-qr` (Valid green vs Invalid/Used red).
- [ ] **3.3 Ticket Category & Seat Selection (`src/pages/EventDetail.tsx`)**
  - Interactive seat/zone selection (VIP, CAT 1, Regular) with zone-based pricing.

---

### FASE 4: Advanced Features & Sales Analytics
- [ ] **4.1 Event Category & Location Filter**
  - Multi-filter for Music, Seminar, E-Sports, Sports, and City locations.
- [ ] **4.2 Admin Sales Laporan Export**
  - Export transaction history and sales reports to Excel / CSV format.
- [ ] **4.3 Event Ratings & Reviews**
  - Attendees with `paid` tickets can leave star ratings and reviews after event completion.
