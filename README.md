# Doctor Hub

A full-stack medical platform built with **Next.js 15**, **PostgreSQL (Supabase)**, **Prisma ORM**, **Tailwind CSS**, and **ShadCN UI**.

## Features

- 🔐 **Authentication** — JWT, bcrypt, refresh tokens, HttpOnly cookies
- 👥 **Role-Based Access Control** — Patient, Doctor, Assistant, Admin, Super Admin
- 🔍 **Doctor Search** — Filter by disease, specialty, and treatment type
- 📅 **Appointment Booking** — Time-slot wizard with availability management
- 💳 **Payment Verification** — Screenshot upload → assistant review → confirmed
- 🏥 **Clinic Management** — Doctor-managed multi-clinic many-to-many relationships
- 📋 **Medical History** — Append-only, immutable records
- 💊 **Prescription Management** — Dynamic medicine forms, PDF download, immutable
- 📊 **Analytics Dashboard** — Recharts with revenue, appointments, and verification stats
- 🛡️ **Security** — CSP, HSTS, XSS protection, Zod validation, SQL injection prevention

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Auth**: jose (JWT), bcrypt
- **State**: Zustand with persist
- **Charts**: Recharts
- **Validation**: Zod

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/doctor-hub.git
cd doctor-hub
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-32-char-secret"
JWT_REFRESH_SECRET="your-other-32-char-secret"
```

### 4. Run Prisma migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel + Supabase)

1. Create a **Supabase** project at [supabase.com](https://supabase.com) and copy the `DATABASE_URL` (Connection Pooling → `?pgbouncer=true`)
2. Push code to GitHub
3. Import the GitHub repo into **Vercel**
4. Add all environment variables in the Vercel dashboard
5. Vercel auto-deploys on every push

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Login, Register, Forgot/Reset Password
│   │   ├── appointments/  # Booking
│   │   ├── clinics/       # Clinic CRUD
│   │   ├── availabilities/ # Schedule management
│   │   ├── medical-records/ # Append-only records
│   │   ├── prescriptions/ # Immutable prescriptions
│   │   ├── payments/      # Screenshot upload
│   │   ├── assistant/     # Payment verification
│   │   └── analytics/     # KPI + monthly data
│   ├── dashboard/
│   │   ├── patient/       # Patient portal
│   │   ├── doctor/        # Doctor portal
│   │   ├── assistant/     # Assistant portal
│   │   ├── admin/         # Admin portal
│   │   └── super-admin/   # Super Admin + Analytics
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── components/
│   └── ui/                # Button, Card, Input, Dialog, Toast, Table
├── hooks/
│   └── use-auth-store.ts  # Zustand auth store
├── lib/
│   ├── jwt.ts             # jose JWT helpers
│   ├── prisma.ts          # Prisma singleton client
│   ├── utils.ts           # Utility functions
│   └── validators.ts      # Zod schemas
├── middleware.ts           # Edge RBAC middleware
└── prisma/
    └── schema.prisma       # Full database schema
```

## License

MIT
