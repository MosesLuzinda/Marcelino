import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requirePermission } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { mockHostels } from "../config/dev-mock-data.js";
import { isDevMock } from "../config/dev-mock.js";

export const hostelRouter = Router();
hostelRouter.use(authenticateJWT);

hostelRouter.get("/", asyncHandler(async (req, res) => {
  if (req.user && isDevMock(req.user.userId)) return res.json({ success: true, data: mockHostels() });
  const hostels = await prisma.hostel.findMany({ include: { rooms: { include: { beds: true } } } });
  res.json({ success: true, data: hostels });
}));

hostelRouter.post("/", requirePermission("hostel:write"), asyncHandler(async (req, res) => {
  const hostel = await prisma.hostel.create({ data: req.body });
  res.json({ success: true, data: hostel });
}));

hostelRouter.post("/assign", requirePermission("hostel:write"), asyncHandler(async (req, res) => {
  const assignment = await prisma.bedAssignment.create({ data: req.body });
  res.json({ success: true, data: assignment });
}));

hostelRouter.get("/occupancy", asyncHandler(async (_req, res) => {
  const rooms = await prisma.hostelRoom.findMany({ include: { beds: true, hostel: true } });
  const occupancy = rooms.map((r) => ({
    room: r.number,
    hostel: r.hostel.name,
    capacity: r.capacity,
    occupied: r.beds.length,
    rate: r.capacity ? (r.beds.length / r.capacity) * 100 : 0,
  }));
  res.json({ success: true, data: occupancy });
}));
