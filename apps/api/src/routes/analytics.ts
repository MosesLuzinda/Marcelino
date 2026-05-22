import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requirePermission } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { mockAnalyticsInsights } from "../config/dev-mock-data.js";
import { isDevMock } from "../config/dev-mock.js";

export const analyticsRouter = Router();
analyticsRouter.use(authenticateJWT, requirePermission("reports:read", "*"));

analyticsRouter.get("/insights", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockAnalyticsInsights() });
  const [students, teachers, payments, attendance, grades] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true }, _count: true }),
    prisma.attendanceRecord.groupBy({ by: ["status"], _count: true }),
    prisma.grade.findMany({ take: 500 }),
  ]);

  const avgGrade = grades.length
    ? grades.reduce((s, g) => s + Number(g.score) / Number(g.maxScore) * 100, 0) / grades.length
    : 0;

  const presentCount = attendance.find((a) => a.status === "PRESENT")?._count || 0;
  const totalAttendance = attendance.reduce((s, a) => s + a._count, 0);
  const attendanceRate = totalAttendance ? (presentCount / totalAttendance) * 100 : 0;

  const overdueInvoices = await prisma.invoice.count({ where: { status: "OVERDUE" } });

  const insights = [
    { type: "info", title: "Enrollment", value: students, description: `${students} active students enrolled` },
    { type: "success", title: "Revenue", value: payments._sum.amount || 0, description: `${payments._count} completed payments` },
    { type: avgGrade < 60 ? "warning" : "success", title: "Average Performance", value: `${avgGrade.toFixed(1)}%`, description: "School-wide grade average" },
    { type: attendanceRate < 80 ? "warning" : "success", title: "Attendance Rate", value: `${attendanceRate.toFixed(1)}%`, description: "Overall attendance this period" },
    ...(overdueInvoices > 0 ? [{ type: "error", title: "Overdue Fees", value: overdueInvoices, description: "Invoices requiring follow-up" }] : []),
  ];

  res.json({ success: true, data: { insights, summary: { students, teachers, avgGrade, attendanceRate, revenue: payments._sum.amount } } });
}));

analyticsRouter.get("/enrollment-trend", asyncHandler(async (_req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    include: { academicYear: true },
    orderBy: { enrolledAt: "asc" },
  });
  const byMonth: Record<string, number> = {};
  for (const e of enrollments) {
    const key = e.enrolledAt.toISOString().slice(0, 7);
    byMonth[key] = (byMonth[key] || 0) + 1;
  }
  res.json({ success: true, data: Object.entries(byMonth).map(([month, count]) => ({ month, count })) });
}));

analyticsRouter.get("/revenue-trend", asyncHandler(async (_req, res) => {
  const payments = await prisma.payment.findMany({
    where: { status: "COMPLETED" },
    orderBy: { paidAt: "asc" },
    take: 500,
  });
  const byMonth: Record<string, number> = {};
  for (const p of payments) {
    const key = (p.paidAt || p.createdAt).toISOString().slice(0, 7);
    byMonth[key] = (byMonth[key] || 0) + Number(p.amount);
  }
  res.json({ success: true, data: Object.entries(byMonth).map(([month, amount]) => ({ month, amount })) });
}));
