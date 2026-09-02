# Bangla ERP - Project Memory & Handover Document

## 📌 Project Overview
**Bangla ERP** is a Next.js-based Simple ERP system designed for small businesses in Bangladesh. It features a dual-role system:
- **Owner View:** Full control, can view total cash, approve/reject requests, and add personal expenses.
- **Manager View:** Can operate daily tasks (Product In/Out, Add Expenses) but critical actions require Owner approval.

**Tech Stack:**
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Backend/DB:** Prisma ORM, Supabase PostgreSQL (Cloud Database via Connection Pooling)
- **Deployment:** Vercel (Auto-deploy from GitHub master)

---

## ✅ Completed Features

### 1. Database Schema & Setup (Prisma)
- Configured SQLite database with Prisma.
- Schemas: `User`, `Client`, `Product`, `Invoice`, `InvoiceItem`, `Transaction`, `Expense`, `ExpenseCategory`, `Employee`, `Attendance`, `AuditLog`, `CorrectionRequest`, `Loan`.

### 2. Dashboard (Main Page)
- Dynamic real-time stats: Today's Sales, Purchases, Main Cash Balance, Expenses, Total Loan/Due, Monthly Profit.
- Recent Transactions preview & Low Stock Alerts.

### 3. Inventory & Sales (Product In / Out)
- Form to add new products/sales with total auto-calculation.
- Real-time stock update upon approval.

### 4. Cash Management (Main Cash)
- Ledger showing all `Transaction` records (Cash In / Cash Out).
- Automatically updates when invoices/expenses/loans are approved.

### 5. Expense Management
- Daily expenses form with categories.
- Separation of Business Expenses and Owner's Personal Expenses.

### 6. Client / Supplier Management
- Supplier/Mahajon & Customer management with Opening Balance.

### 7. HR & Payroll
- **Employees:** Permanent & Daily workers.
- **Attendance:** Daily Attendance tracker (Present, Absent, Late, Leave) with bulk mark.
- **Leave Management (`/hr/leave`):** Applied leaves automatically mark attendance as LEAVE and update payroll deductions.
- **Payroll Control (`/hr/payroll`):** Auto-calculates net salary based on basic salary minus absent days, marks paid status, records in Main Cash & Expenses, and prints payslips.

### 8. System Audit Logs (`/audit-logs`)
- Automated immutable action logging whenever invoices, expenses, transactions, or approvals happen.
- Interactive filter and search by user, action, and details.

### 9. Loan & Advances Management (`/loan`)
- Complete Give Loan & Receive Payment system linked to SQLite `Loan` model and `Transaction` ledger.
- Aggregated profiles tracking net balance (আমি পাবো / দিতে হবে) with clients, employees, and others.

### 10. Error Correction System (Correction Requests)
- `CorrectionRequestModal` for managers to request corrections instead of direct deletions.
- Owner approval board in `/approvals` with dedicated tab to approve or reject correction requests.

### 11. Printable Invoices & Vouchers
- `PrintableInvoiceModal` with clean A4/POS printable layout for Sales and Purchase invoices.
- Print payslip view for employees.

### 12. Authentication & Role System
- Real credentials provider with bcrypt password comparison.
- Interactive Login screen (`/login`) with 1-click Demo switchers (Owner / Manager).
- Registration flow (`/register`) linked to database.

### 13. Supabase PostgreSQL & Serverless Runtime Fixes
- Migrated schema to PostgreSQL via Supabase Session Pooler (port 5432).
- Enabled Row Level Security (RLS) across all public tables.
- Injected `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `AUTH_TRUST_HOST` into `next.config.ts`'s `env` object so Vercel server actions always receive the database connection string at runtime.

---

## ⏳ Next Level Upgrades (Optional Roadmap)
1. **Multi-Company Tenancy:** Full database-level tenant separation for `/select-company` and `/super-admin`.
2. **SMS Notification:** Integrate SMS gateway (e.g., Greenweb/Elitbuzz) for invoice SMS to clients.
