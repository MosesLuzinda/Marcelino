import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["STUDENT", "PARENT", "TEACHER"]).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export const attendanceSchema = z.object({
  studentId: z.string(),
  date: z.string(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  remarks: z.string().optional(),
});

export const gradeSchema = z.object({
  studentId: z.string(),
  subject: z.string(),
  score: z.number().min(0),
  maxScore: z.number().min(1).default(100),
  termId: z.string().optional(),
  remarks: z.string().optional(),
});

export const assignmentSchema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string(),
  maxScore: z.number().min(1),
});

export const checkoutSchema = z.object({
  invoiceId: z.string(),
  provider: z.enum(["FLUTTERWAVE", "MTN_MOMO", "AIRTEL_MONEY", "STRIPE", "PAYPAL"]),
});

export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
