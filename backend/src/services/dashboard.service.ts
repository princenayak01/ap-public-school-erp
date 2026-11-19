import prisma from '../prisma/client';
import { Role, StudentStatus, AttendanceStatus } from '@prisma/client';

export class DashboardService {
  static async getPrincipalDashboardData(academicYearId?: string) {
    const [totalStudents, totalTeachers, totalParents, totalAdmins] = await Promise.all([
      prisma.student.count({ where: { status: StudentStatus.ACTIVE } }),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.user.count({ where: { role: { in: [Role.PRINCIPAL, Role.SCHOOL_ADMIN] } } }),
    ]);

    const classes = await prisma.class.findMany({
      ...(academicYearId ? { where: { academicYearId } } : {}),
      include: { _count: { select: { students: true } } },
      orderBy: { numericOrder: 'asc' },
    });

    const classDistribution = classes.map((c) => ({
      classId: c.id,
      className: c.name,
      studentCount: c._count.students,
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await prisma.attendance.groupBy({
      by: ['status'],
      where: { date: today },
      _count: { status: true },
    });

    let presentToday = 0;
    let absentToday = 0;
    let leaveToday = 0;
    todayAttendance.forEach((item) => {
      if (item.status === AttendanceStatus.PRESENT) presentToday = item._count.status;
      if (item.status === AttendanceStatus.ABSENT) absentToday = item._count.status;
      if (item.status === AttendanceStatus.LEAVE) leaveToday = item._count.status;
    });

    const totalMarkedToday = presentToday + absentToday + leaveToday;
    const attendanceRate = totalMarkedToday > 0
      ? Number(((presentToday / totalMarkedToday) * 100).toFixed(1))
      : 0;

    const [feePaidAgg, feeTotalAgg] = await Promise.all([
      prisma.feePayment.aggregate({ _sum: { amountPaid: true } }),
      prisma.feeInvoice.aggregate({ _sum: { totalAmount: true } }),
    ]);
    const totalCollected = Number(feePaidAgg._sum?.amountPaid || 0);
    const totalBilled = Number(feeTotalAgg._sum?.totalAmount || 0);
    const totalPending = Math.max(0, totalBilled - totalCollected);

    const recentAdmissions = await prisma.student.findMany({
      take: 5,
      orderBy: { admissionDate: 'desc' },
      ...(academicYearId ? { where: { class: { academicYearId } } } : {}),
      include: {
        class: true,
        section: true,
        parent: { include: { user: { select: { name: true } } } },
      },
    });

    return {
      kpis: {
        totalStudents,
        totalTeachers,
        totalParents,
        totalAdmins,
        presentToday,
        absentToday,
        attendanceRate,
        totalCollected,
        totalBilled,
        totalPending,
        collectionRate: totalBilled > 0
          ? ((totalCollected / totalBilled) * 100).toFixed(1)
          : '0.0',
      },
      classDistribution,
      recentAdmissions: recentAdmissions.map((student) => ({
        id: student.id,
        admissionNo: student.admissionNo,
        name: `${student.firstName} ${student.lastName}`,
        className: `${student.class.name} - ${student.section.name}`,
        admissionDate: student.admissionDate,
        parentName: student.parent?.user?.name || 'Parent/Guardian',
      })),
    };
  }
}
