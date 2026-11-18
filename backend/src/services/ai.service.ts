import prisma from '../prisma/client';
import { Role } from '@prisma/client';

export class AIService {
  // Knowledge Base of Approved Documents & Policies for A. P PUBLIC SCHOOL, Jhansi
  private static schoolKnowledgeBase = [
    {
      topic: 'School Identity & Location',
      content: 'A. P PUBLIC SCHOOL is a premier CBSE-affiliated co-educational English-medium institution located behind P.N.B. Bank, Naya Bus Stand Road, Baruasagar, Jhansi (U.P.) - 284001. Contact Phone: +91-6306262479. Email: apps.jhansi@gmail.com.',
    },
    {
      topic: 'Classes & Curriculum',
      content: 'The school operates classes from Nursery to Class 8 following the CBSE New Delhi syllabus. The academic session is 2026–27 starting in April.',
    },
    {
      topic: 'Fee Payment Policy',
      content: 'Tuition fees must be deposited by the 10th of every calendar month. Payments can be completed online via Razorpay through the Parent Portal or in person at the school fee counter. Late fees of Rs. 10 per day are applicable after the grace period of 10 days.',
    },
    {
      topic: 'Attendance Rules',
      content: 'A minimum of 75% attendance is mandatory as per CBSE guidelines to appear for annual examinations. For medical leaves exceeding 3 days, a medical certificate must be submitted.',
    },
    {
      topic: 'Grading System',
      content: 'Evaluation follows CBSE 9-point grading: A1 (91-100%), A2 (81-90%), B1 (71-80%), B2 (61-70%), C1 (51-60%), C2 (41-50%), D (33-40%), E (Needs improvement).',
    },
    {
      topic: 'School Timings',
      content: 'Summer Timings: 7:30 AM to 1:30 PM. Winter Timings: 8:30 AM to 2:30 PM. Second Saturdays are holidays.',
    },
  ];

  static async askAssistant(question: string, user: { userId: string; role: Role }) {
    const qLower = question.toLowerCase();

    // 1. Check for student-specific queries (Role-based restriction)
    if (qLower.includes('fee') && qLower.includes('my child') && user.role === Role.PARENT) {
      // Find parent's children
      const parent = await prisma.parent.findUnique({
        where: { userId: user.userId },
        include: {
          students: {
            include: {
              feeInvoices: {
                where: { status: { in: ['UNPAID', 'PARTIAL'] } },
                orderBy: { dueDate: 'asc' },
              },
            },
          },
        },
      });

      if (parent && parent.students.length > 0) {
        let response = `Here is the current fee status for your registered children at A. P PUBLIC SCHOOL:\n\n`;
        parent.students.forEach((st) => {
          response += `👤 **${st.firstName} ${st.lastName}** (Admission No: ${st.admissionNo}):\n`;
          if (st.feeInvoices.length === 0) {
            response += `   ✅ All school fees are up to date! No pending dues.\n\n`;
          } else {
            st.feeInvoices.forEach((inv) => {
              response += `   ⚠️ ${inv.month}: Outstanding Balance ₹${inv.balanceAmount} (Due Date: ${inv.dueDate.toLocaleDateString('en-IN')})\n`;
            });
            response += `   👉 You can pay securely online via the Parent Portal Fee tab.\n\n`;
          }
        });

        return {
          answer: response,
          source: 'Verified Parent Account Records',
          allowed: true,
        };
      }
    }

    // 2. Search approved knowledge base (RAG matching)
    const matchingDocs = this.schoolKnowledgeBase.filter(
      (doc) =>
        doc.topic.toLowerCase().split(' ').some((word) => qLower.includes(word)) ||
        doc.content.toLowerCase().split(' ').some((word) => qLower.includes(word) && word.length > 4)
    );

    if (matchingDocs.length > 0) {
      const primaryDoc = matchingDocs[0];
      return {
        answer: `**${primaryDoc.topic}**:\n${primaryDoc.content}`,
        source: 'Approved A. P PUBLIC SCHOOL Handbook 2026-27',
        allowed: true,
      };
    }

    // 3. Fallback General Assistance
    return {
      answer: `Hello! I am the AI Assistant for A. P PUBLIC SCHOOL, Jhansi. I can help you with school timings, fee payment guidelines, CBSE examination grading, admissions, and student schedules. For administrative inquiries, please contact the Principal's office at +91-6306262479.`,
      source: 'School General FAQ',
      allowed: true,
    };
  }
}
