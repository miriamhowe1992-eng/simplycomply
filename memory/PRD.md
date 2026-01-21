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
- [x] **30 UK industries** with proper regulators
- [x] **Single source of truth** for industries data (`/app/frontend/src/data/industries.js`)
- [x] Comprehensive industry detail modals with all sections (see Phase 3 below)
- [x] "View all industries" modal grouped by category
- [x] Industry pre-selection via URL params (/signup?industry=dental)
- [x] Auto-generated compliance checklist per sector
- [x] Document library with category filtering
- [x] Stripe subscription (monthly/annual)
- [x] In-app notifications
- [x] Dashboard with compliance progress
- [x] Settings page for business profile updates

### Phase 2 - Employee Compliance (Completed)
- [x] Employee management (add, edit, delete)
- [x] Auto-generated employee requirements based on sector
- [x] Compliance status tracking (Valid, Expiring Soon, Expired, Pending)
- [x] Overdue alerts and expiring soon warnings
- [x] Employee detail page with requirement management

### Phase 3 - Enhanced Industries System (Completed - Jan 2025)
- [x] Added new "Personal & Body Art Services" category with 5 industries:
  - Tattoo Artist / Studio (high-detail reference)
  - Piercing Studio
  - Microblading / PMU
  - Aesthetics Clinic (non-surgical cosmetic)
  - Barber / Hairdresser
- [x] Enhanced data model with:
  - COMPLIANCE_AREAS (20 areas)
  - RISK_ASSESSMENTS (20 types)
  - AUDITS_CHECKS (18 types)
  - REGULATORY_BODIES (17 bodies)
  - PLATFORM_DISCLAIMERS
- [x] Each industry modal now displays:
  - Overview description
  - "Who is this for?" list
  - Regulatory Bodies (with external links)
  - Compliance Areas Covered (tags)
  - Required Risk Assessments
  - Audits & Ongoing Checks
  - Example Documents & Templates
  - Practical Requirements
  - Regional Variations note (where applicable)
  - Industry-specific Disclaimer
  - Platform Disclaimer
- [x] Footer disclaimer on landing page
- [x] Signup page disclaimer

## Supported Industries (30 total)

### Personal & Body Art Services (5) - NEW
- Tattoo Artist / Studio (Local Authority, HSE, ICO)
- Piercing Studio (Local Authority, HSE, ICO)
- Microblading / PMU (Local Authority, HSE, ICO)
- Aesthetics Clinic (Local Authority, HSE, ICO, JCCP)
- Barber / Hairdresser (Local Authority, HSE, ICO)

### Personal & Wellbeing Services (5)
- Massage Therapist (Local Authority, HSE, ICO)
- Beauty Therapist (Local Authority, HSE, ICO)
- Nail Technician (Local Authority, HSE, ICO)
- Holistic Therapist (Local Authority, HSE, ICO)
- Yoga / Pilates Instructor (HSE, ICO)

### Healthcare (5)
- Dental Practice (CQC, GDC, HSE, ICO)
- Healthcare Provider (CQC, HSE, ICO)
- Care Home (CQC, HSE, ICO)
- Veterinary Practice (RCVS, HSE, ICO)
- Pharmacy (GPhC, HSE, ICO)

### Education (2)
- Nursery & Childcare (Ofsted, HSE, ICO)
- School & College (Ofsted, HSE, ICO)

### Construction (3)
- Construction (HSE)
- Electrical Contractor (HSE, NICEIC)
- Plumbing & Heating (HSE, Gas Safe)

### Hospitality (3)
- Hotel & Hospitality (Local Authority, HSE, ICO)
- Restaurant & Café (Local Authority, FSA, HSE)
- Takeaway & Fast Food (Local Authority, FSA, HSE)

### Retail (1)
- Retail Shop (Trading Standards, HSE, ICO)

### Services (2)
- Cleaning Services (HSE, ICO)
- Security Services (SIA, HSE, ICO)

### Leisure (1)
- Gym & Fitness (HSE, ICO)

### Professional Services (1)
- Office & Professional Services (HSE, ICO)

### Third Sector (1)
- Charity & Non-Profit (Charity Commission, HSE, ICO)

### Automotive (1)
- Motor Trade & Garage (Trading Standards, HSE, ICO)

## Platform Disclaimers

**Industry Modal:**
> SimplyComply provides guidance, templates, and supporting documentation. Responsibility for ensuring compliance remains with the business owner and may vary by location and services offered.

**Signup & Footer:**
> Requirements can vary by local authority and UK nation. SimplyComply assists with compliance documentation but does not guarantee regulatory approval or inspection outcomes.

**Regional Note (shown where applicable):**
> Requirements may vary by local authority and UK nation (England, Wales, Scotland, Northern Ireland).

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
- Industries data is centralized in `/app/frontend/src/data/industries.js` - single source of truth
- New helper functions: `getRiskAssessmentsForIndustry()`, `getAuditsChecksForIndustry()`
