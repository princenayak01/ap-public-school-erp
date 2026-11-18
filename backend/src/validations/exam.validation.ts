import { z } from 'zod';
import { ExamTerm } from '@prisma/client';

export const createExamSchema = z.object({
  name: z.string().min(3, 'Exam name is required (e.g. Mid-Term Exam 2026)'),
  term: z.nativeEnum(ExamTerm),
  academicYearId: z.string().uuid('Academic Year is required'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid start date required' }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid end date required' }),
});

export const scheduleExamSubjectSchema = z.object({
  examId: z.string().uuid('Exam ID required'),
  classId: z.string().uuid('Class ID required'),
  subjectId: z.string().uuid('Subject ID required'),
  examDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid exam date required' }),
  maxMarks: z.number().positive().default(100),
  passMarks: z.number().positive().default(33),
});

export const enterMarksSchema = z.object({
  examSubjectId: z.string().uuid('Exam Subject ID required'),
  marksList: z.array(
    z.object({
      studentId: z.string().uuid('Student ID required'),
      marksObtained: z.number().min(0),
      isAbsent: z.boolean().default(false),
      remarks: z.string().optional(),
    })
  ).min(1, 'At least one student mark entry required'),
});

export const generateReportCardsSchema = z.object({
  examId: z.string().uuid('Exam ID required'),
  classId: z.string().uuid('Class ID required'),
  academicYearId: z.string().uuid('Academic Year required'),
});
