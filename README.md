# Canteen Pre-Order System (Smart Canteen) - MERN Stack Project

> **Software Requirements Specification (SRS) Compliant MVP**  
> **Submitted by:** Lenka Jayanthi  
> **Technology Stack:** MongoDB, Express.js, React.js, Node.js, Tailwind CSS, Recharts, Lucide Icons  

---

## 📌 Project Overview

The **Canteen Pre-Order System (Smart Canteen)** is an end-to-end full-stack web application designed to remove physical queues at college canteens during peak lunch hours. Students can pre-order food, choose a guaranteed capacity-limited 15-minute pickup time slot, track order status live, and submit ratings. Canteen staff manage food catalog availability, approve/update order status pipeline, manage pickup slot capacity, and analyze sales reports.

---

## 🚀 5 Core Feature Modules (Mapped to SRS Section 3)

| Feature Module | SRS Requirement ID | Description |
| :--- | :--- | :--- |
| **1. User Authentication & Security** | `FR1` | Student & Admin Registration/Login, salted password hashing via `bcrypt`, JWT stateless session management, RBAC route protection. |
| **2. Digital Menu & Food Catalog** | `FR2` | Search, category filtering, dietary filters, item detail view, stock availability toggle, and rule-based Smart AI Meal Recommender. |
| **3. Cart & Capacity Slot Booking** | `FR3` | Quantity controls, subtotal computation, atomic pickup slot reservation (disables FULL slots when capacity is reached), payment method selection (Online/Cash). |
| **4. Order Processing & Live Tracking** | `FR4` | Unique Order ID generation (`ORD-XXXXXX`), live order status pipeline: `Pending` ➔ `Accepted` ➔ `Preparing` ➔ `Ready` ➔ `Collected`. |
| **5. Admin Operations & Analytics** | `FR5` | Admin dashboard with key metrics, real-time incoming order queue approval, food item CRUD, pickup slot management, student feedback reviews, and Recharts sales statistics. |

---

## 🎯 SRS Traceability Matrix (Final Year Project Requirement)

| SRS Requirement ID | Requirement Name | Implemented Component / Function | API Endpoint | Page / View |
| :--- | :--- | :--- | :--- | :--- |
| **FR1.1** | Student Registration & Login | `authController.js` (JWT & bcrypt) | `POST /api/auth/register`, `POST /api/auth/login` | `/login`, `/register` |
| **FR1.2** | Role-Based Access Control | `authMiddleware.js` (`protect`, `adminOnly`) | `GET /api/auth/profile` | All Protected Routes |
| **FR2.1** | Browse & Search Menu | `foodController.getFoods` | `GET /api/foods` | `/menu` |
| **FR2.2** | View Food Details | `FoodDetailModal.jsx` | `GET /api/foods/:id` | `/menu` Modal |
| **FR2.3** | AI Meal Recommender | `aiService.js` (Rule-Based Mock AI) | Client Service | `/menu` AI Modal |
| **FR3.1** | Cart Quantity Control | `CartContext.jsx` | LocalStorage State | `/cart` |
| **FR3.2** | Select Pickup Slot | `SlotPicker.jsx` (Atomic Capacity Check) | `GET /api/slots` | `/cart` |
| **FR3.3** | Place Pre-Order | `orderController.placeOrder` | `POST /api/orders` | `/cart` |
| **FR4.1** | Order Receipt & ID | `OrderSuccess.jsx` | `GET /api/orders/:id` | `/order-success/:id` |
| **FR4.2** | Live Order Status Tracking | `OrderTracking.jsx` (5-Stage Pipeline) | `GET /api/orders/:id` | `/order-tracking/:id` |
| **FR4.3** | Order History | `OrderHistory.jsx` | `GET /api/orders/my-orders` | `/orders` |
| **FR5.1** | Submit Feedback | `feedbackController.submitFeedback` | `POST /api/feedback` | `/feedback` |
| **FR5.2** | Admin Dashboard | `adminController.getDashboardStats` | `GET /api/admin/dashboard` | `/admin/dashboard` |
| **FR5.3** | Manage Food Catalog | `foodController.createFood / updateFood` | `POST /api/foods`, `PUT /api/foods/:id` | `/admin/food` |
| **FR5.4** | Manage Order Pipeline | `orderController.updateOrderStatus` | `PUT /api/orders/:id/status` | `/admin/orders` |
| **FR5.5** | Pickup Slot Management | `slotController.createSlot / updateSlot` | `POST /api/slots`, `PUT /api/slots/:id` | `/admin/slots` |
| **FR5.6** | Sales & Order Analytics | `AdminReports.jsx` (Recharts Graphs) | `GET /api/admin/dashboard` | `/admin/reports` |

