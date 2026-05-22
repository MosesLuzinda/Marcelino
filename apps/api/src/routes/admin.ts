import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requireRole, requirePermission } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { hashPassword } from "../services/auth.service.js";
import {
  adminDashboard, mockAdminStudents, mockAdminTeachers, mockAdminClasses,
  mockAdminFinance, mockAdminPayroll, mockAdminSettings,
} from "../config/dev-mock-data.js";
import { isDevMock } from "../config/dev-mock.js";

export const adminRouter = Router();
adminRouter.use(authenticateJWT, requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "HR"));

adminRouter.get("/dashboard", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) {
    const data = adminDashboard();
    return res.json({ success: true, data });
  }
  const [students, teachers, parents, classes, revenue, attendance] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.parentProfile.count(),
    prisma.class.count(),
    prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
    prisma.attendanceRecord.groupBy({ by: ["status"], _count: true }),
  ]);
  res.json({
    success: true,
    data: { students, teachers, parents, classes, revenue: revenue._sum.amount || 0, attendance },
  });
}));

// Students CRUD
adminRouter.get("/students", requirePermission("students:read", "*"), asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockAdminStudents() });
  const students = await prisma.studentProfile.findMany({
    include: { user: true, class: true, section: true },
    take: 100,
  });
  res.json({ success: true, data: students });
}));

adminRouter.post("/students", requirePermission("students:write"), asyncHandler(async (req, res) => {
  const { email, firstName, lastName, password, classId, sectionId } = req.body;
  const user = await prisma.user.create({
    data: { email, firstName, lastName, passwordHash: await hashPassword(password || "Student@123"), schoolId: (await prisma.school.findFirst())?.id },
  });
  const role = await prisma.role.findUnique({ where: { name: "STUDENT" } });
  if (role) await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
  const student = await prisma.studentProfile.create({
    data: { userId: user.id, studentId: `STU${Date.now().toString().slice(-6)}`, classId, sectionId },
    include: { user: true },
  });
  res.json({ success: true, data: student });
}));

adminRouter.patch("/students/:id", requirePermission("students:write"), asyncHandler(async (req, res) => {
  const student = await prisma.studentProfile.update({
    where: { id: req.params.id },
    data: req.body,
    include: { user: true },
  });
  res.json({ success: true, data: student });
}));

// Teachers CRUD
adminRouter.get("/teachers", requirePermission("teachers:read", "*"), asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockAdminTeachers() });
  const teachers = await prisma.teacherProfile.findMany({ include: { user: true } });
  res.json({ success: true, data: teachers });
}));

adminRouter.post("/teachers", requirePermission("teachers:write"), asyncHandler(async (req, res) => {
  const { email, firstName, lastName, password, departmentId } = req.body;
  const user = await prisma.user.create({
    data: { email, firstName, lastName, passwordHash: await hashPassword(password || "Teacher@123") },
  });
  const role = await prisma.role.findUnique({ where: { name: "TEACHER" } });
  if (role) await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
  const teacher = await prisma.teacherProfile.create({
    data: { userId: user.id, employeeId: `TCH${Date.now().toString().slice(-6)}`, departmentId },
    include: { user: true },
  });
  res.json({ success: true, data: teacher });
}));

// Parents CRUD
adminRouter.get("/parents", requirePermission("parents:read"), asyncHandler(async (_req, res) => {
  const parents = await prisma.parentProfile.findMany({
    include: { user: true, children: { include: { student: { include: { user: true } } } } },
  });
  res.json({ success: true, data: parents });
}));

// Classes CRUD
adminRouter.get("/classes", requirePermission("classes:read", "*"), asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockAdminClasses() });
  const classes = await prisma.class.findMany({ include: { sections: true, students: true } });
  res.json({ success: true, data: classes });
}));

adminRouter.post("/classes", requirePermission("classes:write"), asyncHandler(async (req, res) => {
  const school = await prisma.school.findFirst();
  const cls = await prisma.class.create({
    data: { ...req.body, schoolId: school!.id },
    include: { sections: true },
  });
  res.json({ success: true, data: cls });
}));

