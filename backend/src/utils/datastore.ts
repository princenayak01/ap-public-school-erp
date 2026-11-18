import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../../data/store.json');

export interface StoreData {
  classes: any[];
  sections: any[];
  students: any[];
  attendance: any[];
  feeInvoices: any[];
  feePayments: any[];
  feeStructures: any[];
  exams: any[];
  marks: any[];
  auditLogs: any[];
  registeredUsers?: any[];
  timetable?: any[];
}

const DEFAULT_STORE: StoreData = {
  classes: [
    { id: 'cls-nur', name: 'Nursery', numericOrder: 0 },
    { id: 'cls-lkg', name: 'LKG', numericOrder: 1 },
    { id: 'cls-ukg', name: 'UKG', numericOrder: 2 },
    { id: 'cls-1', name: 'Class 1', numericOrder: 3 },
    { id: 'cls-2', name: 'Class 2', numericOrder: 4 },
    { id: 'cls-3', name: 'Class 3', numericOrder: 5 },
    { id: 'cls-4', name: 'Class 4', numericOrder: 6 },
    { id: 'cls-5', name: 'Class 5', numericOrder: 7 },
    { id: 'cls-6', name: 'Class 6', numericOrder: 8 },
    { id: 'cls-7', name: 'Class 7', numericOrder: 9 },
    { id: 'cls-8', name: 'Class 8', numericOrder: 10 },
  ],
  sections: [
    { id: 'sec-4a', classId: 'cls-4', name: 'A', roomNumber: 'Room 104' },
    { id: 'sec-4b', classId: 'cls-4', name: 'B', roomNumber: 'Room 105' },
    { id: 'sec-1a', classId: 'cls-1', name: 'A', roomNumber: 'Room 101' },
    { id: 'sec-1b', classId: 'cls-1', name: 'B', roomNumber: 'Room 102' },
  ],
  students: [],
  attendance: [],
  feeInvoices: [],
  feePayments: [],
  feeStructures: [
    { id: 'fs-1', className: 'Nursery to UKG', tuitionFee: 1500, admissionFee: 2500, annualCharges: 1200 },
    { id: 'fs-2', className: 'Class 1 to 5', tuitionFee: 1800, admissionFee: 3000, annualCharges: 1500 },
    { id: 'fs-3', className: 'Class 6 to 8', tuitionFee: 2200, admissionFee: 3500, annualCharges: 1800 },
  ],
  exams: [
    {
      id: 'exam-01',
      name: 'Term 1 Mid-Term Examination',
      academicYear: '2026-27',
      startDate: '2026-09-15',
      endDate: '2026-09-25',
    },
    {
      id: 'exam-02',
      name: 'Final Annual CBSE Examination',
      academicYear: '2026-27',
      startDate: '2027-02-20',
      endDate: '2027-03-05',
    },
  ],
  marks: [],
  auditLogs: [],
  timetable: [],
};

class DataStore {
  private data: StoreData;

  constructor() {
    this.data = this.load();
  }

