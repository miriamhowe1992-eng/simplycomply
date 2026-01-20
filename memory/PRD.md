# SimplyComply - UK Business Compliance Platform

**Last Updated:** January 2025

## Original Problem Statement
Create a UK-based SaaS web platform called SimplyComply that allows UK businesses to sign up, select their business type and industry, and instantly access all required compliance policies, procedures, templates, and guidance relevant to their sector.

## User Choices
- **Payment**: Stripe (monthly £29, annual £290)
- **Authentication**: JWT-based custom auth (email/password)
- **Document Generation**: Pre-built templates (no AI for MVP)
- **Notifications**: In-app only (email later)
- **Design**: Blue/teal/neutral, clean SaaS, dashboard-first

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Payments**: Stripe via emergentintegrations
- **Auth**: JWT with bcrypt

## Core Features Implemented

### Phase 1 - MVP (Completed)
- [x] User signup/login with JWT authentication
- [x] Business profile setup with industry/sector selection
- [x] **21 UK industries** with proper regulators (CQC, RCVS, HSE, Ofsted, SIA, etc.)
- [x] **Single source of truth** for industries data (shared between homepage and signup)
- [x] Industry detail modals with regulatory bodies, compliance areas, and example documents
- [x] Industry pre-selection via URL params (/signup?industry=dental)
- [x] Auto-generated compliance checklist per sector
- [x] Document library with category filtering
- [x] Stripe subscription (monthly/annual)
- [x] In-app notifications
- [x] Dashboard with compliance progress
- [x] Settings page for business profile updates

### Phase 2 - Employee Compliance (Completed)
- [x] Employee management (add, edit, delete)
- [x] Auto-generated employee requirements based on sector:
  - DBS checks (Enhanced/Basic per role)
  - Right to Work verification
  - Professional registrations (GDC, NMC, RCVS, SIA, etc.)
  - Certifications (First Aid, Food Hygiene, CSCS, etc.)
  - Training (Safeguarding, Fire Safety, Manual Handling, etc.)
  - CPD tracking
- [x] Compliance status tracking (Valid, Expiring Soon, Expired, Pending)
- [x] Overdue alerts and expiring soon warnings
- [x] Employee detail page with requirement management
- [x] Issue date, expiry date, and reference number tracking
- [x] Auto-status calculation based on expiry dates

## Supported Sectors (37 total)
### Healthcare (8)
- Dental Practice (CQC)
- Healthcare Provider (CQC)
- Care Home (CQC)
- Veterinary Practice (RCVS)
- Pharmacy (GPhC)
- Optician (GOC)
- Physiotherapy (HCPC)
- Mental Health Services (CQC)

### Construction (4)
- Construction (HSE)
- Electrical Contractor (HSE/NICEIC)
- Plumbing & Heating (HSE/Gas Safe)
- Roofing (HSE)

### Hospitality (5)
- Hotel/B&B (EHO)
- Restaurant/Cafe (EHO/FSA)
- Pub/Bar (EHO/Licensing)
- Catering Services (EHO/FSA)
- Takeaway (EHO/FSA)

### Retail & Services (4)
- Retail Shop (Trading Standards)
- Hair/Beauty Salon (EHO)
- Tattoo Studio (EHO)
- Gym/Fitness Centre (HSE)

### Education (3)
- School/College (Ofsted)
- Nursery/Childcare (Ofsted)
- Tuition Centre (Ofsted)

### Professional Services (5)
- Office (HSE/ICO)
- Accountancy (ICAEW/ACCA)
- Legal Practice (SRA)
- Estate Agency (Trading Standards)
- Recruitment Agency (ICO/HMRC)

### Other (8)
- Cleaning Services (HSE)
- Security Services (SIA)
- Transport/Logistics (DVSA)
- Motor Trade (Trading Standards)
- Agriculture (HSE)
- Manufacturing (HSE)
- Warehouse (HSE)
- Charity (Charity Commission)

## P0/P1/P2 Features Remaining

### P0 - Critical
- [ ] Actual document file uploads/downloads
- [ ] Email notifications for expiring items
- [ ] Password reset functionality

### P1 - Important
- [ ] Version control for documents
- [ ] Bulk employee import (CSV)
- [ ] Multiple user roles per business
- [ ] Admin panel for SimplyComply staff
- [ ] Google OAuth login

### P2 - Nice to Have
- [ ] AI-powered document customisation
- [ ] Mobile app (React Native)
- [ ] Integration with HR systems
- [ ] Automated compliance reminders via SMS
- [ ] Multi-tenancy for franchises

## API Endpoints
- `/api/auth/*` - Authentication
- `/api/business` - Business CRUD
- `/api/checklist` - Compliance checklist
- `/api/documents` - Document library
- `/api/employees` - Employee management
- `/api/employees/{id}/requirements` - Employee compliance
- `/api/employees/compliance/overview` - Compliance summary
- `/api/subscription/*` - Stripe payments
- `/api/notifications` - In-app notifications
- `/api/reference/*` - Sectors, nations, sizes, categories

## Technical Notes
- Hot reload enabled for both frontend and backend
- MongoDB collections: users, businesses, checklists, employees, employee_requirements, notifications, payment_transactions
- Employee requirements auto-calculate status based on expiry dates
- 30-day warning window for "expiring soon" status
