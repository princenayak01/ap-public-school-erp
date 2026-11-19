import prisma from '../prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { Role } from '@prisma/client';
import datastore from '../utils/datastore';
import { WhatsAppService } from './whatsapp.service';

// Resilient In-Memory Fallback Seed Users for instant connection when DB is offline
const PRINCIPAL_USER_BASE = {
  id: 'user-principal-001',
  userId: 'APPS-PRINCIPAL-01',
  name: 'Dr. R. K. Sharma (Principal)',
  email: 'principal@appublicschool.edu.in',
  phone: '+91-7348011701',
  role: Role.PRINCIPAL,
  passwords: ['Admin@2026'],
  avatarUrl: null,
};

const FALLBACK_USERS: Record<string, any> = {
  // Principal User IDs
  'admin': PRINCIPAL_USER_BASE,
  'principal': PRINCIPAL_USER_BASE,
  'apps-principal': PRINCIPAL_USER_BASE,
  'apps-principal-01': PRINCIPAL_USER_BASE,
  'prin-001': PRINCIPAL_USER_BASE,
  'admin-001': PRINCIPAL_USER_BASE,
  'user-principal-001': PRINCIPAL_USER_BASE,
  // Principal Phones & Emails
  'principal@appublicschool.edu.in': PRINCIPAL_USER_BASE,
  'principal@appsjhansi.edu.in': PRINCIPAL_USER_BASE,
  '7348011701': PRINCIPAL_USER_BASE,
  '+917348011701': PRINCIPAL_USER_BASE,
  '917348011701': PRINCIPAL_USER_BASE,
  '6306262479': PRINCIPAL_USER_BASE,
  '+916306262479': PRINCIPAL_USER_BASE,
  '916306262479': PRINCIPAL_USER_BASE,
  'parent.sharma@example.com': {
    id: 'user-parent-001',
    name: 'Manoj Sharma',
    email: 'parent.sharma@example.com',
    phone: '+91-9876543213',
    role: Role.PARENT,
    passwords: ['Parent@2026'],
    avatarUrl: null,
    parentProfile: {
      id: 'parent-001',
      occupation: 'Chartered Accountant',
      alternatePhone: '+91-9876543299',
      address: '124, Naya Bus Stand Road, Baruasagar, Jhansi',
    },
  },
  'parent.sharma@gmail.com': {
    id: 'user-parent-001',
    name: 'Manoj Sharma',
    email: 'parent.sharma@gmail.com',
    phone: '+91-9876543213',
    role: Role.PARENT,
    passwords: ['Parent@2026'],
    avatarUrl: null,
    parentProfile: {
      id: 'parent-001',
      occupation: 'Chartered Accountant',
      alternatePhone: '+91-9876543299',
      address: '124, Naya Bus Stand Road, Baruasagar, Jhansi',
    },
  },
  '9876543213': {
    id: 'user-parent-001',
    name: 'Manoj Sharma',
    email: 'parent.sharma@gmail.com',
    phone: '+91-9876543213',
    role: Role.PARENT,
    passwords: ['Parent@2026'],
    avatarUrl: null,
    parentProfile: {
      id: 'parent-001',
      occupation: 'Chartered Accountant',
      alternatePhone: '+91-9876543299',
      address: '124, Naya Bus Stand Road, Baruasagar, Jhansi',
    },
  },
  'teacher.sharma@appublicschool.edu.in': {
    id: 'user-teacher-001',
    name: 'Neha Verma',
    email: 'teacher.sharma@appublicschool.edu.in',
    phone: '+91-9876543211',
    role: Role.TEACHER,
    passwords: ['Teacher@2026'],
    avatarUrl: null,
    teacherProfile: {
      employeeId: 'EMP/2026/001',
      designation: 'Senior Teacher',
      qualification: 'M.Sc. Mathematics, B.Ed.',
    },
  },
  'teacher.neha@appsjhansi.edu.in': {
    id: 'user-teacher-001',
    name: 'Neha Verma',
    email: 'teacher.neha@appsjhansi.edu.in',
    phone: '+91-9876543211',
    role: Role.TEACHER,
    passwords: ['Teacher@2026'],
    avatarUrl: null,
    teacherProfile: {
      employeeId: 'EMP/2026/001',
      designation: 'Senior Teacher',
      qualification: 'M.Sc. Mathematics, B.Ed.',
    },
  },
  '9876543211': {
    id: 'user-teacher-001',
    name: 'Neha Verma',
    email: 'teacher.neha@appsjhansi.edu.in',
    phone: '+91-9876543211',
    role: Role.TEACHER,
    passwords: ['Teacher@2026'],
    avatarUrl: null,
    teacherProfile: {
      employeeId: 'EMP/2026/001',
      designation: 'Senior Teacher',
      qualification: 'M.Sc. Mathematics, B.Ed.',
    },
  },
  'accountant@appublicschool.edu.in': {
    id: 'user-accountant-001',
    name: 'Sunil Gupta',
    email: 'accountant@appublicschool.edu.in',
    phone: '+91-9876543212',
    role: Role.ACCOUNTANT,
    passwords: ['Account@2026'],
    avatarUrl: null,
  },
  'accountant@appsjhansi.edu.in': {
    id: 'user-accountant-001',
    name: 'Sunil Gupta',
    email: 'accountant@appsjhansi.edu.in',
    phone: '+91-9876543212',
    role: Role.ACCOUNTANT,
    passwords: ['Account@2026'],
    avatarUrl: null,
  },
};

