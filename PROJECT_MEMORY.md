# Bangla ERP — Core Project Memory & Workspace Rules

This document serves as the permanent persistent memory and rulebook for Antigravity and AI coding assistants working on the **Bangla ERP** system.

---

## 1. Project Background & Overview
- **Project Name:** Bangla ERP (বলকা ফ্যাক্টরি / BOLAKA FACTORY)
- **Business Focus:** Furniture, Wood, Board Manufacturing & Sales Management in Bangladesh.
- **Tech Stack:** Next.js 16.3.2 (App Router & Turbopack), React 19, TypeScript, Tailwind CSS v4, Prisma ORM, Supabase PostgreSQL, NextAuth v5 (Auth.js beta), Lucide React.
- **Upstream Git:** `https://github.com/kayes147/bangla-erp.git` (Branch: `master`)

---

## 2. Default Accounts & Credentials
- **Super Admin:** `kayes147@` | Password: `147570pmBD@147`
- **Business Owner:** `owner` | Password: `123` or `1234`
- **Manager:** `manager` | Password: `123` or `1234`
- **Client Portal:** Client Phone Number (e.g. `01954223347`) | Password: `123456`

---

## 3. Real 5 Partner Companies (Clients)
Never delete or corrupt these 5 partner companies; their opening balances and phone numbers are real business assets:
1. **Salim Furniture (Nayak)** — Phone: `01954223347` | Opening Due: `৳ 1,27,000`
2. **Joynav Furniture (Sonu)** — Phone: `01737504974` | Opening Due: `৳ 21,400`
3. **Bismilla Furniture (Khurshid)** — Phone: `01960392799` | Opening Due: `৳ 6,000`
4. **Razzak Furniture (Takli)** — Phone: `01838375492` | Opening Due: `৳ 5,000`
5. **Abdulla (Astana Haque)** — Phone: `01767029281` | Balance: `৳ 0`

---

## 4. Strict Business Rules
1. **Mobile Numbers:** Exactly 11 digits (`01XXXXXXXXX`) everywhere in the application (clients, users, employees, registration).
2. **11 Fixed Quick Products:** `MDF, Supper-A, Supper-B, Akij-A, Akij-B, Maya-A, Maya-B, Woodland-A, Woodland-B, Gupta-A, Gupta-B`.
3. **Master Unit Price (Per Piece):** In `/product-in` and `/product-out`, user can set a master price that applies to all selected items automatically.
4. **Daily Expenses & Workers Filtering:**
   - `👤 কর্মচারী (Employee)`: Shows ONLY permanent/monthly staff (MD. Asharaf Hossain, Sonu Vai, Rashmi, Moktar Hossain). Has `⚡ অগ্রিম (Advance)` checkbox ("বেতন থেকে কর্তনযোগ্য").
   - `👷 দিনমজুর (Daily Labor)`: Shows ONLY daily workers (MD. Alamin, RS Rashal, Eakhlakh, CNC Rashal). Has `⚡ অগ্রিম (Advance)` checkbox ("মজুরি থেকে কর্তনযোগ্য").
5. **Strict Auth Gatekeeper:**
   - `src/middleware.ts` & `src/auth.config.ts` intercepts all unauthorized requests at the edge with HTTP 307 redirect to `/login`.
   - `src/components/LayoutWrapper.tsx` ensures zero UI flash for unauthenticated visitors.
   - Server pages (`/`, `/clients`, `/loan`, etc.) strictly enforce `const session = await auth(); if (!session?.user) redirect("/login");`.
   - "Remember Me" preserves username and maintains 30-day JWT sessions.
6. **Database Connection:** Supabase Transaction Pooler (PgBouncer) on port `6543` with `?pgbouncer=true`.

---

## 5. Directory Structure & Key Files
- `src/middleware.ts` & `src/auth.config.ts`: Edge route security & session callbacks.
- `src/auth.ts`: NextAuth initialization and credential validation.
- `src/app/page.tsx`: Main Dashboard (consolidated parallel queries, BST UTC+6 time).
- `src/app/clients/`: Client ledger, profile view, photo upload, WhatsApp reminder.
- `src/app/loan/`: Due management and settlement.
- `src/app/product-in/` & `src/app/product-out/`: Stock & Invoice operations with multi-item calculator.
- `src/app/expenses/`: Daily expense tracking, labor/staff filtering, advance wage/salary tagging.
- `src/components/LayoutWrapper.tsx`: Responsive navigation, mobile drawer, instant progress bar.
- `prisma/schema.prisma`: Database schema.
