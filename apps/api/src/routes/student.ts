import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import {
  studentDashboard, mockSchedule, mockAttendance, mockGrades, mockAssignments,
  mockExams, mockStudentProfile, mockNotifications,
} from "../config/dev-mock-data.js";
import { isDevMock } from "../config/dev-mock.js";

export const studentRouter = Router();
studentRouter.use(authenticateJWT, requireRole("STUDENT", "SUPER_ADMIN", "ADMIN"));

async function getStudent(userId: string) {
  if (userId.startsWith("dev-")) {
    return {
      id: "dev-student-profile",
      userId,
      classId: "c1",
      studentId: "STU2025001",
    };
  }
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "Student profile not found");
  return profile;
}

function devFallback<T>(userId: string, mockData: () => T, err: unknown): T {
  if (userId.startsWith("dev-") || process.env.DEV_MOCK_AUTH === "true") return mockData();
  throw err;
}

studentRouter.get("/dashboard", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) {
    return res.json({ success: true, data: studentDashboard() });
  }
  const student = await getStudent(req.user!.userId);
  const [attendance, grades, assignments, notifications] = await Promise.all([
    prisma.attendanceRecord.count({ where: { studentId: student.id, status: "PRESENT" } }),
    prisma.grade.findMany({ where: { studentId: student.id }, take: 5, orderBy: { createdAt: "desc" } }),
    prisma.submission.findMany({
      where: { studentId: student.id },
      include: { assignment: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.findMany({ where: { userId: req.user!.userId, read: false }, take: 10 }),
  ]);
  res.json({ success: true, data: { student, stats: { attendance }, grades, assignments, notifications } });
}));

studentRouter.get("/schedule", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  if (isDevMock(userId)) return res.json({ success: true, data: mockSchedule() });
  try {
    const student = await getStudent(userId);
    const slots = student.classId
      ? await prisma.timetableSlot.findMany({
          where: { classId: student.classId },
          include: { subject: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        })
      : [];
    res.json({ success: true, data: slots });
  } catch (err) {
    res.json({ success: true, data: devFallback(userId, mockSchedule, err) });
  }
}));

studentRouter.get("/attendance", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  if (isDevMock(userId)) return res.json({ success: true, data: mockAttendance() });
  try {
    const student = await getStudent(userId);
    const records = await prisma.attendanceRecord.findMany({
      where: { studentId: student.id },
      orderBy: { date: "desc" },
      take: 100,
    });
    const present = records.filter((r) => r.status === "PRESENT").length;
    res.json({ success: true, data: { records, summary: { total: records.length, present, rate: records.length ? (present / records.length) * 100 : 0 } } });
  } catch (err) {
    res.json({ success: true, data: devFallback(userId, mockAttendance, err) });
  }
}));

studentRouter.get("/grades", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  if (isDevMock(userId)) return res.json({ success: true, data: mockGrades() });
  try {
    const student = await getStudent(userId);
    const grades = await prisma.grade.findMany({ where: { studentId: student.id }, orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: grades });
  } catch (err) {
    res.json({ success: true, data: devFallback(userId, mockGrades, err) });
  }
}));

studentRouter.get("/assignments", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  if (isDevMock(userId)) return res.json({ success: true, data: mockAssignments() });
  try {
    const student = await getStudent(userId);
    const submissions = await prisma.submission.findMany({
      where: { studentId: student.id },
      include: { assignment: { include: { course: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.json({ success: true, data: devFallback(userId, mockAssignments, err) });
  }
}));

studentRouter.post("/assignments/:id/submit", asyncHandler(async (req, res) => {
  const student = await getStudent(req.user!.userId);
  const submission = await prisma.submission.upsert({
    where: { assignmentId_studentId: { assignmentId: req.params.id, studentId: student.id } },
    update: { content: req.body.content, fileUrl: req.body.fileUrl, status: "SUBMITTED", submittedAt: new Date() },
    create: {
      assignmentId: req.params.id,
      studentId: student.id,
      content: req.body.content,
      fileUrl: req.body.fileUrl,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });
  res.json({ success: true, data: submission });
}));

studentRouter.get("/exams", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  if (isDevMock(userId)) return res.json({ success: true, data: mockExams() });
  try {
    const student = await getStudent(userId);
    const attempts = await prisma.examAttempt.findMany({
      where: { studentId: student.id },
      include: { exam: { include: { questions: true } } },
    });
    res.json({ success: true, data: attempts });
  } catch (err) {
    res.json({ success: true, data: devFallback(userId, mockExams, err) });
  }
}));

studentRouter.post("/exams/:id/start", asyncHandler(async (req, res) => {
  const student = await getStudent(req.user!.userId);
  const attempt = await prisma.examAttempt.upsert({
    where: { examId_studentId: { examId: req.params.id, studentId: student.id } },
    update: {},
    create: { examId: req.params.id, studentId: student.id },
    include: { exam: { include: { questions: { select: { id: true, question: true, options: true, marks: true, order: true } } } } },
  });
  res.json({ success: true, data: attempt });
}));

studentRouter.post("/exams/:id/submit", asyncHandler(async (req, res) => {
  const student = await getStudent(req.user!.userId);
  const exam = await prisma.exam.findUnique({ where: { id: req.params.id }, include: { questions: true } });
  if (!exam) throw new AppError(404, "Exam not found");

  const answers = req.body.answers as Record<string, string>;
  let score = 0;
  for (const q of exam.questions) {
    if (q.correctAnswer && answers[q.id] === q.correctAnswer) {
      score += Number(q.marks);
    }
  }

  const attempt = await prisma.examAttempt.update({
    where: { examId_studentId: { examId: req.params.id, studentId: student.id } },
    data: { answers, score, submittedAt: new Date() },
  });
  res.json({ success: true, data: attempt });
}));

studentRouter.get("/materials", asyncHandler(async (req, res) => {
  const student = await getStudent(req.user!.userId);
  const materials = student.classId
    ? await prisma.lessonMaterial.findMany({
        where: { course: { subject: { classSubjects: { some: { classId: student.classId } } } } },
        include: { course: true },
      })
    : [];
  res.json({ success: true, data: materials });
}));

studentRouter.get("/notifications", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  if (isDevMock(userId)) return res.json({ success: true, data: mockNotifications() });
  try {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({ success: true, data: notifications });
  } catch (err) {
    res.json({ success: true, data: devFallback(userId, mockNotifications, err) });
  }
}));

studentRouter.patch("/notifications/:id/read", asyncHandler(async (req, res) => {
  await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
  res.json({ success: true });
}));

studentRouter.get("/profile", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  if (isDevMock(userId)) return res.json({ success: true, data: mockStudentProfile() });
  try {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: { studentProfile: { include: { class: true, section: true } } },
  });
  res.json({ success: true, data: user });
  } catch (err) {
    res.json({ success: true, data: devFallback(userId, mockStudentProfile, err) });
  }
}));

studentRouter.patch("/profile", asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, avatar, locale, theme } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { firstName, lastName, phone, avatar, locale, theme },
  });
  res.json({ success: true, data: user });
}));