---

## 🛠️ Technology Stack & Free Tier Guarantee

- **Frontend:** React.js, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide Icons.
- **Backend:** Node.js, Express.js, Mongoose, JWT, Bcryptjs, Cors, Dotenv.
- **Database:** MongoDB Atlas only. Configure `MONGO_URI` with your Atlas `mongodb+srv://` connection string; the backend will not fall back to local MongoDB or in-memory storage.
- **AI Service:** Rule-based Mock AI engine (`client/src/services/aiService.js`) with artificial delay to simulate real AI processing. **NO PAID API KEY REQUIRED**.
- **Billing Cost:** 100% Free Tier ($0 Cost).

---

## 📂 Project Folder Structure

```
canteen-pre-order-system/
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Loader, FoodCard, SlotPicker, OrderStatusBadge, AIModal)
│   │   ├── context/          # State providers (AuthContext.jsx, CartContext.jsx)
│   │   ├── pages/            # Student & Admin pages (Menu, Cart, Tracking, Dashboard, etc.)
│   │   ├── services/         # API Axios instance & rule-based AI engine (api.js, aiService.js)
│   │   ├── App.jsx           # Main routing & guards
│   │   └── main.jsx          # Vite entry point
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/               # Database connection & fallback store (db.js)
│   ├── controllers/          # Business logic controllers (auth, food, slot, order, feedback, admin)
│   ├── middleware/           # Auth guard & error handlers (authMiddleware.js, errorHandler.js)
│   ├── models/               # Mongoose data schemas (User.js, Food.js, Slot.js, Order.js, Feedback.js)
│   ├── routes/               # REST API route handlers (auth, food, slot, order, feedback, admin)
│   └── server.js             # Express API entry point
├── .env.example
├── README.md
└── package.json
```

---

## 💻 How to Run Locally

### 1. Clone & Install Dependencies
Run from the project root directory:
```bash
# Install root & backend dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Start Both Server & Client Concurrently
Run from the root directory:
```bash
npm run dev
```
- **Frontend App:** `http://localhost:5173`
- **Backend API:** `http://localhost:5007`
- Set `MONGO_URI` in `.env` to your MongoDB Atlas `mongodb+srv://` connection string. If your system's default DNS resolver cannot resolve Atlas SRV records, optionally set `MONGODB_DNS_SERVERS` to a reachable DNS server address (or comma-separated addresses).

---

## 🔑 Demo Login Credentials

For quick evaluation, click the demo buttons on the Login page:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Demo Student** | `student@canteen.edu` | `password123` |
| **Demo Admin** | `admin@canteen.edu` | `admin123` |

---

## 🌐 Deploying to Render

This repository includes a Render Blueprint (`render.yaml`) that deploys the API and
the built React client as one web service. In Render, create a Blueprint from the
Git repository and set the required `MONGO_URI` and `JWT_SECRET` values when
prompted. Render supplies `PORT` automatically; do not run `npm run dev` as the
production start command.

For a manually configured Render Web Service, use:

- **Build command:** `npm run build:render`
- **Start command:** `npm start`
- **Health check path:** `/api/health`
- **Environment variables:** `MONGO_URI`, `JWT_SECRET`

The build command installs the root and client lockfiles and builds Vite; the
Express server serves `client/dist` in production. For separate Vercel frontend
hosting, set the Vercel project root to `client`, build with `npm run build`, and
publish `dist`; deploy the API separately and configure its allowed client origin
as needed.
