import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requirePermission } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { mockLibraryBooks } from "../config/dev-mock-data.js";
import { isDevMock } from "../config/dev-mock.js";

export const libraryRouter = Router();
libraryRouter.use(authenticateJWT);

libraryRouter.get("/books", asyncHandler(async (req, res) => {
  if (req.user && isDevMock(req.user.userId)) return res.json({ success: true, data: mockLibraryBooks() });
  const books = await prisma.book.findMany({ orderBy: { title: "asc" } });
  res.json({ success: true, data: books });
}));

libraryRouter.post("/books", requirePermission("library:write"), asyncHandler(async (req, res) => {
  const book = await prisma.book.create({ data: req.body });
  res.json({ success: true, data: book });
}));

libraryRouter.post("/loans", requirePermission("library:write"), asyncHandler(async (req, res) => {
  const { bookId, studentId, dueDate } = req.body;
  const book = await prisma.book.update({
    where: { id: bookId },
    data: { available: { decrement: 1 } },
  });
  const loan = await prisma.libraryLoan.create({
    data: { bookId, studentId, dueDate: new Date(dueDate) },
    include: { book: true, student: { include: { user: true } } },
  });
  res.json({ success: true, data: { loan, book } });
}));

libraryRouter.post("/loans/:id/return", requirePermission("library:write"), asyncHandler(async (req, res) => {
  const loan = await prisma.libraryLoan.update({
    where: { id: req.params.id },
    data: { returnedAt: new Date(), status: "RETURNED", fine: req.body.fine },
  });
  await prisma.book.update({ where: { id: loan.bookId }, data: { available: { increment: 1 } } });
  res.json({ success: true, data: loan });
}));

libraryRouter.get("/loans", asyncHandler(async (_req, res) => {
  const loans = await prisma.libraryLoan.findMany({
    include: { book: true, student: { include: { user: true } } },
    orderBy: { issuedAt: "desc" },
  });
  res.json({ success: true, data: loans });
}));
