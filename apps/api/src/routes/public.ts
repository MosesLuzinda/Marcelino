import { Router } from "express";
import { prisma } from "@marcelino/database";
import { contactSchema } from "@marcelino/shared";
import { asyncHandler } from "../middleware/errorHandler.js";

export const publicRouter = Router();

publicRouter.get("/school", asyncHandler(async (_req, res) => {
  const school = await prisma.school.findFirst({ include: { campuses: true } });
  res.json({ success: true, data: school });
}));

publicRouter.get("/pages/:slug", asyncHandler(async (req, res) => {
  const page = await prisma.cmsPage.findUnique({ where: { slug: req.params.slug } });
  res.json({ success: true, data: page });
}));

publicRouter.get("/news", asyncHandler(async (_req, res) => {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
  res.json({ success: true, data: posts });
}));

publicRouter.get("/news/:slug", asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
  res.json({ success: true, data: post });
}));

publicRouter.get("/events", asyncHandler(async (_req, res) => {
  const events = await prisma.event.findMany({ orderBy: { startDate: "desc" }, take: 20 });
  res.json({ success: true, data: events });
}));

publicRouter.get("/gallery", asyncHandler(async (_req, res) => {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
  res.json({ success: true, data: items });
}));

publicRouter.get("/faqs", asyncHandler(async (_req, res) => {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  res.json({ success: true, data: faqs });
}));

publicRouter.get("/testimonials", asyncHandler(async (_req, res) => {
  const items = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: items });
}));

publicRouter.get("/careers", asyncHandler(async (_req, res) => {
  const careers = await prisma.career.findMany({ where: { status: "PUBLISHED" } });
  res.json({ success: true, data: careers });
}));

publicRouter.get("/downloads", asyncHandler(async (_req, res) => {
  const downloads = await prisma.download.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: downloads });
}));

publicRouter.get("/teachers", asyncHandler(async (_req, res) => {
  const teachers = await prisma.teacherProfile.findMany({
    include: { user: { select: { firstName: true, lastName: true, avatar: true, email: true } } },
    take: 50,
  });
  res.json({ success: true, data: teachers });
}));

publicRouter.get("/courses", asyncHandler(async (_req, res) => {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: { subject: true },
    take: 50,
  });
  res.json({ success: true, data: courses });
}));

publicRouter.post("/contact", asyncHandler(async (req, res) => {
  const data = contactSchema.parse(req.body);
  const submission = await prisma.contactSubmission.create({ data });
  res.json({ success: true, data: submission, message: "Thank you for contacting us" });
}));

publicRouter.post("/careers/:id/apply", asyncHandler(async (req, res) => {
  const application = await prisma.jobApplication.create({
    data: { careerId: req.params.id, ...req.body },
  });
  res.json({ success: true, data: application });
}));
