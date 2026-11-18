# A. P PUBLIC SCHOOL, JHANSI (CBSE)
## REST API Specification & Developer Documentation
**Academic Session**: 2026–27  
**Base URL**: `http://localhost:5000/api/v1` (Development) / `https://api.appsjhansi.edu.in/api/v1` (Production)  
**Authentication Strategy**: Bearer JWT Access Token + HttpOnly Refresh Token  

---

### 1. Authentication Endpoints

#### `POST /auth/login`
Authenticate user with email or mobile phone and password.
- **Request Body**:
  ```json
  {
    "emailOrPhone": "principal@appsjhansi.edu.in",
    "password": "admin123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": "c8b417c8-...",
        "name": "Principal Prince Sharma",
        "email": "principal@appsjhansi.edu.in",
        "role": "PRINCIPAL"
      }
    }
  }
  ```

#### `POST /auth/refresh`
Generate a new access token using a valid refresh token.
- **Request Body**:
  ```json
  { "refreshToken": "eyJhbGciOiJIUzI1NiIs..." }
  ```

---

### 2. Principal Dashboard

#### `GET /dashboard/principal`
- **Headers**: `Authorization: Bearer <TOKEN>` (Roles: `PRINCIPAL`, `SCHOOL_ADMIN`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "kpis": {
        "totalStudents": 342,
        "totalTeachers": 24,
        "totalParents": 280,
        "totalAdmins": 4,
        "presentToday": 312,
        "absentToday": 22,
        "attendanceRate": 93.4,
        "totalBilled": 546000,
        "totalCollected": 488000,
        "totalPending": 58000,
        "collectionRate": "89.4"
      },
      "classDistribution": [
        { "className": "Class 1", "studentCount": 35 }
      ],
      "recentAdmissions": [...],
      "recentPayments": [...],
      "upcomingExams": [...]
    }
  }
  ```

---

### 3. Student Management

#### `POST /students/admission`
Enroll a new student and link/create parent record.
- **Headers**: `Authorization: Bearer <TOKEN>` (Roles: `PRINCIPAL`, `SCHOOL_ADMIN`)
- **Request Body**:
  ```json
  {
    "admissionNo": "APPS/2026/009",
    "firstName": "Yash",
    "lastName": "Mishra",
    "dob": "2018-06-12",
    "gender": "MALE",
    "classId": "cls-uuid",
    "sectionId": "sec-uuid",
    "fatherName": "Sunil Mishra",
    "fatherPhone": "919876543230",
    "motherName": "Kavita Mishra",
    "parentEmail": "sunil.mishra@gmail.com",
    "address": "Baruasagar, Jhansi"
  }
  ```

---

### 4. Fees Management & Razorpay

#### `POST /fees/generate-invoices`
Generate monthly fee invoices for all active students with concessions.
- **Request Body**:
  ```json
  {
    "academicYearId": "ay-uuid",
    "month": "April 2026",
    "dueDate": "2026-04-10"
  }
  ```

#### `POST /fees/razorpay/create-order`
Create Razorpay order for online fee payment.
- **Request Body**: `{ "invoiceId": "inv-uuid", "amount": 1400 }`

#### `POST /fees/razorpay/verify`
Server-side HMAC-SHA256 signature verification and fee receipt generation.
- **Request Body**:
  ```json
  {
    "invoiceId": "inv-uuid",
    "razorpayOrderId": "order_xxx",
    "razorpayPaymentId": "pay_xxx",
    "razorpaySignature": "sha256_hex_signature"
  }
  ```

#### `GET /fees/receipt/:receiptId/pdf`
Streams official PDF Fee Receipt.

---

### 5. Attendance Management

#### `POST /attendance/daily`
Record daily student attendance for a section.
- **Request Body**:
  ```json
  {
    "sectionId": "sec-uuid",
    "date": "2026-11-18",
    "records": [
      { "studentId": "st-uuid-1", "status": "PRESENT" },
      { "studentId": "st-uuid-2", "status": "ABSENT", "remark": "Sick Leave" }
    ]
  }
  ```

#### `POST /attendance/bulk-range`
Multi-day date range generator for saving attendance across entire months.

---

### 6. Examination Management

#### `POST /exams/marks`
Record subject marks with validation against max marks.

#### `POST /exams/generate-reports`
Compute total marks, percentages, ranks, and CBSE 9-point grades (`A1` to `E`).

#### `GET /exams/report-card/:reportCardId/pdf`
Streams official CBSE Report Card PDF.

---

### 7. Parent Portal & Privacy

#### `GET /parent/my-children`
Returns only students verified under the authenticated parent account.

#### `GET /parent/children/:studentId`
Returns student attendance, unpaid invoices, and report cards with strict parent isolation.
