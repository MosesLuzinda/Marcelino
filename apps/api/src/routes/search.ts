import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const searchRouter = Router();
searchRouter.use(authenticateJWT);

searchRouter.get("/", asyncHandler(async (req, res) => {
  const q = (req.query.q as string || "").trim();
  if (!q || q.length < 2) return res.json({ success: true, data: { students: [], courses: [], news: [] } });

  const [students, courses, news] = await Promise.all([
    prisma.studentProfile.findMany({
      where: {
        OR: [
          { studentId: { contains: q, mode: "insensitive" } },
          { user: { firstName: { contains: q, mode: "insensitive" } } },
          { user: { lastName: { contains: q, mode: "insensitive" } } },
          { user: { email: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: { user: { select: { firstName: true, lastName: true, email: true } }, class: true },
      take: 10,
    }),
    prisma.course.findMany({
      where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] },
      include: { subject: true },
      take: 10,
    }),
    prisma.blogPost.findMany({
      where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }] },
      take: 10,
    }),
  ]);

  res.json({ success: true, data: { students, courses, news } });
}));
