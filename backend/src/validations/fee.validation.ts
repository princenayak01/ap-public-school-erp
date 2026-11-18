import { z } from 'zod';
import { FeeFrequency, PaymentMode } from '@prisma/client';

export const createFeeStructureSchema = z.object({
  classId: z.string().uuid('Class ID is required'),
  academicYearId: z.string().uuid('Academic Year ID is required'),
  feeHead: z.string().min(2, 'Fee Head is required (e.g. Tuition Fee)'),
  amount: z.number().positive('Amount must be positive'),
  frequency: z.nativeEnum(FeeFrequency).default(FeeFrequency.MONTHLY),
  dueDateDay: z.number().int().min(1).max(31).default(10),
});

export const generateMonthlyInvoicesSchema = z.object({
  academicYearId: z.string().uuid('Academic Year is required'),
  month: z.string().min(3, 'Month is required (e.g. April 2026)'),
  classId: z.string().uuid().optional(), // optional to target single class or all classes
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid Due Date is required' }),
});

export const recordFeePaymentSchema = z.object({
  invoiceId: z.string().uuid('Invoice ID is required'),
  amountPaid: z.number().positive('Payment amount must be greater than zero'),
  paymentMode: z.nativeEnum(PaymentMode).default(PaymentMode.CASH),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

export const verifyRazorpayPaymentSchema = z.object({
  invoiceId: z.string().uuid('Invoice ID is required'),
  razorpayOrderId: z.string().min(5, 'Razorpay order ID required'),
  razorpayPaymentId: z.string().min(5, 'Razorpay payment ID required'),
  razorpaySignature: z.string().min(10, 'Razorpay signature required'),
});

export const createConcessionSchema = z.object({
  studentId: z.string().uuid('Student ID is required'),
  feeHead: z.string().min(2, 'Fee Head is required'),
  concessionPercent: z.number().min(1).max(100).optional(),
  concessionAmount: z.number().positive().optional(),
  reason: z.string().min(3, 'Valid reason for concession is required'),
});
