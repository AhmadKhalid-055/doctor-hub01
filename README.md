# Doctor Hub

🟢 **Live Project Link:** [https://doctor-hub01.vercel.app/](https://doctor-hub01.vercel.app/)

A full-stack **Healthcare Management Platform** built with **Next.js 15**, **PostgreSQL (Supabase)**, **Prisma ORM**, **Tailwind CSS v4**, and **jose JWT**. It supports 5 distinct user roles, each with their own dashboard, workflows, and permissions.

---

## 📖 What Is This App?

**Doctor Hub** is a complete clinic & hospital management system. Here's the full workflow:

1. **Patients** register themselves, search for doctors, book appointments, and upload payment screenshots.
2. **Assistants** review payment screenshots and verify or reject them on behalf of the clinic.
3. **Doctors** manage their weekly availability, view confirmed appointments, write prescriptions, and manage clinics.
4. **Admins** onboard new doctors and assistants, manage clinic details, and monitor overall clinic performance.
5. **Super Admins** have a bird's-eye view of the entire platform with full analytics.

---

## 🔑 Test Credentials (Live Demo)

Use these pre-seeded accounts to explore every role on the live deployment.  
**Login page:** [https://doctor-hub01.vercel.app/login](https://doctor-hub01.vercel.app/login)

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| 🧑‍⚕️ Patient | `ahmad.khalid.regno.055@gmail.com` | `DataBas1250` | `/dashboard/patient` |
| 👨‍⚕️ Doctor | `doctor_test@example.com` | `DataBas1250` | `/dashboard/doctor` |
| 🗂️ Assistant | `assistant_test@example.com` | `DataBas1250` | `/dashboard/assistant` |
| 🛠️ Admin | `admin_test@example.com` | `DataBas1250` | `/dashboard/admin` |
| 👑 Super Admin | `super_admin_test@example.com` | `DataBas1250` | `/dashboard/super-admin` |

---

## 👤 How to Create Each Account Type

### 🧑‍⚕️ Patient Account
- **Who can create:** Anyone (public)
- **How:** Go to [/register](https://doctor-hub01.vercel.app/register) and fill in name, email, and password.
- Patients are automatically assigned the `PATIENT` role.

### 👨‍⚕️ Doctor Account
- **Who can create:** Admin or Super Admin only
- **How:**
  1. Log in as Admin (`admin_test@example.com` / `DataBas1250`)
  2. Go to **Admin Dashboard → Doctor Management**
  3. Click **"+ Add Doctor"**
  4. Fill in: First & Last Name, Email, Password, Specialty, License Number, Consultation Fee, Experience (years), Treatment Type, and optionally assign to a Clinic
  5. Click **"Create Doctor Account"** ✅

### 🗂️ Assistant Account
- **Who can create:** Admin or Super Admin only
- **How:**
  1. Log in as Admin
  2. Go to **Admin Dashboard → Staff Management**
  3. Click **"+ Add Assistant"**
  4. Fill in: Name, Email, Password, Phone (optional), and **select a Clinic** (required)
  5. Click **"Create Assistant Account"** ✅
  > ⚠️ A clinic must exist before you can assign an assistant. Create one first from the **Clinic** tab.

### 🛠️ Admin Account
- **Who can create:** Super Admin (manually via database or seeding script)
- Admins are tied to a specific clinic and manage its doctors and staff.

### 👑 Super Admin Account
- **Who can create:** Developer/System only (database seed or direct DB insert)
- Has platform-wide access to all analytics, clinics, and user data.

---

## 🏥 Role Capabilities at a Glance

### 🧑‍⚕️ Patient
| Feature | Details |
|---------|---------|
| Search Doctors | Filter by specialty, disease, treatment type (Allopathic / Homeopathic / Herbal) |
| Book Appointment | Choose doctor, clinic, date & time slot |
| Upload Payment | Upload a payment screenshot after booking |
| View History | Access medical records and past prescriptions |
| Billing | Track all payments and their statuses |

### 👨‍⚕️ Doctor
| Feature | Details |
|---------|---------|
| Manage Availability | Set weekly schedule per day (start time, end time, slot duration) |
| View Appointments | See all upcoming confirmed appointments |
| Write Prescriptions | Dynamic form with multiple medicines, dosage, duration |
| Manage Clinics | Add and edit clinic information |

### 🗂️ Assistant
| Feature | Details |
|---------|---------|
| Payment Queue | View all payment screenshots submitted by patients |
| Verify Payments | Approve or reject payments with optional rejection reason |
| Patient Check-in | Mark appointments and manage walk-in queue |

### 🛠️ Admin
| Feature | Details |
|---------|---------|
| Add Doctors | Create new doctor accounts with full profile |
| Add Assistants | Onboard reception staff and assign to clinic |
| Manage Clinics | Edit clinic name, address, city, contact info |
| Overview | View total doctors, active patients, revenue, and wait times |

### 👑 Super Admin
| Feature | Details |
|---------|---------|
| Platform Analytics | Revenue trends, appointment volumes (line & bar charts) |
| Specialty Distribution | Pie chart of doctor specialties |
| Top Doctors | Ranked by appointment count |
| System-wide Overview | Access across all clinics and data |

---

## ✨ Features

- 🔐 **Authentication** — JWT access tokens + refresh tokens, bcrypt hashing, HttpOnly cookies
- 👥 **Role-Based Access Control** — 5 roles, enforced at Edge middleware level
- 🔍 **Doctor Search** — Filter by disease, specialty, and treatment type with pagination
- 📅 **Appointment Booking** — Time-slot wizard with dynamic availability slots
- 💳 **Payment Verification** — Screenshot upload → assistant review → status update
- 🏥 **Clinic Management** — Multi-clinic support with doctor many-to-many assignments
- 📋 **Medical History** — Append-only, tamper-proof records
- 💊 **Prescription Management** — Immutable prescriptions with PDF download
- 📊 **Analytics Dashboard** — Recharts with revenue, appointments, and KPIs
- 🛡️ **Security** — CSP, HSTS, XSS protection, Zod input validation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Auth | jose (JWT), bcrypt |
| State | Zustand with persist middleware |
| Charts | Recharts |
| Validation | Zod |

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/AhmadKhalid-055/doctor-hub01.git
cd doctor-hub01
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
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-1-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="your-32-char-secret"
JWT_REFRESH_SECRET="your-other-32-char-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
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

---

## ☁️ Deployment (Vercel + Supabase)

1. Create a **Supabase** project at [supabase.com](https://supabase.com)
2. Copy the **Transaction Pooler** connection string (`port 6543`, with `?pgbouncer=true`) — **not** the direct connection
3. Push code to GitHub
4. Import the GitHub repo into **Vercel**
5. Add environment variables (`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`) in the Vercel dashboard
6. Vercel auto-deploys on every push to `main`

> ⚠️ **Important:** Always use the **Transaction Pooler** (port `6543`) URL for Vercel serverless functions, not the direct connection (port `5432`).

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/            # Login, Register, Forgot/Reset Password
│   │   ├── admin/staff/     # Create/List/Remove Doctor & Assistant accounts
│   │   ├── appointments/    # Booking & slot management
│   │   ├── clinics/         # Clinic CRUD
│   │   ├── availabilities/  # Doctor schedule management
│   │   ├── medical-records/ # Append-only patient records
│   │   ├── prescriptions/   # Immutable prescriptions
│   │   ├── payments/        # Screenshot upload
│   │   ├── assistant/       # Payment verification queue
│   │   └── analytics/       # KPI aggregation + monthly data
│   ├── dashboard/
│   │   ├── patient/         # Patient portal
│   │   ├── doctor/          # Doctor portal
│   │   ├── assistant/       # Assistant portal
│   │   ├── admin/           # Admin portal (doctors, assistants, clinic)
│   │   └── super-admin/     # Platform-wide analytics
│   ├── login/
│   ├── register/            # Public patient self-registration
│   ├── forgot-password/
│   └── reset-password/
├── components/
│   ├── ui/                  # Button, Card, Input, Dialog, Toast, Table
│   └── layout/              # Sidebar, Header
├── hooks/
│   └── use-auth-store.ts    # Zustand auth store
├── lib/
│   ├── jwt.ts               # jose JWT helpers
│   ├── prisma.ts            # Prisma singleton client
│   ├── utils.ts             # Utility functions
│   └── validators.ts        # Zod schemas
├── middleware.ts             # Edge RBAC middleware (cryptographic JWT verification)
└── prisma/
    └── schema.prisma         # Full database schema (10 models)
```

---

## 📄 License

MIT
