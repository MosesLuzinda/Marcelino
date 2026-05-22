import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import {
  parentDashboard, mockParentChildren, mockChildPerformance, mockChildAttendance,
  mockNotifications,
} from "../config/dev-mock-data.js";
import { getDevInvoices } from "../config/dev-fees-store.js";
import { isDevMock } from "../config/dev-mock.js";

export const parentRouter = Router();
parentRouter.use(authenticateJWT, requireRole("PARENT", "SUPER_ADMIN", "ADMIN"));

async function getParent(userId: string) {
  const profile = await prisma.parentProfile.findUnique({
    where: { userId },
    include: { children: { include: { student: { include: { user: true, class: true } } } } },
  });
  if (!profile) throw new AppError(404, "Parent profile not found");
  return profile;
}

parentRouter.get("/dashboard", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) {
    return res.json({ success: true, data: parentDashboard() });
  }
  const parent = await getParent(req.user!.userId);
  const childIds = parent.children.map((c) => c.studentId);

  const [grades, attendance, invoices, notifications] = await Promise.all([
    prisma.grade.findMany({ where: { studentId: { in: childIds } }, take: 10, orderBy: { createdAt: "desc" } }),
    prisma.attendanceRecord.findMany({ where: { studentId: { in: childIds } }, take: 30, orderBy: { date: "desc" } }),
    prisma.invoice.findMany({ where: { studentId: { in: childIds } }, orderBy: { dueDate: "asc" } }),
    prisma.notification.findMany({ where: { userId: req.user!.userId, read: false }, take: 10 }),
  ]);

  res.json({ success: true, data: { parent, grades, attendance, invoices, notifications } });
}));

parentRouter.get("/children", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockParentChildren() });
  const parent = await getParent(req.user!.userId);
  res.json({ success: true, data: parent.children });
}));

parentRouter.get("/children/:studentId/performance", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockChildPerformance() });
  const grades = await prisma.grade.findMany({
    where: { studentId: req.params.studentId },
    orderBy: { createdAt: "desc" },
  });
  const attempts = await prisma.examAttempt.findMany({
    where: { studentId: req.params.studentId },
    include: { exam: true },
  });
  res.json({ success: true, data: { grades, exams: attempts } });
}));

parentRouter.get("/children/:studentId/attendance", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockChildAttendance() });
  const records = await prisma.attendanceRecord.findMany({
    where: { studentId: req.params.studentId },
    orderBy: { date: "desc" },
  });
  const present = records.filter((r) => r.status === "PRESENT").length;
  res.json({ success: true, data: { records, rate: records.length ? (present / records.length) * 100 : 0 } });
}));

parentRouter.get("/fees", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: getDevInvoices() });
  const parent = await getParent(req.user!.userId);
  const childIds = parent.children.map((c) => c.studentId);
  const invoices = await prisma.invoice.findMany({
    where: { studentId: { in: childIds } },
    include: { payments: true, student: { include: { user: true } } },
    orderBy: { dueDate: "asc" },
  });
  res.json({ success: true, data: invoices });
}));

parentRouter.get("/notifications", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockNotifications() });
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({ success: true, data: notifications });
}));
