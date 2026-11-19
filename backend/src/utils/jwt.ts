import jwt from 'jsonwebtoken';
import config from '../config';
import { Role } from '@prisma/client';

const TOKEN_ISSUER = 'ap-public-school-erp';
const TOKEN_AUDIENCE = 'ap-public-school-erp-client';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

const tokenOptions = (expiresIn: string) => ({
  expiresIn: expiresIn as any,
  issuer: TOKEN_ISSUER,
  audience: TOKEN_AUDIENCE,
  algorithm: 'HS256' as const,
});

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, tokenOptions(config.jwt.accessExpiresIn));
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, tokenOptions(config.jwt.refreshExpiresIn));
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.accessSecret, {
    algorithms: ['HS256'],
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
  }) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret, {
    algorithms: ['HS256'],
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
  }) as TokenPayload;
}
