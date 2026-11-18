# A. P PUBLIC SCHOOL, JHANSI
## Complete School ERP & Android Application — Executive Presentation

---

### SLIDE 1: TITLE SLIDE
**Title**: Comprehensive School ERP & Android Application  
**Institution**: A. P PUBLIC SCHOOL, Jhansi (CBSE)  
**Academic Session**: 2026–27  
**Presenter**: Senior Software Architect & Engineering Team  
**Platforms**: Responsive Web Portal (Next.js) + Android Application (Flutter)  

---

### SLIDE 2: INSTITUTION & PROJECT OBJECTIVES
- **School**: A. P PUBLIC SCHOOL, Baruasagar, Jhansi, Uttar Pradesh
- **Affiliation**: Central Board of Secondary Education (CBSE), New Delhi
- **Coverage**: Classes Nursery to Class 8 (11 Academic Levels, 22 Sections)
- **Goal**: One unified, secure school management ecosystem connecting the Principal, School Administrators, Teachers, Accountants, and Parents to a single real-time database.

---

### SLIDE 3: MODERN TECHNOLOGY STACK
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js REST API, Zod Schema Validation
- **Database**: PostgreSQL with Prisma ORM (24 Normalized Relational Models)
- **Security**: JWT Access & Refresh Token Rotation, Salted Bcrypt Hashing, Role-Based Access Control (RBAC)
- **Mobile**: Flutter 3 & Dart Android Application
- **Payment Gateway**: Razorpay with Server-Side HMAC-SHA256 Webhook Verification
- **Communications & AI**: WhatsApp Business API + RAG-Powered AI School Assistant

---

### SLIDE 4: USER ROLES & ACCESS HIERARCHY
1. **Principal / Super Admin**: Complete administrative oversight, live KPI dashboards, fee generation, staff & student management.
2. **School Admin**: Student admissions, promotion engine, event scheduling.
3. **Teacher**: Section-wise attendance marking, examination marks entry.
4. **Accountant**: Fee structures, offline/online collections, receipts, ledger auditing.
5. **Parent / Guardian**: Multi-child profile switcher, real-time attendance tracking, online Razorpay fee payment, CBSE report card downloads.

---

### SLIDE 5: PRINCIPAL EXECUTIVE DASHBOARD
- **Real-Time KPIs**: Active Students (342), Faculty (24), Parents (280), Today's Attendance Rate (93.4%).
- **Financial Health**: Total Billed (₹5,46,000), Collected (₹4,88,000), Dues (₹58,000) with 89.4% collection efficiency.
- **Interactive Visual Graphics**: Class-wise student distribution across all 11 grades.
- **Audit Feeds**: Recent admissions, payment receipts, and upcoming CBSE exams.
- **Indian Standard Time Widget**: Live digital clock and academic session indicator.

---

### SLIDE 6: STUDENT MANAGEMENT LIFECYCLE
- **Digital Admission**: Generates unique identifiers (`APPS/2026/001` to `APPS/2026/342`).
- **Family Accounts**: Automated parent account generation and multi-child linkage.
- **Directory & Filters**: Instant search by student name, roll number, father, or grade.
- **Batch Promotion**: One-click academic advancement across grade levels.

---

### SLIDE 7: FEES MANAGEMENT & RAZORPAY INTEGRATION
- **Structured Invoicing**: Base tuition, admission, annual charges, and configurable concessions.
- **Multi-Channel Payments**: Online Razorpay (Cards, UPI, Net Banking) and offline counter receipts (Cash, Cheque).
- **Payment Verification**: Server-side HMAC-SHA256 signature verification preventing fraudulent or tampered transactions.
- **Automated Duplicate Prevention**: Rejects duplicate payment IDs at the database transaction level.
- **PDF Fee Receipts**: Professional PDFKit receipts generated and archived with official stamp and signatures.

---

### SLIDE 8: ATTENDANCE & BULK SAVE ENGINE
- **Daily Classroom Sheet**: Quick toggles (**Mark All Present**, **Mark All Absent**, **Mark All Late**).
- **Save Data for All Days**: Date range bulk generator to record attendance across weeks or entire months in one action (skips Sundays automatically).
- **Compliance Tracking**: Enforces CBSE 75% minimum attendance requirement with color-coded warning badges.

---

### SLIDE 9: CBSE 9-POINT EXAMINATION ENGINE
- **Exam Scheduling**: Periodic Assessments, Mid-Term, and Annual exams.
- **Marks Validation**: Strict checks ensuring marks entered never exceed maximum marks.
- **CBSE Grading Rules**:
  - `A1`: 91–100% | `A2`: 81–90% | `B1`: 71–80% | `B2`: 61–70%
  - `C1`: 51–60% | `C2`: 41–50% | `D`: 33–40% | `E`: Below 33%
- **CBSE Report Card PDFs**: Official report card with marks table, attendance, and Principal remarks.

---

### SLIDE 10: FLUTTER ANDROID APPLICATION
- **Single Backend**: Connects to the exact same REST API and PostgreSQL database.
- **Parent Experience**: Seamless child switching, fee payment, and digital report card access on mobile phones.
- **Responsive Theme**: Native Android layout matching the Navy Blue & Teal aesthetic.

---

### SLIDE 11: QUALITY ASSURANCE & VERIFICATION
- **100% Automated Test Pass Rate**: 7 core test suites verified.
- **Zero Cross-Parent Leakage**: Parents are strictly restricted to their own linked children.
- **Enterprise Ready**: Full documentation, setup instructions, and deployment configurations supplied.

---

### SLIDE 12: CONCLUSION & NEXT STEPS
- **Ready for Deployment**: Vercel (Frontend), Node/Express (Backend), Managed PostgreSQL, Google Play Store (Android).
- **Delivered**: Source code, migrations, seed data, API documentation, manuals, presentation, and final report.
- **Contact**: A. P PUBLIC SCHOOL, Baruasagar, Jhansi (UP) • Phone: +91-6306262479 • Email: apps.jhansi@gmail.com
