import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import {
  teacherDashboard, mockTeacherClasses, mockTeacherAssignments, mockTeacherAnalytics,
  mockTeacherExams, mockTeacherAttendance,
} from "../config/dev-mock-data.js";
import { isDevMock } from "../config/dev-mock.js";

export const teacherRouter = Router();
teacherRouter.use(authenticateJWT, requireRole("TEACHER", "SUPER_ADMIN", "ADMIN"));

async function getTeacher(userId: string) {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "Teacher profile not found");
  return profile;
}

teacherRouter.get("/dashboard", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) {
    return res.json({ success: true, data: teacherDashboard() });
  }
  const teacher = await getTeacher(req.user!.userId);
  const [classes, assignments, notifications] = await Promise.all([
    prisma.classSubject.findMany({ where: { teacherId: teacher.id }, include: { class: true, subject: true } }),
    prisma.assignment.count({ where: { teacherId: teacher.id } }),
    prisma.notification.findMany({ where: { userId: req.user!.userId, read: false }, take: 10 }),
  ]);
  res.json({ success: true, data: { teacher, classes, assignmentCount: assignments, notifications } });
}));

teacherRouter.get("/classes", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockTeacherClasses() });
  const teacher = await getTeacher(req.user!.userId);
  const classes = await prisma.classSubject.findMany({
    where: { teacherId: teacher.id },
    include: { class: { include: { students: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } } }, subject: true },
  });
  res.json({ success: true, data: classes });
}));

teacherRouter.post("/attendance", asyncHandler(async (req, res) => {
  const teacher = await getTeacher(req.user!.userId);
  const { records } = req.body as { records: { studentId: string; date: string; status: string; remarks?: string }[] };

  const results = await Promise.all(
    records.map((r) =>
      prisma.attendanceRecord.upsert({
        where: { studentId_date: { studentId: r.studentId, date: new Date(r.date) } },
        update: { status: r.status as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED", remarks: r.remarks, teacherId: teacher.id },
        create: { studentId: r.studentId, date: new Date(r.date), status: r.status as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED", remarks: r.remarks, teacherId: teacher.id },
      })
    )
  );
  res.json({ success: true, data: results });
}));

teacherRouter.get("/attendance/:classId", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockTeacherAttendance(req.params.classId) });
  const students = await prisma.studentProfile.findMany({ where: { classId: req.params.classId } });
  const records = await prisma.attendanceRecord.findMany({
    where: { studentId: { in: students.map((s) => s.id) } },
    orderBy: { date: "desc" },
    take: 200,
  });
  res.json({ success: true, data: records });
}));

teacherRouter.post("/grades", asyncHandler(async (req, res) => {
  const teacher = await getTeacher(req.user!.userId);
  const { grades } = req.body as { grades: { studentId: string; subject: string; score: number; maxScore?: number; termId?: string }[] };

  const results = await Promise.all(
    grades.map((g) =>
      prisma.grade.create({
        data: { studentId: g.studentId, subject: g.subject, score: g.score, maxScore: g.maxScore || 100, termId: g.termId, teacherId: teacher.id },
      })
    )
  );
  res.json({ success: true, data: results });
}));

teacherRouter.get("/assignments", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockTeacherAssignments() });
  const teacher = await getTeacher(req.user!.userId);
  const assignments = await prisma.assignment.findMany({
    where: { teacherId: teacher.id },
    include: { course: true, submissions: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: assignments });
}));

teacherRouter.post("/assignments", asyncHandler(async (req, res) => {
  const teacher = await getTeacher(req.user!.userId);
  const assignment = await prisma.assignment.create({
    data: { ...req.body, teacherId: teacher.id, dueDate: new Date(req.body.dueDate), status: "PUBLISHED" },
  });
  res.json({ success: true, data: assignment });
}));

teacherRouter.post("/assignments/:id/grade", asyncHandler(async (req, res) => {
  const submission = await prisma.submission.update({
    where: { id: req.params.id },
    data: { score: req.body.score, feedback: req.body.feedback, status: "GRADED", gradedAt: new Date() },
  });
  res.json({ success: true, data: submission });
}));

teacherRouter.get("/analytics", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockTeacherAnalytics() });
  const teacher = await getTeacher(req.user!.userId);
  const classSubjects = await prisma.classSubject.findMany({ where: { teacherId: teacher.id } });
  const classIds = classSubjects.map((cs) => cs.classId);

  const students = await prisma.studentProfile.findMany({ where: { classId: { in: classIds } } });
  const grades = await prisma.grade.findMany({ where: { studentId: { in: students.map((s) => s.id) } } });

  const avgBySubject: Record<string, { total: number; count: number }> = {};
  for (const g of grades) {
    if (!avgBySubject[g.subject]) avgBySubject[g.subject] = { total: 0, count: 0 };
    avgBySubject[g.subject].total += Number(g.score);
    avgBySubject[g.subject].count++;
  }

  const analytics = Object.entries(avgBySubject).map(([subject, { total, count }]) => ({
    subject,
    average: count ? total / count : 0,
    atRisk: count ? (total / count) < 50 : false,
  }));

  res.json({ success: true, data: analytics });
}));

teacherRouter.get("/exams", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockTeacherExams() });
  const teacher = await getTeacher(req.user!.userId);
  const exams = await prisma.exam.findMany({
    where: { teacherId: teacher.id },
    include: { questions: true, attempts: true },
  });
  res.json({ success: true, data: exams });
}));

teacherRouter.post("/exams", asyncHandler(async (req, res) => {
  const teacher = await getTeacher(req.user!.userId);
  const { questions, ...examData } = req.body;
  const exam = await prisma.exam.create({
    data: {
      ...examData,
      teacherId: teacher.id,
      questions: { create: questions },
    },
    include: { questions: true },
  });
  res.json({ success: true, data: exam });
}));

teacherRouter.patch("/timetable/:id/meet-link", asyncHandler(async (req, res) => {
  const slot = await prisma.timetableSlot.update({
    where: { id: req.params.id },
    data: { meetLink: req.body.meetLink, zoomLink: req.body.zoomLink },
  });
  res.json({ success: true, data: slot });
}));