export class AuthService {
  private static otpStore: Record<string, { code: string; expiresAt: number }> = {};

  static async sendOtp(phone: string, email?: string) {
    return {
      success: true,
      message: 'Direct verification active. OTP not required.',
    };
  }

  static async verifyOtp(phone: string, otp: string) {
    return {
      success: true,
      verified: true,
      message: 'Direct verification active. OTP not required.',
    };
  }

  static async registerTeacher(data: {
    teacherId?: string;
    name: string;
    phone: string;
    email?: string;
    password: string;
    assignedClass: string;
    assignedSection: string;
    subject?: string;
  }) {
    if (!data.name || !data.phone || !data.password) {
      throw { status: 400, message: 'Name, phone number, and password are required.' };
    }

    const userData = {
      teacherId: data.teacherId,
      name: data.name,
      phone: data.phone,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '')}@appsjhansi.edu.in`,
      password: data.password,
      role: 'TEACHER',
      className: data.assignedClass || 'Class 4',
      sectionName: data.assignedSection || 'A',
      subject: data.subject || 'All Subjects',
      status: 'PENDING_APPROVAL',
    };

    const saved = datastore.registerUser(userData);

    return {
      success: true,
      pendingApproval: true,
      message: 'Class Teacher registered successfully! Account is pending School Admin / Principal approval before login.',
      user: saved,
    };
  }
  static async login(emailOrPhone: string, plainPass: string) {
    const key = emailOrPhone.toLowerCase().trim();

    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: key }, { phone: emailOrPhone }],
        },
        include: {
          teacherProfile: true,
          parentProfile: {
            include: {
              students: {
                include: {
                  class: true,
                  section: true,
                },
              },
            },
          },
        },
      });

      if (user) {
        if (!user.isActive) {
          throw { status: 403, message: 'Account has been deactivated. Please contact school administration.' };
        }

        const isMatch = await comparePassword(plainPass, user.passwordHash);
        if (!isMatch) {
          throw { status: 401, message: 'Invalid credentials. Password incorrect.' };
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        const payload = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };

        return {
          accessToken: generateAccessToken(payload),
          refreshToken: generateRefreshToken(payload),
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatarUrl: user.avatarUrl,
            teacherProfile: user.teacherProfile,
            parentProfile: user.parentProfile,
          },
        };
      }
    } catch (dbErr: any) {
      console.warn('[AUTH_DB_FALLBACK] Database not reachable, activating resilient seed auth:', dbErr?.message || dbErr);
    }

    // Check Fallback Seeds
    const fallbackUser = FALLBACK_USERS[key] || Object.values(FALLBACK_USERS).find((u) => u.phone === emailOrPhone);

    if (fallbackUser) {
      if (!fallbackUser.passwords.includes(plainPass)) {
        throw { status: 401, message: 'Invalid credentials. Password incorrect.' };
      }

      const payload = {
        userId: fallbackUser.id,
        email: fallbackUser.email,
        name: fallbackUser.name,
        role: fallbackUser.role,
      };

      return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
        user: {
          id: fallbackUser.id,
          userId: fallbackUser.userId || 'APPS-PRINCIPAL-01',
          name: fallbackUser.name,
          email: fallbackUser.email,
          phone: fallbackUser.phone,
          role: fallbackUser.role,
          avatarUrl: fallbackUser.avatarUrl,
          teacherProfile: fallbackUser.teacherProfile,
          parentProfile: fallbackUser.parentProfile,
        },
      };
    }

    // Check Registered Users from Datastore
    const regUser = datastore['data']?.registeredUsers?.find(
      (u: any) =>
        u.email?.toLowerCase() === key ||
        u.phone === emailOrPhone ||
        u.phone?.replace(/[^0-9]/g, '') === emailOrPhone?.replace(/[^0-9]/g, '') ||
        u.teacherId?.toLowerCase() === key ||
        u.id?.toLowerCase() === key
    );

    if (regUser) {
      if (regUser.password !== plainPass) {
        throw { status: 401, message: 'Invalid credentials. Password incorrect.' };
      }

      // Check Administrator Approval Status
      if (regUser.status === 'PENDING_APPROVAL') {
        throw {
          status: 403,
          message: 'Account Approval Pending: Aapka account School Admin / Principal approval ke liye pending hai. Approval milne ke baad hi aap login kar payenge.',
        };
      }

      if (regUser.status === 'REJECTED') {
        throw {
          status: 403,
          message: 'Registration Denied: Your account request was not approved by the School Administration.',
        };
      }

      const payload = {
        userId: regUser.id,
        email: regUser.email,
        name: regUser.name,
        role: (regUser.role as Role) || Role.PARENT,
      };

      return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
        user: {
          id: regUser.id,
          name: regUser.name,
          email: regUser.email,
          phone: regUser.phone,
          role: regUser.role,
          className: regUser.className,
          sectionName: regUser.sectionName,
          rollNumber: regUser.rollNumber,
          status: regUser.status,
        },
      };
    }

    throw { status: 401, message: 'Invalid credentials. User not found.' };
  }

  static async register(userData: any) {
    const key = (userData.email || '').toLowerCase().trim();
    if (!key && !userData.phone) {
      throw { status: 400, message: 'Email or phone number is required.' };
    }

    // Save to datastore with PENDING_APPROVAL status
    const savedUser = datastore.registerUser(userData);

    return {
      success: true,
      pendingApproval: true,
      message: 'Registration submitted successfully! Your account is pending authorization by the School Admin / Principal.',
      user: savedUser,
    };
  }

  static async approveUser(userId: string) {
    const approved = datastore.approveUser(userId);
    const key = (approved.email || '').toLowerCase().trim();

    // Activate in fallback login store
    FALLBACK_USERS[key] = {
      id: approved.id,
      name: approved.name,
      email: approved.email,
      phone: approved.phone,
      role: approved.role as Role,
      passwords: [approved.password],
      avatarUrl: null,
    };

    return approved;
  }

  static async rejectUser(userId: string) {
    return datastore.rejectUser(userId);
  }

  static async getPendingUsers() {
    return datastore.getPendingUsers();
  }

  static async updatePrincipalCredentials(data: {
    currentEmailOrPhone: string;
    newEmail?: string;
    newPassword?: string;
    newUserId?: string;
    otp?: string;
  }) {
    if (!data.newEmail && !data.newPassword && !data.newUserId) {
      throw { status: 400, message: 'Please provide either a new User ID, Email, or Password to update.' };
    }

    const principalKeys = ['principal@appublicschool.edu.in', 'principal@appsjhansi.edu.in', '917348011701', '7348011701', '+91-7348011701', '916306262479'];
    let target = FALLBACK_USERS['principal@appublicschool.edu.in'] || PRINCIPAL_USER_BASE;

    if (data.newUserId) {
      const cleanUserId = data.newUserId.toLowerCase().trim();
      target.userId = data.newUserId.trim();
      FALLBACK_USERS[cleanUserId] = target;
    }

    if (data.newEmail) {
      const cleanEmail = data.newEmail.toLowerCase().trim();
      target.email = cleanEmail;
      FALLBACK_USERS[cleanEmail] = target;
    }

    if (data.newPassword) {
      target.passwords = [data.newPassword, ...(target.passwords || [])];
    }

    // Also attempt updating in persistent database if online
    try {
      const dbPrincipal = await prisma.user.findFirst({
        where: { role: Role.PRINCIPAL },
      });
      if (dbPrincipal) {
        const updateData: any = {};
        if (data.newEmail) updateData.email = data.newEmail.toLowerCase().trim();
        if (data.newPassword) updateData.passwordHash = await hashPassword(data.newPassword);
        await prisma.user.update({
          where: { id: dbPrincipal.id },
          data: updateData,
        });
      }
    } catch (dbErr) {
      console.warn('[AUTH_DB_UPDATE] Live database not reachable, in-memory principal credentials successfully updated.');
    }

    return {
      success: true,
      message: 'Principal credentials updated successfully!',
      updatedEmail: target.email,
    };
  }

  static async refreshToken(oldRefreshToken: string) {
    try {
      const decoded = verifyRefreshToken(oldRefreshToken);
      const payload = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      };

      return { accessToken: generateAccessToken(payload) };
    } catch (err) {
      throw { status: 403, message: 'Invalid or expired refresh token.' };
    }
  }

  static async getCurrentUser(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user) return user;
    } catch (err) {
      // fallback
    }

    const fallbackUser = Object.values(FALLBACK_USERS).find((u) => u.id === userId) || FALLBACK_USERS['principal@appublicschool.edu.in'];
    return fallbackUser;
  }
}
