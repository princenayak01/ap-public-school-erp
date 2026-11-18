# A. P PUBLIC SCHOOL, JHANSI (CBSE)
## Setup, Build & Production Deployment Guide

### Prerequisites
- **Node.js**: v18+ or v20+ LTS (Tested on Node v24 LTS)
- **Database**: PostgreSQL 14+ (Supabase, Neon, Railway, AWS RDS, or local)
- **Mobile SDK**: Flutter 3.16+ & Dart 3.0+
- **Package Manager**: npm or yarn

---

### 1. Backend Setup & Run

1. Navigate to the backend directory:
   ```bash
   cd ap_public_school_erp/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables in `.env`:
   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL="postgresql://user:password@db_host:5432/ap_public_school_erp?sslmode=require"
   JWT_ACCESS_SECRET="your_strong_jwt_access_secret_2026"
   JWT_REFRESH_SECRET="your_strong_jwt_refresh_secret_2026"
   RAZORPAY_KEY_ID="rzp_live_your_key_id"
   RAZORPAY_KEY_SECRET="your_live_key_secret"
   ```
4. Push Prisma database schema and run seed data:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```
5. Run the server:
   ```bash
   # Development
   npm run dev

   # Production Build & Start
   npm run build
   npm start
   ```

---

### 2. Frontend (Next.js) Setup & Vercel Deployment

1. Navigate to the frontend directory:
   ```bash
   cd ap_public_school_erp/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Deploying to Vercel**:
   - Push repository to GitHub/GitLab.
   - Import project into Vercel dashboard.
   - Set Root Directory to `frontend`.
   - Add Environment Variable:
     `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1`
   - Deploy.

---

### 3. Flutter Android App Build & Deployment

1. Navigate to the mobile app directory:
   ```bash
   cd ap_public_school_erp/android_app
   ```
2. Get packages:
   ```bash
   flutter pub get
   ```
3. Run on Android emulator or connected device:
   ```bash
   flutter run
   ```
4. Build Production Release APK:
   ```bash
   flutter build apk --release
   ```
   Output: `build/app/outputs/flutter-apk/app-release.apk`

5. Build Google Play Store App Bundle (AAB):
   ```bash
   flutter build appbundle --release
   ```

---

### 4. Running the Automated Test Suite

To verify all security hashing, JWT strategy, CBSE grading rules, and Razorpay signature verification:
```bash
cd ap_public_school_erp/backend
npm test
```
Result: `ALL 7 TEST SUITES PASSED (0 FAILURES)`.
