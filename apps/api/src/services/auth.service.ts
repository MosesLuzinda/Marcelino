import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@marcelino/database";
import type { JwtPayload } from "@marcelino/shared";
import { ROLE_PERMISSIONS } from "@marcelino/shared";

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

export async function getUserPermissions(userId: string): Promise<{ roles: string[]; permissions: string[] }> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });

  const roles = userRoles.map((ur) => ur.role.name);
  const permSet = new Set<string>();

  for (const ur of userRoles) {
    if (ROLE_PERMISSIONS[ur.role.name]?.includes("*")) {
      permSet.add("*");
      break;
    }
    for (const rp of ur.role.permissions) {
      permSet.add(`${rp.permission.resource}:${rp.permission.action}`);
    }
    for (const p of ROLE_PERMISSIONS[ur.role.name] || []) {
      permSet.add(p);
    }
  }

  return { roles, permissions: Array.from(permSet) };
}

export async function createTokens(userId: string, email: string, schoolId?: string) {
  const { roles, permissions } = await getUserPermissions(userId);

  const payload: JwtPayload = { userId, email, roles, permissions, schoolId };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: ACCESS_EXPIRES } as SignOptions);
  const refreshToken = uuidv4();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { userId, token: refreshToken, expiresAt },
  });

  return { accessToken, refreshToken, user: payload };
}

export async function refreshAccessToken(refreshToken: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) throw new Error("User not found");

  await prisma.refreshToken.delete({ where: { id: stored.id } });
  return createTokens(user.id, user.email, user.schoolId || undefined);
}

export async function loginWithPassword(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return createTokens(user.id, user.email, user.schoolId || undefined);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
