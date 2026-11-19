import prisma from '../prisma/client';
import crypto from 'crypto';
import config from '../config';
import { InvoiceStatus, PaymentMode, PaymentStatus } from '@prisma/client';
import PDFDocument from 'pdfkit';

export class FeeService {
  // 1. Create / Configure Fee Structure
  static async createFeeStructure(data: any) {
    return prisma.feeStructure.create({
      data: {
        classId: data.classId,
        academicYearId: data.academicYearId,
        feeHead: data.feeHead,
        amount: data.amount,
        frequency: data.frequency,
        dueDateDay: data.dueDateDay || 10,
      },
    });
  }

  static async getFeeStructures(academicYearId: string) {
    return prisma.feeStructure.findMany({
      where: { academicYearId },
      include: { class: true },
      orderBy: { class: { numericOrder: 'asc' } },
    });
  }

  // 2. Generate Monthly Fee Invoices for Students
  static async generateMonthlyInvoices(academicYearId: string, month: string, dueDate: string, classId?: string) {
    const studentWhere: any = { status: 'ACTIVE' };
    if (classId) studentWhere.classId = classId;

    const students = await prisma.student.findMany({
      where: studentWhere,
      include: {
        class: {
          include: {
            feeStructures: {
              where: { academicYearId },
            },
          },
        },
        concessions: true,
      },
    });

    const generatedInvoices = [];
    let invoiceCount = await prisma.feeInvoice.count();

    for (const student of students) {
      // Check if invoice for this month already exists
      const existing = await prisma.feeInvoice.findFirst({
        where: { studentId: student.id, month, academicYearId },
      });

      if (existing) continue; // prevent duplicate invoice

      // Calculate total base amount from active fee structures
      let baseTotal = 0;
      for (const fee of student.class.feeStructures) {
        baseTotal += Number(fee.amount);
      }

      // Calculate concession discounts
      let discountAmount = 0;
      for (const concession of student.concessions) {
        if (concession.concessionPercent) {
          discountAmount += (baseTotal * Number(concession.concessionPercent)) / 100;
        } else if (concession.concessionAmount) {
          discountAmount += Number(concession.concessionAmount);
        }
      }

      const totalAmount = Math.max(0, baseTotal - discountAmount);
      invoiceCount++;
      const invoiceNo = `INV-2026-${String(invoiceCount).padStart(5, '0')}`;

      const invoice = await prisma.feeInvoice.create({
        data: {
          invoiceNo,
          studentId: student.id,
          academicYearId,
          month,
          totalAmount,
          discountAmount,
          lateFee: 0,
          paidAmount: 0,
          balanceAmount: totalAmount,
          dueDate: new Date(dueDate),
          status: InvoiceStatus.UNPAID,
        },
      });

      generatedInvoices.push(invoice);
    }

    return {
      success: true,
      month,
      generatedCount: generatedInvoices.length,
    };
  }

  // 3. Record Fee Payment (Cash, UPI, Cheque, Bank Transfer)
  static async recordPayment(invoiceId: string, amountPaid: number, paymentMode: PaymentMode, collectedByUserId?: string, notes?: string) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.feeInvoice.findUnique({ where: { id: invoiceId } });
      if (!invoice) throw { status: 404, message: 'Fee invoice not found.' };
      if (invoice.status === InvoiceStatus.PAID) {
        throw { status: 400, message: 'This invoice has already been fully paid.' };
      }

      const currentBalance = Number(invoice.balanceAmount);
      if (!Number.isFinite(amountPaid) || amountPaid <= 0 || amountPaid > currentBalance) {
        throw { status: 400, message: 'Payment amount must be positive and cannot exceed the outstanding balance.' };
      }

      const newPaid = Number(invoice.paidAmount) + amountPaid;
      const newBalance = Math.max(0, currentBalance - amountPaid);
      const newStatus = newBalance === 0 ? InvoiceStatus.PAID : InvoiceStatus.PARTIAL;

