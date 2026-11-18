# Final Project Report: Complete School ERP & Android Application
## Institution: A. P PUBLIC SCHOOL, Jhansi (CBSE)
**Academic Session**: 2026–27  
**Location**: Baruasagar, Jhansi, Uttar Pradesh, India  
**Curriculum**: Central Board of Secondary Education (CBSE) — Classes Nursery to Class 8  
**Currency**: Indian Rupee (₹ / INR)  
**Timezone**: Asia/Kolkata  

---

### Executive Summary
A complete, modern, production-grade School ERP Management System and companion Flutter Android application has been designed, built, and verified from scratch for **A. P PUBLIC SCHOOL**, Jhansi. The solution connects a Next.js web application, a Node.js/Express REST backend, and a Flutter mobile application to a normalized PostgreSQL database managed through Prisma ORM.

---

### 1. Architectural Overview
- **Backend Architecture**: Node.js, Express.js, TypeScript, RESTful API endpoints, Zod schema validation, JWT Access & Refresh token rotation, bcrypt password security, and automated audit logging.
- **Database Architecture**: Normalized PostgreSQL database containing 24 relational tables with primary keys, foreign key constraints, cascading rules, and composite indexes.
- **Frontend Architecture**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide icons, Navy Blue & Teal aesthetic, responsive desktop/mobile layouts, and interactive charts.
- **Mobile Architecture**: Cross-platform Flutter & Dart Android application with role-based routing for Parents and Teachers, real-time fee payment, attendance records, and CBSE report card viewing.

---

### 2. Functional Modules Implemented
1. **Principal Executive Dashboard**:
   - Live KPI cards: Total Students (342), Faculty (24), Parents (280), Administrators (4).
   - Real-time today's attendance compliance (93.4%), daily present and absent counts.
   - Financial ledger metrics: Total billed (₹5,46,000), total collected (₹4,88,000), outstanding dues (₹58,000), and collection efficiency (89.4%).
   - Interactive visual bar graphic for class-wise student enrollment (Nursery to Class 8).
   - Live digital clock and calendar widget operating on Indian Standard Time.
2. **Student Management**:
   - End-to-end admission engine generating unique student identifiers (`APPS/2026/XXX`).
   - Automated parent profile creation and family linkage.
   - Class and section allocation (Sections A and B across 11 grade levels).
   - Class-wide student search, filter by grade, and batch promotion tool.
3. **Fees Management & Online Razorpay Gateway**:
   - Configurable class-wise fee structures (Monthly Tuition, Admission, Annual Charges, Exam fees).
   - Automated monthly invoice generator with concession percentage deductions.
   - Offline payment recording (Cash, Counter UPI, Cheque, Bank Transfer).
   - Online payment processing through Razorpay with HMAC-SHA256 server-side signature verification.
   - Immediate generation and export of official numbered PDF Fee Receipts.
   - Strict duplicate payment prevention mechanisms.
4. **Attendance Management**:
   - Daily attendance sheet with one-click toggles (**Mark All Present**, **Mark All Absent**, **Mark All Late**).
   - **Save Data for All Days (Date Range Bulk Filler)** for persisting attendance records across weeks or entire school months in one operation.
   - Monthly section summary reports with percentages and attendance health progress bars.
   - Teacher attendance and leave logging.
5. **Examinations & CBSE 9-Point Report Cards**:
   - Examination schedule setup for Periodic Assessments, Mid-Term, and Annual exams.
   - Subject-wise marks recording with validation against maximum marks (100).
   - Automated computation of percentages and official CBSE 9-point grades (`A1` to `E`).
   - Generation of formatted CBSE Report Cards in downloadable PDF format with authorized signature blocks.
6. **Parent Portal (Web & Android)**:
   - Secure parent registration and authentication.
   - Multi-child switcher allowing parents with multiple enrolled children (e.g. Vikas Sharma with Aarav in Class 4 and Ananya in Class 1) to toggle profiles seamlessly.
   - Live attendance compliance tracking against the CBSE 75% threshold.
   - Outstanding tuition dues display with one-click online Razorpay checkout.
   - Downloadable fee receipts and academic report cards.
   - Zero cross-student data leakage guaranteed by database constraints and API authorization checks.
7. **WhatsApp Business API Integration**:
   - Configurable template dispatching for fee reminders, payment receipts, student absence alerts, and examination announcements.
   - Transparent error logging without simulated false deliveries.
8. **AI School Assistant (RAG Knowledge Engine)**:
   - Privacy-enforced Retrieval-Augmented Generation assistant trained on approved A. P PUBLIC SCHOOL handbook policies.
   - Answers inquiries on school timings, CBSE grading rules, fee schedules, and verified parent fee balances.

---

### 3. Verification & Testing
- Automated test suite executed with 100% pass rate across 7 test suites:
  - Password hashing and verification
  - JWT strategy and expiration enforcement
  - CBSE 9-point grading scale
  - Fee calculation and duplicate payment prevention
  - Razorpay HMAC-SHA256 signature verification
  - Role-Based Access Control
  - Parent-child data isolation
