import { Router } from "express";
import { prisma } from "@marcelino/database";
import { chatSchema } from "@marcelino/shared";
import { authenticateJWT } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const aiRouter = Router();

const FAQ_RESPONSES: Record<string, string> = {
  admission: "Admissions are open year-round. Visit our Admissions page or contact admissions@marcelino.edu for requirements and application forms.",
  fees: "School fees vary by grade level. Parents can view and pay fees through the Parent Portal. We accept Flutterwave, MTN MoMo, Airtel Money, cards, and bank transfers.",
  schedule: "Class schedules are available in the Student and Teacher portals under Timetable.",
  contact: "Reach us at info@marcelino.edu or +256 700 000 000. Our campus is in Kampala, Uganda.",
  default: "I'm the Marcelino Academy assistant. I can help with admissions, fees, schedules, and general school information. How can I help you today?",
};

function getLocalResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("admission") || lower.includes("apply")) return FAQ_RESPONSES.admission;
  if (lower.includes("fee") || lower.includes("payment") || lower.includes("pay")) return FAQ_RESPONSES.fees;
  if (lower.includes("schedule") || lower.includes("timetable") || lower.includes("class")) return FAQ_RESPONSES.schedule;
  if (lower.includes("contact") || lower.includes("location") || lower.includes("address")) return FAQ_RESPONSES.contact;
  return FAQ_RESPONSES.default;
}

async function getOpenAIResponse(message: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return getLocalResponse(message);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant for Marcelino International Academy, a premium school in Uganda. Be concise and friendly." },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    }),
  });
  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content || getLocalResponse(message);
}

aiRouter.post("/chat", asyncHandler(async (req, res) => {
  const { message } = chatSchema.parse(req.body);
  const userId = req.headers.authorization ? undefined : undefined;

  let response: string;
  try {
    response = await getOpenAIResponse(message);
  } catch {
    response = getLocalResponse(message);
  }

  const log = await prisma.chatbotLog.create({
    data: { userId: userId || null, message, response },
  });

  res.json({ success: true, data: { response, id: log.id } });
}));

aiRouter.post("/chat/auth", authenticateJWT, asyncHandler(async (req, res) => {
  const { message } = chatSchema.parse(req.body);
  const response = await getOpenAIResponse(message);
  const log = await prisma.chatbotLog.create({
    data: { userId: req.user!.userId, message, response },
  });
  res.json({ success: true, data: { response, id: log.id } });
}));