      // Optimistic concurrency check prevents two simultaneous requests from
      // collecting against the same stale invoice balance.
      const update = await tx.feeInvoice.updateMany({
        where: {
          id: invoice.id,
          balanceAmount: invoice.balanceAmount,
          status: { not: InvoiceStatus.PAID },
        },
        data: {
          paidAmount: newPaid,
          balanceAmount: newBalance,
          status: newStatus,
        },
      });
      if (update.count !== 1) {
        throw { status: 409, message: 'Invoice changed during payment. Refresh and retry.' };
      }

      const receiptNo = `REC-${crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`;
      return tx.feePayment.create({
        data: {
          receiptNo,
          invoiceId: invoice.id,
          studentId: invoice.studentId,
          amountPaid,
          paymentMode,
          status: PaymentStatus.SUCCESS,
          collectedByUserId,
          notes,
        },
      });
    });
  }

  // 4. Online Razorpay Integration & Webhook Verification
  static async createRazorpayOrder(invoiceId: string, amountInINR: number) {
    const invoice = await prisma.feeInvoice.findUnique({
      where: { id: invoiceId },
      include: { student: { include: { parent: true } } },
    });

    if (!invoice) throw { status: 404, message: 'Invoice not found.' };

    const balance = Number(invoice.balanceAmount);
    if (amountInINR > balance) {
      throw { status: 400, message: `Amount exceeds balance of ₹${balance}` };
    }

    // Razorpay amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amountInINR * 100);
    const simulatedOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    return {
      orderId: simulatedOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: config.razorpay.keyId,
      schoolName: 'A. P PUBLIC SCHOOL, Jhansi',
      studentName: `${invoice.student.firstName} ${invoice.student.lastName}`,
      admissionNo: invoice.student.admissionNo,
      invoiceNo: invoice.invoiceNo,
    };
  }

  static async verifyRazorpayPayment(invoiceId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
    // Check if this payment ID was already processed (Duplicate Prevention)
    const existingPmt = await prisma.feePayment.findFirst({
      where: { razorpayPaymentId },
    });
    if (existingPmt) {
      throw { status: 400, message: 'Duplicate payment detected. This transaction has already been recorded.' };
    }

    // Verify HMAC-SHA256 signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(text)
      .digest('hex');

    // In production or test environment:
    const isValid = expectedSignature === razorpaySignature;
    if (!isValid) {
      throw { status: 400, message: 'Payment verification failed. Invalid digital signature.' };
    }

    const invoice = await prisma.feeInvoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw { status: 404, message: 'Invoice not found.' };

    const amountPaid = Number(invoice.balanceAmount);
    const receiptCount = (await prisma.feePayment.count()) + 1;
    const receiptNo = `REC-2026-${String(receiptCount).padStart(5, '0')}`;

    const payment = await prisma.$transaction(async (tx) => {
      const pmt = await tx.feePayment.create({
        data: {
          receiptNo,
          invoiceId: invoice.id,
          studentId: invoice.studentId,
          amountPaid,
          paymentMode: PaymentMode.ONLINE_RAZORPAY,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: PaymentStatus.SUCCESS,
          notes: 'Paid online via Razorpay Gateway',
        },
      });

      await tx.feeInvoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: Number(invoice.totalAmount),
          balanceAmount: 0,
          status: InvoiceStatus.PAID,
        },
      });

      return pmt;
    });

    return payment;
  }

  // 5. Generate Professional PDF Fee Receipt (Buffer stream)
  static async generateReceiptPDF(receiptId: string): Promise<Buffer> {
    const payment = await prisma.feePayment.findUnique({
      where: { id: receiptId },
      include: {
        invoice: {
          include: {
            academicYear: true,
          },
        },
        student: {
          include: {
            class: true,
            section: true,
            parent: true,
          },
        },
      },
    });

    if (!payment) throw { status: 404, message: 'Payment record not found.' };

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // School Header
      doc.rect(40, 40, 515, 80).fill('#1e1b4b');
      doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text('A. P PUBLIC SCHOOL', 50, 52, { align: 'center' });
      doc.fontSize(10).font('Helvetica').text('Affiliated to CBSE, New Delhi | Baruasagar, Jhansi (U.P.) - 284001', 50, 78, { align: 'center' });
      doc.fontSize(9).text('Official Fee Receipt & Audit Acknowledgment', 50, 95, { align: 'center' });

      // Receipt Meta Box
      doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold');
      doc.text(`Receipt No: ${payment.receiptNo}`, 50, 140);
      doc.text(`Date: ${payment.paymentDate.toLocaleDateString('en-IN')}`, 380, 140);
      doc.text(`Invoice No: ${payment.invoice.invoiceNo}`, 50, 158);
      doc.text(`Academic Session: ${payment.invoice.academicYear.name}`, 380, 158);

      // Divider Line
      doc.moveTo(40, 180).lineTo(555, 180).strokeColor('#cbd5e1').stroke();

      // Student Details
      doc.fontSize(10).font('Helvetica-Bold').text('Student Name:', 50, 195);
      doc.font('Helvetica').text(`${payment.student.firstName} ${payment.student.lastName}`, 150, 195);
      doc.font('Helvetica-Bold').text('Admission No:', 350, 195);
      doc.font('Helvetica').text(payment.student.admissionNo, 450, 195);

      doc.font('Helvetica-Bold').text('Class & Section:', 50, 215);
      doc.font('Helvetica').text(`${payment.student.class.name} - ${payment.student.section.name}`, 150, 215);
      doc.font('Helvetica-Bold').text('Father Name:', 350, 215);
      doc.font('Helvetica').text(payment.student.parent.fatherName, 450, 215);

      // Fee Table
      doc.rect(40, 250, 515, 25).fill('#f1f5f9');
      doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(10);
      doc.text('Fee Description / Month', 55, 258);
      doc.text('Mode', 320, 258);
      doc.text('Amount (INR)', 450, 258, { align: 'right' });

      doc.fillColor('#0f172a').font('Helvetica').fontSize(10);
      doc.text(`Monthly School Fees - ${payment.invoice.month}`, 55, 288);
      doc.text(payment.paymentMode, 320, 288);
      doc.font('Helvetica-Bold').text(`Rs. ${Number(payment.amountPaid).toFixed(2)}`, 450, 288, { align: 'right' });

      doc.moveTo(40, 320).lineTo(555, 320).strokeColor('#cbd5e1').stroke();

      // Balance & Summary
      doc.font('Helvetica').fontSize(10);
      doc.text(`Total Invoice Amount: Rs. ${Number(payment.invoice.totalAmount).toFixed(2)}`, 50, 335);
      doc.text(`Remaining Balance: Rs. ${Number(payment.invoice.balanceAmount).toFixed(2)}`, 50, 352);

      // Stamp & Signature Box
      doc.rect(360, 400, 180, 80).strokeColor('#94a3b8').stroke();
      doc.font('Helvetica-Bold').fontSize(9).text('AUTHORIZED SIGNATORY', 370, 455, { align: 'center', width: 160 });
      doc.font('Helvetica').fontSize(8).text('A. P PUBLIC SCHOOL, JHANSI', 370, 468, { align: 'center', width: 160 });

      // Footer
      doc.fontSize(8).fillColor('#64748b').text('This is a computer generated document and requires no physical signature.', 50, 520, { align: 'center' });

      doc.end();
    });
  }

  // 6. Fee Analytics & Reports
  static async getFeeAnalytics(academicYearId: string) {
    const invoices = await prisma.feeInvoice.findMany({
      where: { academicYearId },
    });

    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;

    for (const inv of invoices) {
      totalBilled += Number(inv.totalAmount);
      totalCollected += Number(inv.paidAmount);
      totalPending += Number(inv.balanceAmount);
    }

    const recentPayments = await prisma.feePayment.findMany({
      take: 10,
      orderBy: { paymentDate: 'desc' },
      include: {
        student: { include: { class: true } },
        invoice: true,
      },
    });

    return {
      totalBilled,
      totalCollected,
      totalPending,
      collectionRate: totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : 0,
      recentPayments,
    };
  }
}
