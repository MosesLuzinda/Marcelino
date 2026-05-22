import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT, requirePermission } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { mockInventoryItems } from "../config/dev-mock-data.js";
import { isDevMock } from "../config/dev-mock.js";

export const inventoryRouter = Router();
inventoryRouter.use(authenticateJWT);

inventoryRouter.get("/items", asyncHandler(async (req, res) => {
  if (req.user && isDevMock(req.user.userId)) return res.json({ success: true, data: mockInventoryItems() });
  const items = await prisma.inventoryItem.findMany({ orderBy: { name: "asc" } });
  res.json({ success: true, data: items });
}));

inventoryRouter.post("/items", requirePermission("inventory:write"), asyncHandler(async (req, res) => {
  const item = await prisma.inventoryItem.create({ data: req.body });
  res.json({ success: true, data: item });
}));

inventoryRouter.post("/movements", requirePermission("inventory:write"), asyncHandler(async (req, res) => {
  const { itemId, type, quantity, reason } = req.body;
  const delta = type === "in" ? quantity : -quantity;
  const item = await prisma.inventoryItem.update({
    where: { id: itemId },
    data: { quantity: { increment: delta } },
  });
  const movement = await prisma.stockMovement.create({ data: { itemId, type, quantity, reason } });
  res.json({ success: true, data: { item, movement } });
}));

inventoryRouter.get("/alerts", asyncHandler(async (_req, res) => {
  const items = await prisma.inventoryItem.findMany();
  const alerts = items.filter((i) => i.quantity <= i.minStock);
  res.json({ success: true, data: alerts });
}));
