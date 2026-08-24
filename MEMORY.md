# Bangla ERP - Project Memory & Handover Document

## 📌 Project Overview
**Bangla ERP** is a Next.js-based Simple ERP system designed for small businesses in Bangladesh. It features a dual-role system:
- **Owner View:** Full control, can view total cash, approve/reject requests, and add personal expenses.
- **Manager View:** Can operate the daily tasks (Product In/Out, Add Expenses) but critical actions require Owner approval.

**Tech Stack:**
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Backend/DB:** Prisma ORM, SQLite (local `dev.db` pushed to Vercel via `/tmp` workaround)
- **Deployment:** Vercel

---

## ✅ Completed Features (What we did from Start to Now)

### 1. Database Schema & Setup (Prisma)
- Configured SQLite database with Prisma.
- Created schemas for `User`, `Client` (Supplier/Customer), `Product`, `Invoice` (In/Out), `InvoiceItem`, `Transaction` (Main Cash), `Expense`, `ExpenseCategory`, `Employee`, `Attendance`, `AuditLog`, `CorrectionRequest`.
- Pushed Prisma schema to DB and created a seeding script (`seed.js`) to populate dummy data.

### 2. Dashboard (Main Page)
- Dynamic dashboard with real-time stats: Today's Sales, Today's Purchases, Main Cash Balance, Daily Expenses, Total Loan/Due, and Monthly Profit.
- Recent Transactions preview.
- Low Stock Alert (Products with stock < 10).
- Pending Approvals Alert for Owner.

### 3. Inventory & Sales (Product In / Out)
- Form to add new products/sales with total auto-calculation.
- Real-time stock update upon approval.
- NextAuth session integration to detect user role. (Owner actions auto-approve, Manager actions go to Pending).

### 4. Cash Management (Main Cash)
- Ledger showing all `Transaction` records (Cash In / Cash Out).
- Automatically updates when invoices/expenses are approved.

### 5. Expense Management
- Daily expenses form with categories.
- Separation of **Business Expenses** and **Owner's Personal Expenses** (Hidden from Manager).

### 6. Client / Supplier Management
- Replaced "Customer & Supplier" concept heavily with "Supplier/Mahajon" per user request.
- Ability to add new suppliers with an Opening Balance (Previous Due).

### 7. HR & Payroll
- **Employees:** Added UI and logic to add Permanent/Daily workers.
- **Salary:** Implemented Salary Payment which hooks into Expenses and Main Cash.
- **Attendance:** Created Daily Attendance tracker (Present, Absent, Late, Leave) with one-click bulk mark feature.

### 8. Approval System (Owner Controls)
- Dashboard for Owner to review Manager's actions.
- Supports approving/rejecting `Invoice` (Sales/Purchases), `Expense`, and `Transaction`.
- Nested logic implemented: Approving an invoice accurately adjusts Product Stock, Client Balance, and creates Main Cash Transactions.

### 9. Vercel Deployment Fixes
- Added a workaround in `lib/prisma.ts` to copy `dev.db` to `/tmp` in production to bypass Vercel's read-only file system for the SQLite database prototype.
- Fixed TypeScript encoding issues (UTF-16LE characters) from PowerShell file appends.
- Fixed Static Prerendering (Build) issues by forcing `export const dynamic = "force-dynamic";` on data-fetching pages.

---

## ⏳ Pending Features (What is left for Next Time)

1. **Audit Logs (কাজের হিস্ট্রি):** 
   - Track every action performed by the Manager (e.g., "Manager added an expense of 500").
   - Create the `/audit-logs` UI.

2. **Error Correction System (Correction Requests):**
   - If a manager makes a mistake, they cannot edit/delete directly. They must send a `CorrectionRequest` to the Owner.
   - Owner approves the edit/deletion.

3. **Super Admin & Login System:**
   - Fully implement the NextAuth custom credential login logic (currently UI is there, but need strict role-based redirects).
   - Super Admin dashboard (`/super-admin`) to suspend accounts, manage expiry dates, and handle billing.

4. **Advanced HR Features:**
   - Leave Management (ছুটি ব্যবস্থাপনা).
   - Payroll Control / Salary slips (বেতন ও পে-রোল).
   - HR Documents (নথিপত্র).

5. **Loan Management (লোন):**
   - Track external loans (Banks, Friends) outside of Supplier credits.

6. **Printing & PDF Export:**
   - Add printing capabilities for Invoices, Salary Slips, and Attendance Sheets.

---

## 💾 System & Conversation State
- All code is saved on the user's local PC inside the `d:\Bangla ERP\web` directory.
- All code is successfully pushed to the linked GitHub repository (`origin master`).
- Vercel is automatically deploying the `master` branch.
- **Next Session Start Point:** Review this `MEMORY.md` file to instantly resume context. The likely first task will be **Audit Logs** or fully implementing the **Login System**.
