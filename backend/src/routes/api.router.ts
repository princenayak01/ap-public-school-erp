import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { StudentController } from '../controllers/student.controller';
import { FeeController } from '../controllers/fee.controller';
import { AttendanceController } from '../controllers/attendance.controller';
import { ExamController } from '../controllers/exam.controller';
import { DashboardController } from '../controllers/dashboard.controller';
import { ParentController } from '../controllers/parent.controller';
import { AIController } from '../controllers/ai.controller';
import { TimetableController } from '../controllers/timetable.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';
import { recordAuditLog } from '../middleware/audit.middleware';
import { Role } from '@prisma/client';
import prisma from '../prisma/client';

const router = Router();

// ==========================================
// 1. Authentication Routes
// ==========================================
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.post('/auth/send-otp', AuthController.sendOtp);
router.post('/auth/verify-otp', AuthController.verifyOtp);
router.post('/auth/register-teacher', AuthController.registerTeacher);
router.post('/auth/refresh', AuthController.refresh);
router.get('/auth/me', authenticateJWT, AuthController.me);

// Administrator User Approvals
router.get('/admin/pending-users', AuthController.getPendingUsers);
router.put('/admin/approve-user/:id', AuthController.approveUser);
router.put('/admin/reject-user/:id', AuthController.rejectUser);

// Timetable Routes
router.get('/timetable', TimetableController.getTimetable);
router.post('/timetable', TimetableController.saveSlot);
router.post('/timetable/bulk', TimetableController.bulkSave);

// ==========================================
// 2. Principal Dashboard
// ==========================================
router.get(
  '/dashboard/principal',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN),
  DashboardController.getPrincipalMetrics
);

// ==========================================
// 3. Student Management
// ==========================================
router.post(
  '/students/admission',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.TEACHER),
  recordAuditLog('STUDENT_ADMISSION', 'Student'),
  StudentController.admit
);

router.post(
  '/students/bulk-upload',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.TEACHER),
  recordAuditLog('STUDENT_BULK_UPLOAD', 'Student'),
  StudentController.bulkUpload
);

router.get(
  '/students',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.TEACHER, Role.ACCOUNTANT),
  StudentController.list
);

router.get(
  '/students/:id',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.TEACHER, Role.ACCOUNTANT),
  StudentController.getById
);

router.put(
  '/students/:id',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN),
  recordAuditLog('STUDENT_UPDATE', 'Student'),
  StudentController.update
);

router.put('/students/:id/roll-no', StudentController.updateRollNo);
router.delete('/students/:id', StudentController.delete);
router.post('/students/clear-all', StudentController.clearAll);

router.post(
  '/students/promote',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN),
  recordAuditLog('STUDENT_PROMOTION', 'Student'),
  StudentController.promote
);

// ==========================================
// 4. Fees Management
// ==========================================
router.post(
  '/fees/structure',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.ACCOUNTANT),
  FeeController.createStructure
);

router.get(
  '/fees/structures',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.ACCOUNTANT),
  FeeController.getStructures
);

router.get('/fees/invoices', FeeController.getInvoices);
router.post('/fees/create-receipt', FeeController.createReceipt);

router.post(
  '/fees/generate-invoices',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.ACCOUNTANT),
  recordAuditLog('GENERATE_FEE_INVOICES', 'FeeInvoice'),
  FeeController.generateInvoices
);

router.post(
  '/fees/pay',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.ACCOUNTANT),
  recordAuditLog('RECORD_FEE_PAYMENT', 'FeePayment'),
  FeeController.pay
);

router.post(
  '/fees/razorpay/create-order',
  authenticateJWT,
  authorizeRoles(Role.PARENT, Role.ACCOUNTANT, Role.PRINCIPAL),
  FeeController.createRazorpayOrder
);

router.post(
  '/fees/razorpay/verify',
  authenticateJWT,
  authorizeRoles(Role.PARENT, Role.ACCOUNTANT, Role.PRINCIPAL),
  recordAuditLog('RAZORPAY_PAYMENT_VERIFIED', 'FeePayment'),
  FeeController.verifyRazorpay
);

router.get('/fees/receipt/:receiptId/pdf', FeeController.downloadReceipt);

router.get(
  '/fees/analytics',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.ACCOUNTANT),
  FeeController.getAnalytics
);

// ==========================================
// 5. Attendance Management
// ==========================================
router.post(
  '/attendance/daily',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.TEACHER),
  recordAuditLog('MARK_DAILY_ATTENDANCE', 'Attendance'),
  AttendanceController.markDaily
);
router.post('/attendance/mark', authenticateJWT, AttendanceController.markDaily);

router.post(
  '/attendance/bulk-range',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN),
  recordAuditLog('BULK_ATTENDANCE_RANGE', 'Attendance'),
  AttendanceController.bulkRange
);
router.post('/attendance/date-range', authenticateJWT, AttendanceController.bulkRange);

router.get(
  '/attendance/daily-sheet',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.TEACHER),
  AttendanceController.getDailySheet
);

router.get(
  '/attendance/monthly-report',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.TEACHER),
  AttendanceController.getMonthlyReport
);

router.post(
  '/attendance/teachers',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN),
  AttendanceController.markTeachers
);

// ==========================================
// 6. Examination & Report Cards
// ==========================================
router.post(
  '/exams',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN),
  ExamController.create
);

router.post(
  '/exams/schedule-subject',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN),
  ExamController.scheduleSubject
);

router.post(
  '/exams/marks',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN, Role.TEACHER),
  recordAuditLog('ENTER_EXAM_MARKS', 'Mark'),
  ExamController.enterMarks
);

router.get('/exams/marks', ExamController.getMarks);

router.post(
  '/exams/generate-reports',
  authenticateJWT,
  authorizeRoles(Role.PRINCIPAL, Role.SCHOOL_ADMIN),
  recordAuditLog('GENERATE_REPORT_CARDS', 'ReportCard'),
  ExamController.generateReportCards
);

router.get('/exams/report-card/:reportCardId/pdf', ExamController.downloadReportCard);

// ==========================================
// 7. Parent Portal Routes
// ==========================================
router.get(
  '/parent/my-children',
  authenticateJWT,
  authorizeRoles(Role.PARENT),
  ParentController.getMyChildren
);

router.get(
  '/parent/children/:studentId',
  authenticateJWT,
  authorizeRoles(Role.PARENT),
  ParentController.getChildDetails
);

// ==========================================
// 8. AI School Assistant (RAG)
// ==========================================
router.post('/ai/ask', authenticateJWT, AIController.ask);

// ==========================================
// 9. Public School Info & Metadata
// ==========================================
router.get('/school/info', async (req, res, next) => {
  try {
    const setting = await prisma.schoolSetting.findFirst();
    const academicYears = await prisma.academicYear.findMany({ orderBy: { startDate: 'desc' } });
    const classes = await prisma.class.findMany({
      include: { sections: true, subjects: true },
      orderBy: { numericOrder: 'asc' },
    });

    return res.status(200).json({
      success: true,
      data: {
        setting: setting || {
          schoolName: 'A. P PUBLIC SCHOOL',
          board: 'CBSE',
          location: 'Jhansi, Uttar Pradesh, India',
          academicSession: '2026-27',
          classes: 'Nursery to Class 8',
          currency: 'INR (₹)',
        },
        academicYears,
        classes,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
