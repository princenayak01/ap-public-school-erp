import prisma from '../prisma/client';
import { hashPassword } from '../utils/password';
import { Role, StudentStatus } from '@prisma/client';

export class StudentService {
  static async admitStudent(data: any) {
    // 1. Check or Create Parent Account
    let parent = await prisma.parent.findFirst({
      where: { fatherPhone: data.fatherPhone },
    });

    if (!parent) {
      // Check if user account with parent email exists
      let parentUser = await prisma.user.findUnique({
        where: { email: data.parentEmail.toLowerCase() },
      });

      if (!parentUser) {
        // Create user for parent with default portal password
        const defaultPasswordHash = await hashPassword('parent123');
        parentUser = await prisma.user.create({
          data: {
            email: data.parentEmail.toLowerCase(),
            phone: data.fatherPhone,
            name: data.fatherName,
            role: Role.PARENT,
            passwordHash: defaultPasswordHash,
          },
        });
      }

      parent = await prisma.parent.create({
        data: {
          userId: parentUser.id,
          fatherName: data.fatherName,
          fatherPhone: data.fatherPhone,
          fatherOccupation: data.fatherOccupation,
          motherName: data.motherName,
          motherPhone: data.motherPhone,
          motherOccupation: data.motherOccupation,
          address: data.address,
          city: data.city || 'Jhansi',
          state: data.state || 'Uttar Pradesh',
          pincode: data.pincode || '284001',
        },
      });
    }

    // 2. Create Student Record
    const student = await prisma.student.create({
      data: {
        admissionNo: data.admissionNo,
        rollNo: data.rollNo || null,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: new Date(data.dob),
        gender: data.gender,
        bloodGroup: data.bloodGroup || null,
        category: data.category || 'General',
        aadhaarNo: data.aadhaarNo || null,
        classId: data.classId,
        sectionId: data.sectionId,
        parentId: parent.id,
        status: StudentStatus.ACTIVE,
      },
      include: {
        class: true,
        section: true,
        parent: {
          include: { user: { select: { email: true, phone: true } } },
        },
      },
    });

    return student;
  }

  static async getStudents(filters: {
    classId?: string;
    sectionId?: string;
    search?: string;
    status?: StudentStatus;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.classId) where.classId = filters.classId;
    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { admissionNo: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [total, students] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          class: true,
          section: true,
          parent: true,
        },
        orderBy: [{ class: { numericOrder: 'asc' } }, { rollNo: 'asc' }],
      }),
    ]);

    return {
      students,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getStudentById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
        section: true,
        parent: {
          include: {
            user: { select: { email: true, phone: true } },
          },
        },
        attendances: {
          take: 30,
          orderBy: { date: 'desc' },
        },
        feeInvoices: {
          include: { payments: true },
          orderBy: { dueDate: 'desc' },
        },
        reportCards: {
          include: { exam: true },
          orderBy: { publishedAt: 'desc' },
        },
        documents: true,
      },
    });

    if (!student) throw { status: 404, message: 'Student not found.' };
    return student;
  }

  static async updateStudent(id: string, updateData: any) {
    const student = await prisma.student.update({
      where: { id },
      data: {
        ...(updateData.firstName ? { firstName: updateData.firstName } : {}),
        ...(updateData.lastName ? { lastName: updateData.lastName } : {}),
        ...(updateData.rollNo !== undefined ? { rollNo: updateData.rollNo } : {}),
        ...(updateData.dob ? { dob: new Date(updateData.dob) } : {}),
        ...(updateData.gender ? { gender: updateData.gender } : {}),
        ...(updateData.bloodGroup !== undefined ? { bloodGroup: updateData.bloodGroup } : {}),
        ...(updateData.category ? { category: updateData.category } : {}),
        ...(updateData.aadhaarNo !== undefined ? { aadhaarNo: updateData.aadhaarNo } : {}),
        ...(updateData.classId ? { classId: updateData.classId } : {}),
        ...(updateData.sectionId ? { sectionId: updateData.sectionId } : {}),
        ...(updateData.status ? { status: updateData.status } : {}),
        ...(updateData.photoUrl !== undefined ? { photoUrl: updateData.photoUrl } : {}),
      },
      include: { class: true, section: true, parent: true },
    });

    return student;
  }

  static async promoteStudents(studentIds: string[], targetClassId: string, targetSectionId: string) {
    const result = await prisma.student.updateMany({
      where: { id: { in: studentIds } },
      data: {
        classId: targetClassId,
        sectionId: targetSectionId,
      },
    });

    return {
      success: true,
      promotedCount: result.count,
    };
  }
}
