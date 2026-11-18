import prisma from '../prisma/client';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceService {
  // 1. Mark Daily Attendance for a Section
  static async markSectionAttendance(sectionId: string, dateStr: string, records: { studentId: string; status: AttendanceStatus; remark?: string }[], markedByUserId?: string) {
    const attendanceDate = new Date(dateStr);
    const results = [];

    for (const item of records) {
      const record = await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: item.studentId,
            date: attendanceDate,
          },
        },
        update: {
          status: item.status,
          remark: item.remark || null,
          markedByUserId,
        },
        create: {
          studentId: item.studentId,
          sectionId,
          date: attendanceDate,
          status: item.status,
          remark: item.remark || null,
          markedByUserId,
        },
      });

      results.push(record);
    }

    return {
      success: true,
      sectionId,
      date: dateStr,
      markedCount: results.length,
    };
  }

  // 2. Multi-Day Bulk Range Attendance Generator (All Days Save)
  static async bulkDateRangeAttendance(sectionId: string, startDateStr: string, endDateStr: string, defaultStatus: AttendanceStatus = AttendanceStatus.PRESENT, excludeSundays: boolean = true) {
    const students = await prisma.student.findMany({
      where: { sectionId, status: 'ACTIVE' },
      select: { id: true },
    });

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    let current = new Date(start);
    let totalCreated = 0;

    while (current <= end) {
      // 0 = Sunday
      if (excludeSundays && current.getDay() === 0) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      const dateClone = new Date(current);

      for (const st of students) {
        await prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: st.id,
              date: dateClone,
            },
          },
          update: { status: defaultStatus },
          create: {
            studentId: st.id,
            sectionId,
            date: dateClone,
            status: defaultStatus,
          },
        });
        totalCreated++;
      }

      current.setDate(current.getDate() + 1);
    }

    return {
      success: true,
      sectionId,
      startDate: startDateStr,
      endDate: endDateStr,
      totalRecordsSaved: totalCreated,
    };
  }

  // 3. Get Attendance Sheet for a Section on a Specific Date
  static async getSectionDailySheet(sectionId: string, dateStr: string) {
    const targetDate = new Date(dateStr);

    const students = await prisma.student.findMany({
      where: { sectionId, status: 'ACTIVE' },
      include: {
        attendances: {
          where: { date: targetDate },
        },
      },
      orderBy: { rollNo: 'asc' },
    });

    return students.map((s) => ({
      studentId: s.id,
      admissionNo: s.admissionNo,
      rollNo: s.rollNo,
      name: `${s.firstName} ${s.lastName}`,
      status: s.attendances[0]?.status || 'NOT_MARKED',
      remark: s.attendances[0]?.remark || '',
    }));
  }

  // 4. Monthly Attendance Report for a Section
  static async getMonthlySectionReport(sectionId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // last day of month

    const students = await prisma.student.findMany({
      where: { sectionId, status: 'ACTIVE' },
      include: {
        attendances: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      orderBy: { rollNo: 'asc' },
    });

    return students.map((st) => {
      let present = 0;
      let absent = 0;
      let leave = 0;

      st.attendances.forEach((att) => {
        if (att.status === AttendanceStatus.PRESENT) present++;
        else if (att.status === AttendanceStatus.ABSENT) absent++;
        else if (att.status === AttendanceStatus.LEAVE) leave++;
      });

      const totalMarked = present + absent + leave;
      const percentage = totalMarked > 0 ? ((present / totalMarked) * 100).toFixed(1) : 0;

      return {
        studentId: st.id,
        admissionNo: st.admissionNo,
        rollNo: st.rollNo,
        name: `${st.firstName} ${st.lastName}`,
        present,
        absent,
        leave,
        totalDays: totalMarked,
        percentage: Number(percentage),
      };
    });
  }

  // 5. Teacher Attendance Tracking
  static async markTeacherAttendance(dateStr: string, records: { teacherId: string; status: AttendanceStatus; checkIn?: string; checkOut?: string; remark?: string }[]) {
    const attDate = new Date(dateStr);
    const results = [];

    for (const r of records) {
      const rec = await prisma.teacherAttendance.upsert({
        where: {
          teacherId_date: {
            teacherId: r.teacherId,
            date: attDate,
          },
        },
        update: {
          status: r.status,
          checkIn: r.checkIn ? new Date(r.checkIn) : undefined,
          checkOut: r.checkOut ? new Date(r.checkOut) : undefined,
          remark: r.remark || null,
        },
        create: {
          teacherId: r.teacherId,
          date: attDate,
          status: r.status,
          checkIn: r.checkIn ? new Date(r.checkIn) : undefined,
          checkOut: r.checkOut ? new Date(r.checkOut) : undefined,
          remark: r.remark || null,
        },
      });

      results.push(rec);
    }

    return results;
  }
}