  private load(): StoreData {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DATASTORE] Error reading store.json, using defaults:', err);
    }
    this.save(DEFAULT_STORE);
    return JSON.parse(JSON.stringify(DEFAULT_STORE));
  }

  private save(dataToSave?: StoreData) {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DATASTORE] Failed to save store.json:', err);
    }
  }

  getStudents(filter?: { class?: string; search?: string }) {
    let list = this.data.students;
    if (filter?.class && filter.class !== 'ALL') {
      list = list.filter((s) => s.className.toLowerCase().includes(filter.class!.toLowerCase()));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q)
      );
    }
    return list;
  }

  admitStudent(studentData: any) {
    const count = this.data.students.length + 1;
    const admissionNo = `APPS/2026/${String(count).padStart(3, '0')}`;
    const newStudent = {
      id: `std-${String(count).padStart(3, '0')}`,
      admissionNo,
      rollNumber: String(count),
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      gender: studentData.gender || 'MALE',
      dateOfBirth: studentData.dateOfBirth || '2018-01-01',
      bloodGroup: studentData.bloodGroup || 'B+',
      classId: studentData.classId || 'cls-4',
      className: studentData.className || 'Class 4',
      sectionId: studentData.sectionId || 'sec-4a',
      sectionName: studentData.sectionName || 'A',
      parentName: studentData.parentName || 'Parent',
      parentPhone: studentData.parentPhone || '+91-9876543210',
      parentEmail: studentData.parentEmail || '',
      address: studentData.address || 'Jhansi, U.P.',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };

    this.data.students.unshift(newStudent);
    this.save();
    return newStudent;
  }

  getAttendance(date: string) {
    const list = this.data.students.map((st) => {
      const rec = this.data.attendance.find((a) => a.studentId === st.id && a.date === date);
      return {
        studentId: st.id,
        admissionNo: st.admissionNo,
        rollNo: st.rollNumber,
        name: `${st.firstName} ${st.lastName}`,
        status: rec ? rec.status : 'PRESENT',
        remark: rec?.remark || '',
      };
    });
    return list;
  }

  markDailyAttendance(date: string, records: { studentId: string; status: string; remark?: string }[]) {
    for (const r of records) {
      const idx = this.data.attendance.findIndex((a) => a.studentId === r.studentId && a.date === date);
      if (idx >= 0) {
        this.data.attendance[idx].status = r.status;
        this.data.attendance[idx].remark = r.remark || '';
      } else {
        this.data.attendance.push({
          studentId: r.studentId,
          date,
          status: r.status,
          remark: r.remark || '',
        });
      }
    }
    this.save();
    return { success: true, count: records.length, date };
  }

  saveBulkAttendance(startDate: string, endDate: string, defaultStatus: string, excludeSundays: boolean = true) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let cur = new Date(start);
    let total = 0;

    while (cur <= end) {
      if (excludeSundays && cur.getDay() === 0) {
        cur.setDate(cur.getDate() + 1);
        continue;
      }
      const dateStr = cur.toISOString().split('T')[0];
      for (const st of this.data.students) {
        const idx = this.data.attendance.findIndex((a) => a.studentId === st.id && a.date === dateStr);
        if (idx >= 0) {
          this.data.attendance[idx].status = defaultStatus;
        } else {
          this.data.attendance.push({
            studentId: st.id,
            date: dateStr,
            status: defaultStatus,
            remark: 'Bulk Marked',
          });
        }
        total++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    this.save();
    return { success: true, totalRecordsSaved: total, startDate, endDate, defaultStatus };
  }

  getFeeInvoices() {
    return this.data.feeInvoices;
  }

  createFeeReceipt(receiptData: {
    studentId?: string;
    studentName: string;
    className: string;
    rollNo?: string;
    admissionNo?: string;
    month?: string;
    feeHead?: string;
    totalAmount: number;
    amountPaid: number;
    paymentMode?: string;
    remarks?: string;
  }) {
    if (!this.data.feeInvoices) this.data.feeInvoices = [];
    if (!this.data.feePayments) this.data.feePayments = [];

    const count = this.data.feeInvoices.length + 1;
    const invoiceNo = `INV-2026-${String(count).padStart(3, '0')}`;
    const receiptNo = `REC-2026-${String(count).padStart(3, '0')}`;

    const totalAmount = Number(receiptData.totalAmount) || 0;
    const paidAmount = Number(receiptData.amountPaid) || 0;
    const balanceAmount = Math.max(0, totalAmount - paidAmount);
    const status = balanceAmount === 0 ? 'PAID' : (paidAmount > 0 ? 'PARTIAL' : 'PENDING');

    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo,
      receiptNumber: receiptNo,
      studentId: receiptData.studentId || `std-custom-${Date.now()}`,
      studentName: receiptData.studentName,
      className: receiptData.className || 'Class 4',
      rollNo: receiptData.rollNo || '01',
      admissionNo: receiptData.admissionNo || `APPS/2026/${String(count).padStart(3, '0')}`,
      month: receiptData.month || 'Current Session',
      feeHead: receiptData.feeHead || 'Tuition & Academic Fee',
      totalAmount,
      paidAmount,
      balanceAmount,
      status,
      paymentMode: receiptData.paymentMode || 'CASH',
      createdAt: new Date().toISOString().split('T')[0],
      remarks: receiptData.remarks || (balanceAmount === 0 ? 'No Due - Full Fee Paid' : `Partial Fee Paid, Due: ₹${balanceAmount}`),
    };

    this.data.feeInvoices.unshift(newInvoice);

    if (paidAmount > 0) {
      const payment = {
        id: `pay-${Date.now()}`,
        receiptNumber: receiptNo,
        invoiceId: newInvoice.id,
        studentName: newInvoice.studentName,
        className: newInvoice.className,
        amountPaid: paidAmount,
        paymentMethod: receiptData.paymentMode || 'CASH',
        transactionId: `TXN_${Date.now()}`,
        paymentDate: new Date().toISOString().split('T')[0],
        balanceAmount,
        status,
      };
      this.data.feePayments.unshift(payment);
    }

    this.save();
    return { success: true, invoice: newInvoice, receiptNo };
  }

  recordPayment(invoiceId: string, amount: number, paymentMethod: string, transactionId?: string) {
    const inv = this.data.feeInvoices.find((i) => i.id === invoiceId);
    if (!inv) throw new Error('Invoice not found');

    const receiptNumber = `REC/2026/${String(this.data.feePayments.length + 1).padStart(3, '0')}`;
    inv.paidAmount += amount;
    inv.balanceAmount = Math.max(0, inv.totalAmount - inv.paidAmount);
    inv.status = inv.balanceAmount === 0 ? 'PAID' : 'PARTIAL';

    const payment = {
      id: `pay-${Date.now()}`,
      receiptNumber,
      invoiceId,
      studentName: inv.studentName,
      amountPaid: amount,
      paymentMethod,
      transactionId: transactionId || `TXN_${Date.now()}`,
      paymentDate: new Date().toISOString().split('T')[0],
    };

    this.data.feePayments.unshift(payment);
    this.save();
    return { success: true, payment, invoice: inv };
  }

  updateStudentRollNo(studentId: string, rollNumber: string) {
    const student = this.data.students.find((s) => s.id === studentId || s.admissionNo === studentId);
    if (!student) throw new Error('Student not found');
    student.rollNumber = String(rollNumber);
    this.save();
    return student;
  }

  bulkAdmitStudents(studentList: any[]) {
    const addedStudents: any[] = [];
    studentList.forEach((item, idx) => {
      const count = this.data.students.length + 1;
      const admissionNo = item.admissionNo || `APPS/2026/${String(count).padStart(3, '0')}`;
      const newStudent = {
        id: `std-${String(count).padStart(3, '0')}`,
        admissionNo,
        rollNumber: String(item.rollNumber || item.rollNo || count),
        firstName: item.firstName || (item.name ? item.name.split(' ')[0] : `Student${count}`),
        lastName: item.lastName || (item.name && item.name.split(' ').length > 1 ? item.name.split(' ').slice(1).join(' ') : 'Kumar'),
        gender: item.gender ? item.gender.toUpperCase() : (idx % 2 === 0 ? 'MALE' : 'FEMALE'),
        dateOfBirth: item.dateOfBirth || item.dob || '2016-05-15',
        bloodGroup: item.bloodGroup || 'B+',
        classId: item.classId || 'cls-4',
        className: item.className || item.class || 'Class 4',
        sectionId: item.sectionId || 'sec-4a',
        sectionName: item.sectionName || item.section || 'A',
        parentName: item.parentName || item.fatherName || 'Parent Guardian',
        parentPhone: item.parentPhone || item.phone || '+91-9876543210',
        parentEmail: item.parentEmail || item.email || '',
        address: item.address || 'Baruasagar, Jhansi, U.P.',
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      };
      this.data.students.unshift(newStudent);
      addedStudents.push(newStudent);
    });

    this.save();
    return addedStudents;
  }

  deleteStudent(studentId: string) {
    const idx = this.data.students.findIndex((s) => s.id === studentId || s.admissionNo === studentId);
    if (idx === -1) throw new Error('Student not found');
    const removed = this.data.students.splice(idx, 1)[0];
    this.save();
    return removed;
  }

  clearAllStudents() {
    const clearedCount = this.data.students.length;
    this.data.students = [];
    this.data.attendance = [];
    this.data.marks = [];
    this.data.feeInvoices = [];
    this.data.feePayments = [];
    this.save();
    return { clearedCount };
  }

  registerUser(userData: any) {
    if (!this.data.registeredUsers) {
      this.data.registeredUsers = [];
    }
    const count = this.data.registeredUsers.length + 1;
    const userId = userData.role === 'TEACHER' ? `usr-tch-${String(count).padStart(3, '0')}` : `usr-reg-${String(count).padStart(3, '0')}`;
    const newUser = {
      id: userId,
      teacherId: userData.teacherId || (userData.role === 'TEACHER' ? `TCH-${String(count).padStart(3, '0')}` : undefined),
      name: userData.name,
      email: (userData.email || `user${count}@apps.edu.in`).toLowerCase().trim(),
      phone: userData.phone || '+91-9876543210',
      role: userData.role || 'PARENT',
      password: userData.password || 'password123',
      className: userData.className || userData.assignedClass || 'Class 4',
      sectionName: userData.sectionName || userData.assignedSection || 'A',
      subject: userData.subject || 'All Subjects',
      rollNumber: userData.rollNumber || String(this.data.students.length + 1),
      otpVerified: userData.otpVerified !== undefined ? userData.otpVerified : true,
      registeredAt: new Date().toISOString(),
      status: 'PENDING_APPROVAL', // Requires Administrator / Principal Approval
    };

    this.data.registeredUsers.unshift(newUser);

    // If role is STUDENT, also add to students roster with manual roll number
    if (userData.role === 'STUDENT') {
      const stCount = this.data.students.length + 1;
      const admissionNo = `APPS/2026/${String(stCount).padStart(3, '0')}`;
      const nameParts = (userData.name || 'New Student').trim().split(' ');
      const firstName = nameParts[0] || 'Student';
      const lastName = nameParts.slice(1).join(' ') || 'Kumar';
      const studentObj = {
        id: `std-${String(stCount).padStart(3, '0')}`,
        admissionNo,
        rollNumber: String(userData.rollNumber || stCount),
        firstName,
        lastName,
        gender: userData.gender || 'MALE',
        dateOfBirth: userData.dateOfBirth || '2016-01-01',
        bloodGroup: userData.bloodGroup || 'B+',
        classId: 'cls-4',
        className: userData.className || 'Class 4',
        sectionId: 'sec-4a',
        sectionName: userData.sectionName || 'A',
        parentName: userData.parentName || 'Parent Guardian',
        parentPhone: userData.phone || '+91-9876543210',
        parentEmail: userData.email,
        address: userData.address || 'Jhansi, U.P.',
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      };
      this.data.students.unshift(studentObj);
    }

    this.save();
    return newUser;
  }

  getPendingUsers() {
    if (!this.data.registeredUsers) return [];
    return this.data.registeredUsers.map((u) => ({
      ...u,
      status: u.status || 'PENDING_APPROVAL',
    }));
  }

  approveUser(userId: string) {
    if (!this.data.registeredUsers) throw new Error('No registered users found');
    const user = this.data.registeredUsers.find((u) => u.id === userId || u.email === userId);
    if (!user) throw new Error('User not found');
    user.status = 'APPROVED';
    user.approvedAt = new Date().toISOString();
    this.save();
    return user;
  }

  rejectUser(userId: string) {
    if (!this.data.registeredUsers) throw new Error('No registered users found');
    const user = this.data.registeredUsers.find((u) => u.id === userId || u.email === userId);
    if (!user) throw new Error('User not found');
    user.status = 'REJECTED';
    user.rejectedAt = new Date().toISOString();
    this.save();
    return user;
  }

  getMarks() {
    return this.data.marks;
  }

  saveMarks(records: any[]) {
    this.data.marks = records;
    this.save();
    return { success: true, count: records.length };
  }

  getTimetable(className?: string, sectionName?: string) {
    if (!this.data.timetable) {
      this.data.timetable = [];
    }
    if (className) {
      return this.data.timetable.filter((t: any) =>
        t.className?.toLowerCase() === className.toLowerCase() &&
        (!sectionName || t.sectionName?.toLowerCase() === sectionName.toLowerCase())
      );
    }
    return this.data.timetable;
  }

  saveTimetable(entries: any[]) {
    this.data.timetable = entries;
    this.save();
    return { success: true, count: entries.length };
  }
}

export const datastore = new DataStore();
export default datastore;
