import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@marcelino/database";
import { loginSchema, registerSchema } from "@marcelino/shared";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { authenticateJWT } from "../middleware/auth.js";
import { createTokens, loginWithPassword, refreshAccessToken, hashPassword } from "../services/auth.service.js";
import { verifyFirebaseToken } from "../services/firebase.service.js";
import { devLogin } from "../config/dev-users.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  if (process.env.DEV_MOCK_AUTH === "true") {
    const user = devLogin(email, password);
    if (!user) throw new AppError(401, "Invalid credentials");
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
    res.json({ success: true, data: { accessToken, user } });
    return;
  }

  try {
    const tokens = await loginWithPassword(email, password);
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, data: { accessToken: tokens.accessToken, user: tokens.user } });
  } catch {
    const user = devLogin(email, password);
    if (!user) throw new AppError(401, "Invalid credentials");
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
    res.json({ success: true, data: { accessToken, user, message: "Dev mock auth (database unavailable)" } });
  }
}));

authRouter.post("/register", asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(400, "Email already registered");

  const school = await prisma.school.findFirst();
  const user = await prisma.user.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash: await hashPassword(data.password),
      schoolId: school?.id,
    },
  });

  const roleName = data.role || "STUDENT";
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (role) await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });

  if (roleName === "STUDENT") {
    await prisma.studentProfile.create({
      data: { userId: user.id, studentId: `STU${Date.now().toString().slice(-6)}` },
    });
  } else if (roleName === "PARENT") {
    await prisma.parentProfile.create({ data: { userId: user.id } });
  } else if (roleName === "TEACHER") {
    await prisma.teacherProfile.create({
      data: { userId: user.id, employeeId: `TCH${Date.now().toString().slice(-6)}` },
    });
  }

  const tokens = await createTokens(user.id, user.email, user.schoolId || undefined);
  res.json({ success: true, data: { accessToken: tokens.accessToken, user: tokens.user } });
}));

authRouter.post("/sync-firebase", asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) throw new AppError(400, "idToken required");

  const decoded = await verifyFirebaseToken(idToken);
  let user = await prisma.user.findFirst({
    where: { OR: [{ firebaseUid: decoded.uid }, { email: decoded.email! }] },
  });

  if (!user) {
    const school = await prisma.school.findFirst();
    user = await prisma.user.create({
      data: {
        firebaseUid: decoded.uid,
        email: decoded.email!,
        firstName: decoded.email?.split("@")[0] || "User",
        lastName: "",
        schoolId: school?.id,
        emailVerified: true,
      },
    });
  } else if (!user.firebaseUid) {
    await prisma.user.update({ where: { id: user.id }, data: { firebaseUid: decoded.uid } });
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const tokens = await createTokens(user.id, user.email, user.schoolId || undefined);
  res.json({ success: true, data: { accessToken: tokens.accessToken, user: tokens.user } });
}));

authRouter.post("/refresh", asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new AppError(401, "Refresh token required");
  const tokens = await refreshAccessToken(token);
  res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, data: { accessToken: tokens.accessToken, user: tokens.user } });
}));

authRouter.get("/me", authenticateJWT, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: {
      roles: { include: { role: true } },
      studentProfile: true,
      teacherProfile: true,
      parentProfile: { include: { children: { include: { student: { include: { user: true } } } } } },
    },
  });
  res.json({ success: true, data: user });
}));

authRouter.post("/bootstrap", asyncHandler(async (req, res) => {
  if (req.body.secret !== process.env.BOOTSTRAP_SECRET) throw new AppError(403, "Invalid bootstrap secret");

  const existing = await prisma.user.findFirst({ where: { email: "admin@marcelino.edu" } });
  if (existing) throw new AppError(400, "Admin already exists");

  const school = await prisma.school.upsert({
    where: { slug: "marcelino" },
    update: {},
    create: {
      name: "Marcelino International Academy",
      slug: "marcelino",
      motto: "Excellence Through Education",
      email: "info@marcelino.edu",
      phone: "+256 700 000 000",
      address: "Kampala, Uganda",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@marcelino.edu",
      firstName: "System",
      lastName: "Administrator",
      passwordHash: await hashPassword("Admin@123456"),
      schoolId: school.id,
      emailVerified: true,
    },
  });

  const role = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  if (role) await prisma.userRole.create({ data: { userId: admin.id, roleId: role.id } });

  res.json({ success: true, message: "Admin created: admin@marcelino.edu / Admin@123456" });
}));

authRouter.post("/logout", authenticateJWT, asyncHandler(async (req, res) => {
  await prisma.refreshToken.deleteMany({ where: { userId: req.user!.userId } });
  res.clearCookie("refreshToken");
  res.json({ success: true });
}));
