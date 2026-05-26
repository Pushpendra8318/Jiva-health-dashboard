# Jiva Health — Admin Dashboard

A full-stack MERN application for managing healthcare users, orders, payments, and family members.

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, Context API, React Hot Toast, React Icons  
**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT Auth, bcryptjs

---

## Project Structure

```
Jiva_Health/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level pages
│       ├── services/        # Axios API calls
│       ├── context/         # Auth context (JWT)
│       └── utils/           # Helpers (format, color maps)
└── server/                  # Node.js + Express backend
    ├── controllers/         # Route handlers
    ├── models/              # Mongoose schemas
    ├── routes/              # Express routers
    └── middleware/          # Auth middleware
```

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/jiva_health?retryWrites=true&w=majority
JWT_SECRET=jiva_health_super_secret_jwt_key_2024
JWT_EXPIRE=30d
NODE_ENV=development
```

> **Note:** If your MongoDB password contains special characters (e.g. `@`), URL-encode them (`@` → `%40`).

Seed demo data:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Demo Login

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@healthcare.com     |
| Password | admin123                 |

> Demo user with full data: **Alice Williams** (seeded via `npm run seed`)

---

## Implemented Screens (per assignment)

| Screen | Status |
|--------|--------|
| User Management List | ✅ |
| User Detail Page (4 tabs) | ✅ |
| Order History + Payment History | ✅ |
| Order Detail Page (modal) | ✅ |
| Family Member Management | ✅ |

---

## Features

### User Management
- View all users with summary stats (Total, Prime, Non-Prime, Family Members)
- Search by name, email, or phone (debounced)
- Filter by status (Active/Inactive) and user type (Normal/Prime)
- Paginated list
- Add new user, Edit user, Delete user (with cascade — removes orders/payments/family)
- Upgrade to Prime / downgrade toggle per user

### User Detail (4-tab view)
- **Overview** — personal info (email, phone, DOB, gender, blood group), editable via modal; address management (add, delete, default badge)
- **Orders & Bookings** — order list with status, item name, date, amount; inline status update; click to open Order Detail modal; Add Order button
- **Payments** — transaction ID, type, date, method (Card/UPI/Net Banking/Cash), status, amount
- **Family Members** — add/edit/delete members (name, relation, DOB, phone); count updates dynamically

### Order Detail Modal
- Delivery timeline (Pending → Processing → Shipped → Delivered)
- Cancelled state with red banner
- Itemised order list with qty × price
- Shipping address from user profile
- Payment summary grid

### Dashboard
- Live stat cards: Total Users, Total Orders, Family Members, Total Revenue (from DB)
- Recent Users panel (last 5, clickable → user detail)
- Recent Orders panel (last 5 with status)
- Quick navigation grid

### Medicine Orders Page
- All orders across all users
- Per-status count cards (clickable filter)
- Search by order number, user, or item
- Inline status update dropdown
- Click row → Order Detail modal

### Authentication
- JWT-based login with localStorage persistence
- Protected routes via React Router
- Admin-only platform (no public registration)
- Auto-redirect on token expiry

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/login | Admin login |
| GET | /api/auth/me | Get current user |
| GET | /api/users | List users + stats (search, filter, paginate) |
| GET | /api/users/:id | User + orders + payments + family |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user (cascade) |
| PATCH | /api/users/:id/prime | Toggle prime |
| PATCH | /api/users/:id/status | Toggle active/inactive |
| POST | /api/users/:id/addresses | Add address |
| DELETE | /api/users/:id/addresses/:aid | Delete address |
| GET | /api/orders | Get orders (filter by userId, status) |
| POST | /api/orders | Create order |
| PUT | /api/orders/:id | Update order |
| DELETE | /api/orders/:id | Delete order |
| GET | /api/payments | Get payments (filter by userId) |
| GET | /api/family | Get family members |
| POST | /api/family | Add family member |
| PUT | /api/family/:id | Update family member |
| DELETE | /api/family/:id | Delete family member |
| GET | /api/dashboard/stats | Dashboard aggregate stats |
