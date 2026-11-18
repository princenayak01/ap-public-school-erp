import prisma from './client';
import { hashPassword } from '../utils/password';
import { Role, Gender, StudentStatus, AttendanceStatus, FeeFrequency, InvoiceStatus, PaymentMode, PaymentStatus, ExamTerm } from '@prisma/client';

export async function main() {
  console.log('🌱 Starting Database Seeding for A. P PUBLIC SCHOOL, Jhansi...');

  // 1. School Settings
  const schoolSetting = await prisma.schoolSetting.upsert({
    where: { id: 'apps-setting-singleton' },
    update: {
      schoolName: 'A. P PUBLIC SCHOOL',
      board: 'CBSE',
      affiliationNo: 'CBSE-2130000',
      address: 'Behind P.N.B. Bank, Naya Bus Stand Road, Baruasagar, Jhansi (UP)',
      phone: '+91-6306262479',
      email: 'apps.jhansi@gmail.com',
      currentAcademicYear: '2026-27',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata',
    },
    create: {
      id: 'apps-setting-singleton',
      schoolName: 'A. P PUBLIC SCHOOL',
      board: 'CBSE',
      affiliationNo: 'CBSE-2130000',
      address: 'Behind P.N.B. Bank, Naya Bus Stand Road, Baruasagar, Jhansi (UP)',
      phone: '+91-6306262479',
      email: 'apps.jhansi@gmail.com',
      currentAcademicYear: '2026-27',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata',
    },
  });
  console.log('✓ School Settings Seeded');

  // 2. Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: { name: '2026-27' },
    update: { isCurrent: true },
    create: {
      name: '2026-27',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      isCurrent: true,
    },
  });
  console.log('✓ Academic Year Seeded: 2026-27');

  // 3. Classes (Nursery to Class 8)
  const classDefs = [
    { name: 'Nursery', code: 'NUR', order: 0 },
    { name: 'LKG', code: 'LKG', order: 1 },
    { name: 'UKG', code: 'UKG', order: 2 },
    { name: 'Class 1', code: 'CLS-1', order: 3 },
    { name: 'Class 2', code: 'CLS-2', order: 4 },
    { name: 'Class 3', code: 'CLS-3', order: 5 },
    { name: 'Class 4', code: 'CLS-4', order: 6 },
    { name: 'Class 5', code: 'CLS-5', order: 7 },
    { name: 'Class 6', code: 'CLS-6', order: 8 },
    { name: 'Class 7', code: 'CLS-7', order: 9 },
    { name: 'Class 8', code: 'CLS-8', order: 10 },
  ];

  const classMap = new Map<string, string>();
  const sectionMap = new Map<string, string>();

  for (const c of classDefs) {
    const cls = await prisma.class.upsert({
      where: { code: c.code },
      update: { name: c.name, numericOrder: c.order, academicYearId: academicYear.id },
      create: {
        name: c.name,
        code: c.code,
        numericOrder: c.order,
        academicYearId: academicYear.id,
      },
    });
    classMap.set(c.name, cls.id);

    // Create Sections A and B
    for (const secName of ['A', 'B']) {
      const sec = await prisma.section.upsert({
        where: { classId_name: { classId: cls.id, name: secName } },
        update: { roomNo: `Room-${c.order * 2 + (secName === 'A' ? 1 : 2)}` },
        create: {
          classId: cls.id,
          name: secName,
          roomNo: `Room-${c.order * 2 + (secName === 'A' ? 1 : 2)}`,
        },
      });
      sectionMap.set(`${c.name}-${secName}`, sec.id);
    }
  }
  console.log('✓ 11 Classes (Nursery to Class 8) & 22 Sections Seeded');

  // 4. Subjects
  const coreSubjects = ['English', 'Mathematics', 'Hindi', 'Environmental Studies', 'Science', 'Social Studies', 'Computer Science'];
  for (const [clsName, clsId] of classMap.entries()) {
    for (const subj of coreSubjects) {
      const code = `${subj.substring(0, 3).toUpperCase()}-${clsName.replace(/\s+/g, '')}`;
      await prisma.subject.upsert({
        where: { classId_code: { classId: clsId, code } },
        update: { name: subj },
        create: {
          classId: clsId,
          name: subj,
          code,
        },
      });
    }
  }
  console.log('✓ CBSE Subjects Seeded');

  // 5. Default Users & Roles
  const adminPass = await hashPassword('admin123');
  const teacherPass = await hashPassword('teacher123');
  const parentPass = await hashPassword('parent123');
  const accountantPass = await hashPassword('account123');

  // Principal / Super Admin
  const principalUser = await prisma.user.upsert({
    where: { email: 'principal@appsjhansi.edu.in' },
    update: { name: 'Principal Prince Sharma', role: Role.PRINCIPAL, passwordHash: adminPass },
    create: {
      email: 'principal@appsjhansi.edu.in',
      phone: '916306262479',
      name: 'Principal Prince Sharma',
      role: Role.PRINCIPAL,
      passwordHash: adminPass,
    },
  });

  // School Admin
  await prisma.user.upsert({
    where: { email: 'admin@appsjhansi.edu.in' },
    update: { name: 'Rajesh Verma', role: Role.SCHOOL_ADMIN, passwordHash: adminPass },
    create: {
      email: 'admin@appsjhansi.edu.in',
      phone: '919876543210',
      name: 'Rajesh Verma',
      role: Role.SCHOOL_ADMIN,
      passwordHash: adminPass,
    },
  });

  // Accountant
  await prisma.user.upsert({
    where: { email: 'accountant@appsjhansi.edu.in' },
    update: { name: 'Sunil Gupta', role: Role.ACCOUNTANT, passwordHash: accountantPass },
    create: {
      email: 'accountant@appsjhansi.edu.in',
      phone: '919876543211',
      name: 'Sunil Gupta',
      role: Role.ACCOUNTANT,
      passwordHash: accountantPass,
    },
  });

  // Teachers
  const teacher1User = await prisma.user.upsert({
    where: { email: 'teacher.neha@appsjhansi.edu.in' },
    update: { name: 'Neha Tiwari', role: Role.TEACHER, passwordHash: teacherPass },
    create: {
      email: 'teacher.neha@appsjhansi.edu.in',
      phone: '919876543212',
      name: 'Neha Tiwari',
      role: Role.TEACHER,
      passwordHash: teacherPass,
    },
  });

  const teacher1 = await prisma.teacher.upsert({
    where: { userId: teacher1User.id },
    update: { employeeId: 'EMP-001', qualification: 'M.Sc (Maths), B.Ed' },
    create: {
      userId: teacher1User.id,
      employeeId: 'EMP-001',
      qualification: 'M.Sc (Maths), B.Ed',
      designation: 'TGT Mathematics',
      specialization: 'Mathematics & Science',
    },
  });

  const teacher2User = await prisma.user.upsert({
    where: { email: 'teacher.amit@appsjhansi.edu.in' },
    update: { name: 'Amit Kumar', role: Role.TEACHER, passwordHash: teacherPass },
    create: {
      email: 'teacher.amit@appsjhansi.edu.in',
      phone: '919876543213',
      name: 'Amit Kumar',
      role: Role.TEACHER,
      passwordHash: teacherPass,
    },
  });

  await prisma.teacher.upsert({
    where: { userId: teacher2User.id },
    update: { employeeId: 'EMP-002', qualification: 'M.A (English), B.Ed' },
    create: {
      userId: teacher2User.id,
      employeeId: 'EMP-002',
      qualification: 'M.A (English), B.Ed',
      designation: 'TGT English',
      specialization: 'English & Social Studies',
    },
  });
  console.log('✓ Principal, Admin, Accountant, and Teachers Seeded');

  // Parents
  const parent1User = await prisma.user.upsert({
    where: { email: 'parent.sharma@gmail.com' },
    update: { name: 'Vikas Sharma', role: Role.PARENT, passwordHash: parentPass },
    create: {
      email: 'parent.sharma@gmail.com',
      phone: '919876543214',
      name: 'Vikas Sharma',
      role: Role.PARENT,
      passwordHash: parentPass,
    },
  });

  const parent1 = await prisma.parent.upsert({
    where: { userId: parent1User.id },
    update: { fatherName: 'Vikas Sharma', motherName: 'Sunita Sharma' },
    create: {
      userId: parent1User.id,
      fatherName: 'Vikas Sharma',
      fatherPhone: '919876543214',
      fatherOccupation: 'Government Service',
      motherName: 'Sunita Sharma',
      motherPhone: '919876543215',
      motherOccupation: 'Home Maker',
      address: 'Behind P.N.B. Bank, Baruasagar',
      city: 'Jhansi',
      state: 'Uttar Pradesh',
      pincode: '284001',
    },
  });

  const parent2User = await prisma.user.upsert({
    where: { email: 'parent.verma@gmail.com' },
    update: { name: 'Sanjay Verma', role: Role.PARENT, passwordHash: parentPass },
    create: {
      email: 'parent.verma@gmail.com',
      phone: '919876543216',
      name: 'Sanjay Verma',
      role: Role.PARENT,
      passwordHash: parentPass,
    },
  });

  const parent2 = await prisma.parent.upsert({
    where: { userId: parent2User.id },
    update: { fatherName: 'Sanjay Verma', motherName: 'Rekha Verma' },
    create: {
      userId: parent2User.id,
      fatherName: 'Sanjay Verma',
      fatherPhone: '919876543216',
      fatherOccupation: 'Business',
      motherName: 'Rekha Verma',
      motherPhone: '919876543217',
      motherOccupation: 'Teacher',
      address: 'Naya Bus Stand Road, Baruasagar',
      city: 'Jhansi',
      state: 'Uttar Pradesh',
      pincode: '284001',
    },
  });
  console.log('✓ Verified Parent Accounts Seeded');

  // 6. Students
  const cls4AId = sectionMap.get('Class 4-A')!;
  const cls1BId = sectionMap.get('Class 1-B')!;
  const cls8AId = sectionMap.get('Class 8-A')!;

  // Student 1: Aarav Sharma (Class 4-A)
  const student1 = await prisma.student.upsert({
    where: { admissionNo: 'APPS/2026/001' },
    update: { firstName: 'Aarav', lastName: 'Sharma' },
    create: {
      admissionNo: 'APPS/2026/001',
      rollNo: 1,
      firstName: 'Aarav',
      lastName: 'Sharma',
      dob: new Date('2016-07-15'),
      gender: Gender.MALE,
      bloodGroup: 'B+',
      category: 'General',
      classId: classMap.get('Class 4')!,
      sectionId: cls4AId,
      parentId: parent1.id,
      status: StudentStatus.ACTIVE,
    },
  });

  // Student 2: Ananya Sharma (Class 1-B, sister of Aarav)
  const student2 = await prisma.student.upsert({
    where: { admissionNo: 'APPS/2026/002' },
    update: { firstName: 'Ananya', lastName: 'Sharma' },
    create: {
      admissionNo: 'APPS/2026/002',
      rollNo: 2,
      firstName: 'Ananya',
      lastName: 'Sharma',
      dob: new Date('2019-11-20'),
      gender: Gender.FEMALE,
      bloodGroup: 'O+',
      category: 'General',
      classId: classMap.get('Class 1')!,
      sectionId: cls1BId,
      parentId: parent1.id,
      status: StudentStatus.ACTIVE,
    },
  });

  // Student 3: Rohan Verma (Class 8-A)
  const student3 = await prisma.student.upsert({
    where: { admissionNo: 'APPS/2026/003' },
    update: { firstName: 'Rohan', lastName: 'Verma' },
    create: {
      admissionNo: 'APPS/2026/003',
      rollNo: 1,
      firstName: 'Rohan',
      lastName: 'Verma',
      dob: new Date('2012-03-10'),
      gender: Gender.MALE,
      bloodGroup: 'A+',
      category: 'OBC',
      classId: classMap.get('Class 8')!,
      sectionId: cls8AId,
      parentId: parent2.id,
      status: StudentStatus.ACTIVE,
    },
  });

  console.log('✓ Students Seeded (Aarav Sharma, Ananya Sharma, Rohan Verma)');

  // 7. Fee Structures
  for (const [clsName, clsId] of classMap.entries()) {
    let tuitionAmount = 1400;
    if (clsName.includes('Nursery') || clsName.includes('LKG') || clsName.includes('UKG')) tuitionAmount = 1200;
    else if (clsName.includes('Class 6') || clsName.includes('Class 7') || clsName.includes('Class 8')) tuitionAmount = 1800;

    await prisma.feeStructure.upsert({
      where: { classId_academicYearId_feeHead: { classId: clsId, academicYearId: academicYear.id, feeHead: 'Tuition Fee' } },
      update: { amount: tuitionAmount },
      create: {
        classId: clsId,
        academicYearId: academicYear.id,
        feeHead: 'Tuition Fee',
        amount: tuitionAmount,
        frequency: FeeFrequency.MONTHLY,
        dueDateDay: 10,
      },
    });
  }
  console.log('✓ Monthly Fee Structures Seeded for all classes');

  // 8. Fee Invoices & Payment for Aarav Sharma
  const invoice1 = await prisma.feeInvoice.upsert({
    where: { invoiceNo: 'INV-2026-00001' },
    update: { status: InvoiceStatus.PAID, paidAmount: 1400, balanceAmount: 0 },
    create: {
      invoiceNo: 'INV-2026-00001',
      studentId: student1.id,
      academicYearId: academicYear.id,
      month: 'April 2026',
      totalAmount: 1400,
      discountAmount: 0,
      lateFee: 0,
      paidAmount: 1400,
      balanceAmount: 0,
      dueDate: new Date('2026-04-10'),
      status: InvoiceStatus.PAID,
    },
  });

  await prisma.feePayment.upsert({
    where: { receiptNo: 'REC-2026-00001' },
    update: { amountPaid: 1400 },
    create: {
      receiptNo: 'REC-2026-00001',
      invoiceId: invoice1.id,
      studentId: student1.id,
      amountPaid: 1400,
      paymentMode: PaymentMode.ONLINE_RAZORPAY,
      transactionId: 'pay_apps_sample_001',
      razorpayOrderId: 'order_apps_sample_001',
      razorpayPaymentId: 'pay_apps_sample_001',
      status: PaymentStatus.SUCCESS,
      notes: 'Paid online via Razorpay Gateway',
    },
  });

  // Pending May invoice
  await prisma.feeInvoice.upsert({
    where: { invoiceNo: 'INV-2026-00002' },
    update: { status: InvoiceStatus.UNPAID, balanceAmount: 1400 },
    create: {
      invoiceNo: 'INV-2026-00002',
      studentId: student1.id,
      academicYearId: academicYear.id,
      month: 'May 2026',
      totalAmount: 1400,
      discountAmount: 0,
      lateFee: 0,
      paidAmount: 0,
      balanceAmount: 1400,
      dueDate: new Date('2026-05-10'),
      status: InvoiceStatus.UNPAID,
    },
  });
  console.log('✓ Fee Invoices & Razorpay Payment Record Seeded');

  // 9. Attendance Samples (Past 5 days)
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    await prisma.attendance.upsert({
      where: { studentId_date: { studentId: student1.id, date: d } },
      update: { status: AttendanceStatus.PRESENT },
      create: {
        studentId: student1.id,
        sectionId: cls4AId,
        date: d,
        status: AttendanceStatus.PRESENT,
      },
    });

    await prisma.attendance.upsert({
      where: { studentId_date: { studentId: student3.id, date: d } },
      update: { status: i === 2 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT },
      create: {
        studentId: student3.id,
        sectionId: cls8AId,
        date: d,
        status: i === 2 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT,
      },
    });
  }
  console.log('✓ Sample Daily Attendance Records Seeded');

  console.log('🎉 Seeding successfully completed for A. P PUBLIC SCHOOL, Jhansi!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
