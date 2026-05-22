import { Router } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "@marcelino/database";
import { checkoutSchema } from "@marcelino/shared";
import { authenticateJWT, requirePermission } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { getPaymentProvider } from "../payments/index.js";
import { isDevMock } from "../config/dev-mock.js";
import { registerDevCheckout, completeDevPayment, getDevInvoices } from "../config/dev-fees-store.js";
import { processPayment } from "../services/payment.service.js";

export const feesRouter = Router();

feesRouter.get("/invoices/:id", authenticateJWT, asyncHandler(async (req, res) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: req.params.id },
    include: { student: { include: { user: true } }, payments: true, currency: true },
  });
  if (!invoice) throw new AppError(404, "Invoice not found");
  res.json({ success: true, data: invoice });
}));

feesRouter.post("/checkout", authenticateJWT, requirePermission("payments:write", "fees:read", "*"), asyncHandler(async (req, res) => {
  const { invoiceId, provider } = checkoutSchema.parse(req.body);

  if (isDevMock(req.user!.userId) || req.user!.userId.startsWith("dev-")) {
    const invoice = getDevInvoices().find((i) => i.id === invoiceId);
    if (!invoice) throw new AppError(404, "Invoice not found");
    if (invoice.status === "PAID") throw new AppError(400, "Invoice already paid");

    const reference = `MOCK-${Date.now()}`;
    const remaining = Number(invoice.total) - Number(invoice.paidAmount);
    registerDevCheckout(reference, invoiceId, provider, remaining);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return res.json({
      success: true,
      data: {
        reference,
        provider,
        checkoutUrl: `${appUrl}/portal/parent/fees/callback?ref=${reference}&invoiceId=${invoiceId}&provider=${provider}&mock=true`,
        metadata: { mock: true, invoiceId },
      },
    });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { student: { include: { user: true } }, currency: true },
  });
  if (!invoice) throw new AppError(404, "Invoice not found");
  if (invoice.status === "PAID") throw new AppError(400, "Invoice already paid");

  const remaining = Number(invoice.total) - Number(invoice.paidAmount);
  const paymentProvider = getPaymentProvider(provider);

  const result = await paymentProvider.createCheckout({
    invoiceId,
    amount: remaining,
    currency: invoice.currency?.code || process.env.SCHOOL_DEFAULT_CURRENCY || "UGX",
    email: invoice.student.user.email,
    name: `${invoice.student.user.firstName} ${invoice.student.user.lastName}`,
    phone: invoice.student.user.phone || undefined,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/portal/parent/fees/callback`,
    provider,
  });

  await prisma.payment.create({
    data: {
      invoiceId,
      amount: remaining,
      provider: provider as "FLUTTERWAVE" | "MTN_MOMO" | "AIRTEL_MONEY" | "STRIPE" | "PAYPAL",
      providerRef: result.reference,
      status: "PENDING",
      metadata: result.metadata as object,
    },
  });

  res.json({ success: true, data: result });
}));

feesRouter.get("/invoices", authenticateJWT, asyncHandler(async (req, res) => {
  const invoices = await prisma.invoice.findMany({
    include: { student: { include: { user: true } }, payments: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json({ success: true, data: invoices });
}));

feesRouter.post("/invoices", authenticateJWT, requirePermission("fees:write"), asyncHandler(async (req, res) => {
  const invoiceNo = `INV-${Date.now()}`;
  const invoice = await prisma.invoice.create({
    data: { ...req.body, invoiceNo },
  });
  res.json({ success: true, data: invoice });
}));

feesRouter.get("/scholarships", authenticateJWT, asyncHandler(async (_req, res) => {
  const scholarships = await prisma.scholarship.findMany({ include: { students: true } });
  res.json({ success: true, data: scholarships });
}));

feesRouter.post("/scholarships", authenticateJWT, requirePermission("fees:write"), asyncHandler(async (req, res) => {
  const scholarship = await prisma.scholarship.create({ data: req.body });
  res.json({ success: true, data: scholarship });
}));

feesRouter.get("/receipts/:paymentId/pdf", authenticateJWT, asyncHandler(async (req, res) => {
  const payment = await prisma.payment.findUnique({
    where: { id: req.params.paymentId },
    include: { invoice: { include: { student: { include: { user: true } } } }, receipt: true },
  });
  if (!payment) throw new AppError(404, "Payment not found");

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=receipt-${payment.id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text("Marcelino International Academy", { align: "center" });
  doc.fontSize(14).text("Payment Receipt", { align: "center" });
  doc.moveDown();
  doc.fontSize(10)
    .text(`Receipt No: ${payment.receipt?.receiptNo || payment.id}`)
    .text(`Student: ${payment.invoice.student.user.firstName} ${payment.invoice.student.user.lastName}`)
    .text(`Amount: ${payment.amount}`)
    .text(`Provider: ${payment.provider}`)
    .text(`Date: ${payment.paidAt?.toISOString() || new Date().toISOString()}`)
    .text(`Status: ${payment.status}`);
  doc.end();
}));

feesRouter.post("/confirm-mock", authenticateJWT, requirePermission("payments:write", "fees:read", "*"), asyncHandler(async (req, res) => {
  const { reference } = req.body as { reference?: string };
  if (!reference) throw new AppError(400, "reference required");

  if (isDevMock(req.user!.userId) || req.user!.userId.startsWith("dev-")) {
    const invoice = completeDevPayment(reference);
    if (!invoice) throw new AppError(404, "Checkout session not found or already completed");
    return res.json({ success: true, data: { invoice, message: "Demo payment completed" } });
  }

  try {
    const payment = await prisma.payment.findFirst({ where: { providerRef: reference } });
    if (!payment) throw new AppError(404, "Payment not found");
    await processPayment(reference, "success", Number(payment.amount), payment.provider);
    res.json({ success: true, data: { message: "Payment confirmed" } });
  } catch (err) {
    if (reference.startsWith("MOCK-")) {
      const invoice = completeDevPayment(reference);
      if (!invoice) throw err;
      return res.json({ success: true, data: { invoice, message: "Demo payment completed" } });
    }
    throw err;
  }
}));

feesRouter.get("/currencies", asyncHandler(async (_req, res) => {
  const currencies = await prisma.currency.findMany({ include: { exchangeRates: { take: 1, orderBy: { effectiveDate: "desc" } } } });
  res.json({ success: true, data: currencies });
}));
