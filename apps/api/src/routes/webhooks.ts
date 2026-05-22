import { Router } from "express";
import { prisma } from "@marcelino/database";
import { asyncHandler } from "../middleware/errorHandler.js";
import { getPaymentProvider } from "../payments/index.js";
import { processPayment } from "../services/payment.service.js";

export const webhooksRouter = Router();

webhooksRouter.post("/flutterwave", asyncHandler(async (req, res) => {
  const provider = getPaymentProvider("FLUTTERWAVE");
  const event = provider.verifyWebhook(req.body, req.headers["verif-hash"] as string);
  await processPayment(event.reference, event.status, event.amount, event.provider);
  res.sendStatus(200);
}));

webhooksRouter.post("/mtn-momo", asyncHandler(async (req, res) => {
  const provider = getPaymentProvider("MTN_MOMO");
  const event = provider.verifyWebhook(req.body);
  await processPayment(event.reference, event.status, event.amount, event.provider);
  res.sendStatus(200);
}));

webhooksRouter.post("/airtel-money", asyncHandler(async (req, res) => {
  const provider = getPaymentProvider("AIRTEL_MONEY");
  const event = provider.verifyWebhook(req.body);
  await processPayment(event.reference, event.status, event.amount, event.provider);
  res.sendStatus(200);
}));

webhooksRouter.post("/stripe", asyncHandler(async (req, res) => {
  if (process.env.STRIPE_ENABLED !== "true") return res.sendStatus(200);
  const provider = getPaymentProvider("STRIPE");
  const event = provider.verifyWebhook(req.body, req.headers["stripe-signature"] as string);
  await processPayment(event.reference, event.status, event.amount, event.provider);
  res.sendStatus(200);
}));

webhooksRouter.post("/paypal", asyncHandler(async (req, res) => {
  if (process.env.PAYPAL_ENABLED !== "true") return res.sendStatus(200);
  const provider = getPaymentProvider("PAYPAL");
  const event = provider.verifyWebhook(req.body);
  await processPayment(event.reference, event.status, event.amount, event.provider);
  res.sendStatus(200);
}));

// Dev mock payment completion
webhooksRouter.get("/mock-complete/:reference", asyncHandler(async (req, res) => {
  const payment = await prisma.payment.findFirst({ where: { providerRef: req.params.reference } });
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  await processPayment(req.params.reference, "success", Number(payment.amount), payment.provider);
  res.json({ success: true, message: "Mock payment completed" });
}));
