import { Router } from "express";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requirePermission } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const exportRouter = Router();
exportRouter.use(authenticateJWT, requirePermission("reports:read", "*"));

exportRouter.get("/students/excel", asyncHandler(async (_req, res) => {
  const students = await prisma.studentProfile.findMany({ include: { user: true, class: true } });
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Students");
  sheet.columns = [
    { header: "Student ID", key: "studentId", width: 15 },
    { header: "First Name", key: "firstName", width: 20 },
    { header: "Last Name", key: "lastName", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Class", key: "class", width: 15 },
  ];
  students.forEach((s) => sheet.addRow({
    studentId: s.studentId,
    firstName: s.user.firstName,
    lastName: s.user.lastName,
    email: s.user.email,
    class: s.class?.name || "",
  }));
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");
  await workbook.xlsx.write(res);
}));

exportRouter.get("/attendance/excel", asyncHandler(async (_req, res) => {
  const records = await prisma.attendanceRecord.findMany({
    include: { student: { include: { user: true } } },
    take: 1000,
  });
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Attendance");
  sheet.columns = [
    { header: "Student", key: "student", width: 25 },
    { header: "Date", key: "date", width: 15 },
    { header: "Status", key: "status", width: 12 },
  ];
  records.forEach((r) => sheet.addRow({
    student: `${r.student.user.firstName} ${r.student.user.lastName}`,
    date: r.date.toISOString().split("T")[0],
    status: r.status,
  }));
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=attendance.xlsx");
  await workbook.xlsx.write(res);
}));

exportRouter.get("/finance/pdf", asyncHandler(async (_req, res) => {
  const payments = await prisma.payment.findMany({
    where: { status: "COMPLETED" },
    include: { invoice: { include: { student: { include: { user: true } } } } },
    take: 100,
  });
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=finance-report.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("Financial Report", { align: "center" });
  doc.moveDown();
  payments.forEach((p) => {
    doc.fontSize(10).text(
      `${p.invoice.student.user.firstName} ${p.invoice.student.user.lastName} - ${p.amount} ${p.provider} - ${p.paidAt?.toISOString().split("T")[0]}`
    );
  });
  doc.end();
}));

exportRouter.get("/calendar/:studentId.ics", asyncHandler(async (req, res) => {
  const student = await prisma.studentProfile.findUnique({ where: { id: req.params.studentId } });
  if (!student?.classId) return res.status(404).send("Not found");

  const slots = await prisma.timetableSlot.findMany({
    where: { classId: student.classId },
    include: { subject: true },
  });

  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Marcelino Academy//EN\n";
  for (const slot of slots) {
    ics += `BEGIN:VEVENT\nSUMMARY:${slot.subject.name}\nDESCRIPTION:Class ${slot.room || ""}\nEND:VEVENT\n`;
  }
  ics += "END:VCALENDAR";

  res.setHeader("Content-Type", "text/calendar");
  res.setHeader("Content-Disposition", "attachment; filename=timetable.ics");
  res.send(ics);
}));