// Courses CRUD
adminRouter.get("/courses", requirePermission("courses:read"), asyncHandler(async (_req, res) => {
  const courses = await prisma.course.findMany({ include: { subject: true } });
  res.json({ success: true, data: courses });
}));

adminRouter.post("/courses", requirePermission("courses:write"), asyncHandler(async (req, res) => {
  const course = await prisma.course.create({ data: req.body, include: { subject: true } });
  res.json({ success: true, data: course });
}));

// Fee structures
adminRouter.get("/fee-structures", requirePermission("fees:read"), asyncHandler(async (_req, res) => {
  const structures = await prisma.feeStructure.findMany({ include: { items: true } });
  res.json({ success: true, data: structures });
}));

adminRouter.post("/fee-structures", requirePermission("fees:write"), asyncHandler(async (req, res) => {
  const school = await prisma.school.findFirst();
  const structure = await prisma.feeStructure.create({
    data: { ...req.body, schoolId: school!.id, items: { create: req.body.items } },
    include: { items: true },
  });
  res.json({ success: true, data: structure });
}));

// Payroll
adminRouter.get("/payroll", requirePermission("payroll:read", "*"), asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockAdminPayroll() });
  const runs = await prisma.payrollRun.findMany({ include: { entries: true }, orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: runs });
}));

adminRouter.post("/payroll", requirePermission("payroll:write"), asyncHandler(async (req, res) => {
  const run = await prisma.payrollRun.create({
    data: { name: req.body.name, period: req.body.period, entries: { create: req.body.entries } },
    include: { entries: true },
  });
  res.json({ success: true, data: run });
}));

// Reports
adminRouter.get("/reports/enrollment", requirePermission("reports:read"), asyncHandler(async (_req, res) => {
  const enrollment = await prisma.enrollment.groupBy({
    by: ["academicYearId"],
    _count: true,
  });
  res.json({ success: true, data: enrollment });
}));

adminRouter.get("/reports/finance", requirePermission("reports:read", "*"), asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockAdminFinance() });
  const payments = await prisma.payment.groupBy({
    by: ["provider"],
    where: { status: "COMPLETED" },
    _sum: { amount: true },
    _count: true,
  });
  const overdue = await prisma.invoice.count({ where: { status: "OVERDUE" } });
  res.json({ success: true, data: { payments, overdue } });
}));

// RBAC
adminRouter.get("/roles", requirePermission("settings:read"), asyncHandler(async (_req, res) => {
  const roles = await prisma.role.findMany({ include: { permissions: { include: { permission: true } } } });
  res.json({ success: true, data: roles });
}));

adminRouter.post("/users/:userId/roles", requirePermission("settings:write"), asyncHandler(async (req, res) => {
  const { roleId } = req.body;
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: req.params.userId, roleId } },
    update: {},
    create: { userId: req.params.userId, roleId },
  });
  res.json({ success: true });
}));

// Settings
adminRouter.get("/settings", requirePermission("settings:read", "*"), asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockAdminSettings() });
  const settings = await prisma.setting.findMany();
  res.json({ success: true, data: settings });
}));

adminRouter.put("/settings/:key", requirePermission("settings:write"), asyncHandler(async (req, res) => {
  const setting = await prisma.setting.upsert({
    where: { key: req.params.key },
    update: { value: req.body.value },
    create: { key: req.params.key, value: req.body.value },
  });
  res.json({ success: true, data: setting });
}));

// CMS
adminRouter.post("/cms/pages", requirePermission("settings:write"), asyncHandler(async (req, res) => {
  const page = await prisma.cmsPage.upsert({
    where: { slug: req.body.slug },
    update: req.body,
    create: req.body,
  });
  res.json({ success: true, data: page });
}));

adminRouter.post("/announcements", requirePermission("settings:write"), asyncHandler(async (req, res) => {
  const announcement = await prisma.announcement.create({ data: req.body });
  res.json({ success: true, data: announcement });
}));
