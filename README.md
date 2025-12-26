<<<<<<< HEAD
# 🛒 ShopNow – Full-Stack E-Commerce Web Application
=======
# 🛒 ShopNOW – Full-Stack E-Commerce Web Application
>>>>>>> 6bcc00a (Commit all pending changes)

**ShopNow** is a modern, responsive e-commerce platform built with **React.js (Frontend)** and **Ruby on Rails (Backend)**. It provides a seamless online shopping experience with product listings, secure authentication, Razorpay payments, cart management, and a powerful Admin Panel.

---

## 🚀 Key Features

### 🛍️ Customer Experience
- **Modern UI/UX**: Gradient-based design with glassmorphism effects, fully responsive for Mobile & Desktop.
- **Product Discovery**: Search, Filter by Price/Color, Sort by Newest, and Category navigation.
- **Smart Cart**: Real-time cart badge updates, persistent cart state.
- **Secure Checkout**: Integrated **Razorpay Payment Gateway** for seamless transactions.
- **Address Management**: Save and manage multiple shipping addresses.
- **Order History**: Track past orders and status.

### 🛠️ Admin Panel
- **Dashboard**: Real-time analytics charts (Sales, Orders, Revenue).
- **Product Management**: Create, Edit, and Delete products.
- **Bulk Operations**: **Import & Export Products via CSV**.
- **User Management**: View customer details and order history.
- **Order Tracking**: manage order status (Pending -> Shipped -> Delivered).

---

## 🧰 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Vanilla CSS (Custom Responsive Design) |
| **Backend** | Ruby on Rails 7 (API Mode) |
| **Database** | SQLite (Development & Production - Render compatible) |
| **Payments** | Razorpay Payment Gateway |
| **Deployment** | Render (Backend), Netlify/Vercel (Frontend) |

---

## 📂 Project Structure

- **`frontend/`**: React application (Vite).
- **`backend/`**: Rails API application.
- **`backend/storage/`**: SQLite database files (Note: Prod & Dev databases are separate).

---

## ⚡ Getting Started

### 1. Backend Setup (Rails)
```bash
cd backend
bundle install
rails db:migrate
rails db:seed  # Seeds fake data (Only for Development)
rails s        # Server runs on http://localhost:3000
```

### 2. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev    # Client runs on http://localhost:5173
```

## 📖 API Documentation
For a detailed breakdown of the backend architecture, API endpoints, and database schema, please refer to the [Backend Overview](brain/backend_overview.md).

---
