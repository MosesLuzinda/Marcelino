import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requirePermission } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { mockTransportRoutes } from "../config/dev-mock-data.js";
import { isDevMock } from "../config/dev-mock.js";

export const transportRouter = Router();
transportRouter.use(authenticateJWT);

transportRouter.get("/routes", asyncHandler(async (req, res) => {
  if (req.user && isDevMock(req.user.userId)) return res.json({ success: true, data: mockTransportRoutes() });
  const routes = await prisma.route.findMany({ include: { vehicles: true, assignments: { include: { student: { include: { user: true } } } } } });
  res.json({ success: true, data: routes });
}));

transportRouter.post("/routes", requirePermission("transport:write"), asyncHandler(async (req, res) => {
  const route = await prisma.route.create({ data: req.body });
  res.json({ success: true, data: route });
}));

transportRouter.post("/vehicles", requirePermission("transport:write"), asyncHandler(async (req, res) => {
  const vehicle = await prisma.vehicle.create({ data: req.body });
  res.json({ success: true, data: vehicle });
}));

transportRouter.post("/assign", requirePermission("transport:write"), asyncHandler(async (req, res) => {
  const assignment = await prisma.transportAssignment.create({ data: req.body });
  res.json({ success: true, data: assignment });
}));
