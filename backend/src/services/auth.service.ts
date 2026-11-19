import prisma, { isDbOnline } from '../prisma/client';
import { comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

/**
 * Production authentication is database-backed only.
 * Demo identities, JSON-file users, plaintext passwords and fallback login
 * are intentionally unavailable. Registration/OTP onboarding stays closed
 * until it is backed by a verified tenant-aware workflow.
 */
export class AuthService {
  private static unavailable(message: string): never {
    throw { status: 503, message };
  }

  static async sendOtp(_phone: string, _email?: string) {
    return this.unavailable('OTP delivery is not configured. No OTP was sent.');
  }

  static async verifyOtp(_phone: string, _otp: string) {
    return this.unavailable('OTP verification is unavailable until a real OTP provider is configured.');
  }

  static async registerTeacher(_data: {
    teacherId?: string;
    name: string;
    phone: string;
    email?: string;
    password: string;
    assignedClass: string;
    assignedSection: string;
    subject?: string;
  }) {
    return this.unavailable('Teacher registration is temporarily disabled until tenant-aware account provisioning is enabled.');
  }

  static async login(emailOrPhone: string, plainPass: string) {
    if (!isDbOnline) {
      return this.unavailable('Authentication database is unavailable. Sign-in is temporarily disabled.');
    }

    const key = emailOrPhone.toLowerCase().trim();
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: key }, { phone: emailOrPhone }] },
      include: {
        teacherProfile: true,
        parentProfile: true,
      },
    });

    if (!user || !user.isActive) {
      throw { status: 401, message: 'Invalid credentials.' };
    }

    const isMatch = await comparePassword(plainPass, user.passwordHash);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid credentials.' };
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

  static async register(_userData: any) {
    return this.unavailable('Self-service registration is disabled until tenant-aware onboarding and verified contact ownership are implemented.');
  }

  static async approveUser(_userId: string) {
    return this.unavailable('User approvals are temporarily disabled until tenant-scoped administration is implemented.');
  }

  static async rejectUser(_userId: string) {
    return this.unavailable('User approvals are temporarily disabled until tenant-scoped administration is implemented.');
  }

  static async getPendingUsers() {
    return this.unavailable('Pending-user listing is temporarily disabled until tenant-scoped administration is implemented.');
  }

  static async updatePrincipalCredentials(_data: {
    currentEmailOrPhone: string;
    newEmail?: string;
    newPassword?: string;
    newUserId?: string;
    otp?: string;
  }) {
    throw { status: 403, message: 'Credential changes must use the verified administrator password-reset workflow.' };
  }

  static async refreshToken(oldRefreshToken: string) {
    if (!isDbOnline) {
      return this.unavailable('Authentication database is unavailable. Token refresh is temporarily disabled.');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch {
      throw { status: 403, message: 'Invalid or expired refresh token.' };
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.isActive || user.email !== decoded.email || user.role !== decoded.role) {
      throw { status: 403, message: 'Refresh token is no longer valid. Please sign in again.' };
    }

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return { accessToken: generateAccessToken(payload) };
  }

  static async getCurrentUser(userId: string) {
    if (!isDbOnline) {
      return this.unavailable('User profile is unavailable while the database is offline.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        teacherProfile: true,
        parentProfile: true,
      },
    });
    if (!user || !user.isActive) {
      throw { status: 404, message: 'User not found or inactive.' };
    }
    return user;
  }
}
