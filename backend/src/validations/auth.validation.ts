import { z } from 'zod';
import { Role } from '@prisma/client';

export const loginSchema = z.object({
  emailOrPhone: z.string().min(3, 'Email or Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token is required'),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(Role),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Old password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});
