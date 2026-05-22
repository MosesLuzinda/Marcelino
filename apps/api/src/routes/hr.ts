import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requirePermission } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const hrRouter = Router();
hrRouter.use(authenticateJWT);

hrRouter.get("/staff", requirePermission("hr:read"), asyncHandler(async (_req, res) => {
  const staff = await prisma.staffProfile.findMany({ include: { user: true } });
  res.json({ success: true, data: staff });
}));

hrRouter.post("/staff", requirePermission("hr:write"), asyncHandler(async (req, res) => {
  const staff = await prisma.staffProfile.create({ data: req.body, include: { user: true } });
  res.json({ success: true, data: staff });
}));

hrRouter.get("/leave", requirePermission("hr:read"), asyncHandler(async (_req, res) => {
  const requests = await prisma.leaveRequest.findMany({
    include: { staff: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: requests });
}));

hrRouter.post("/leave", asyncHandler(async (req, res) => {
  const request = await prisma.leaveRequest.create({ data: req.body });
  res.json({ success: true, data: request });
}));

hrRouter.patch("/leave/:id", requirePermission("hr:write"), asyncHandler(async (req, res) => {
  const request = await prisma.leaveRequest.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json({ success: true, data: request });
}));

hrRouter.get("/careers", asyncHandler(async (_req, res) => {
  const careers = await prisma.career.findMany();
  res.json({ success: true, data: careers });
}));

hrRouter.post("/careers", requirePermission("hr:write"), asyncHandler(async (req, res) => {
  const career = await prisma.career.create({ data: req.body });
  res.json({ success: true, data: career });
}));
