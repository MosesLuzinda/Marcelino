import { Router } from "express";
import { prisma } from "@marcelino/database";
import { authenticateJWT } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { mockConversations, mockMessages } from "../config/dev-mock-data.js";
import { isDevMock } from "../config/dev-mock.js";

export const messagingRouter = Router();
messagingRouter.use(authenticateJWT);

messagingRouter.get("/conversations", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockConversations() });
  const conversations = await prisma.conversation.findMany({
    where: { members: { some: { userId: req.user!.userId } } },
    include: {
      members: { include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
  res.json({ success: true, data: conversations });
}));

messagingRouter.post("/conversations", asyncHandler(async (req, res) => {
  const { memberIds, title } = req.body;
  const allMembers = [...new Set([req.user!.userId, ...memberIds])];

  const conversation = await prisma.conversation.create({
    data: {
      title,
      isGroup: allMembers.length > 2,
      members: { create: allMembers.map((userId) => ({ userId })) },
    },
    include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } } } },
  });
  res.json({ success: true, data: conversation });
}));

messagingRouter.get("/conversations/:id/messages", asyncHandler(async (req, res) => {
  if (isDevMock(req.user!.userId)) return res.json({ success: true, data: mockMessages(req.params.id) });
  const member = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId: req.params.id, userId: req.user!.userId } },
  });
  if (!member) throw new AppError(403, "Not a member of this conversation");

  const messages = await prisma.message.findMany({
    where: { conversationId: req.params.id },
    include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });
  res.json({ success: true, data: messages });
}));

messagingRouter.post("/conversations/:id/messages", asyncHandler(async (req, res) => {
  const message = await prisma.message.create({
    data: {
      conversationId: req.params.id,
      senderId: req.user!.userId,
      content: req.body.content,
      attachments: req.body.attachments,
    },
    include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
  });
  await prisma.conversation.update({ where: { id: req.params.id }, data: { updatedAt: new Date() } });
  res.json({ success: true, data: message });
}));
