import { z } from 'zod';
import { AttendanceStatus } from '@prisma/client';

export const markDailyAttendanceSchema = z.object({
  sectionId: z.string().uuid('Section ID is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid date required' }),
  records: z.array(
    z.object({
      studentId: z.string().uuid('Student ID is required'),
      status: z.nativeEnum(AttendanceStatus),
      remark: z.string().optional(),
    })
  ).min(1, 'At least one student record is required'),
});

export const bulkDateRangeAttendanceSchema = z.object({
  sectionId: z.string().uuid('Section ID is required'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid Start Date required' }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid End Date required' }),
  defaultStatus: z.nativeEnum(AttendanceStatus).default(AttendanceStatus.PRESENT),
  excludeSundays: z.boolean().default(true),
});

export const markTeacherAttendanceSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid date required' }),
  records: z.array(
    z.object({
      teacherId: z.string().uuid('Teacher ID is required'),
      status: z.nativeEnum(AttendanceStatus),
      checkIn: z.string().optional(),
      checkOut: z.string().optional(),
      remark: z.string().optional(),
    })
  ).min(1, 'At least one teacher record required'),
});
