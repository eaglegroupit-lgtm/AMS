# 🍲 Amutha Surabi Restaurant (அமுதா சுரபி உணவகம்)

A modern, production-ready full-stack web application built for **Amutha Surabi Restaurant**, an authentic South Indian restaurant. Features a customer-facing multi-language (English & தமிழ்) website and a complete administrative control panel with a real-time POS Billing module.

---

## ✨ Features & Highlights

### 🌐 Customer Website
- **Multi-Language Support**: Seamless instant toggle between **English** and **தமிழ்** without page reload.
- **Hero & Storytelling**: South Indian traditional aesthetic (Deep Orange, Maroon, Gold accents) showcasing authentic heritage recipes.
- **Today's Special & Featured Items**: Carousel & dish highlights.
- **Interactive Menu**: Category filtering (Breakfast, Lunch, Dinner, Snacks, Juices, Coffee, Tea, Desserts), search by dish name in EN/TA, Veg/Non-Veg filter, spicy level indicator, and prep time badges.
- **Cart & WhatsApp Order**: Add items to cart and place orders directly via WhatsApp with auto-formatted bill breakdown.
- **About Us & Gallery**: Heritage story, mission, vision, and filterable photo gallery.
- **Contact & Map**: Location details, opening hours, interactive form, and embedded Google Map.

### 🛡️ Admin Dashboard & POS Control
- **Executive Analytics**: Real-time stats for Today's Sales, Today's Orders, Monthly Revenue, Total Registered Customers, Recharts Revenue Trend, and Popular Dishes.
- **Restaurant POS Billing System**: Table selection (T1 to T15 & Takeaway), guest details, item grid search, discount %, 5% GST calculation, Cash/UPI/Card payment mode, thermal receipt layout, and instant **PDF Receipt Download** & printing.
- **Food CRUD**: Create, edit, delete, toggle availability, toggle Today's Special, set spicy levels, upload dish photos.
- **Category CRUD**: Manage category sort order and visibility.
- **Banner & Offers**: Hero sliders, festival banners, and offer notices.
- **QR Code Generator**: Instant QR generation for Digital Menu link, WhatsApp link, UPI Payment, and Table standees with downloadable PNGs.
- **Sales Reports**: Export complete sales history to **CSV**, **Excel (.xlsx)**, or **PDF**.
- **Customer CRM**: Track customer visit frequency, total spend, phone numbers, and last visit dates.
- **Restaurant Settings**: GSTIN number, address in English & Tamil, WhatsApp number manager, opening hours.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, jsPDF, XLSX
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon PostgreSQL / Supabase PostgreSQL / Local PostgreSQL)
- **Authentication**: JWT Auth (`jose`), Password Hashing (`bcryptjs`), Role-based access control
- **Storage**: Local uploads under `public/uploads` (easily switchable to Cloudinary / AWS S3)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18+
- PostgreSQL database (or Neon / Supabase URL)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/amutha-surabi.git
cd amutha-surabi

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/amuthasurabi?schema=public"
JWT_SECRET="amutha-surabi-super-secret-jwt-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Initialization & Seeding

```bash
# Push database schema
npx prisma db push

# Seed database with authentic South Indian dishes, categories, banners & default admin
npm run seed
```

### 5. Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Customer Website**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3000/admin/login`
- **Default Admin Credentials**:
  - **Email**: `admin@amuthasurabi.com`
  - **Password**: `admin123`

---

## ☁️ Deployment Guide

### Database Deployment (Neon / Supabase)
1. Create a PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Copy the Connection String and set it as `DATABASE_URL` in Vercel environment variables.
3. Run `npx prisma db push` and `npm run seed` pointing to your cloud database.

### Frontend Deployment (Vercel)
1. Push project repository to GitHub.
2. Import project into Vercel dashboard.
3. Add environment variables (`DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`).
4. Click **Deploy**.

---

© 2026 Amutha Surabi Restaurant. All rights reserved.
