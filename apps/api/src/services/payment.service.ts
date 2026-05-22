import { prisma } from "@marcelino/database";

export async function processPayment(
  reference: string,
  status: "success" | "failed",
  amount: number,
  _provider: string
) {
  const payment = await prisma.payment.findFirst({ where: { providerRef: reference } });
  if (!payment) return null;

  if (status === "success") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "COMPLETED", paidAt: new Date() },
    });

    const invoice = await prisma.invoice.findUnique({ where: { id: payment.invoiceId } });
    if (!invoice) return payment;

    const newPaid = Number(invoice.paidAmount) + amount;
    const newStatus = newPaid >= Number(invoice.total) ? "PAID" : "PARTIAL";

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paidAmount: newPaid, status: newStatus },
    });

    const receiptNo = `RCP-${Date.now()}`;
    await prisma.receipt.create({
      data: { paymentId: payment.id, invoiceId: invoice.id, receiptNo },
    });

    const student = await prisma.studentProfile.findUnique({
      where: { id: invoice.studentId },
      include: { user: true, parentLinks: { include: { parent: { include: { user: true } } } } },
    });

    const notifyUserIds = [
      student?.userId,
      ...(student?.parentLinks.map((l) => l.parent.userId) || []),
    ].filter(Boolean) as string[];

    if (notifyUserIds.length) {
      await prisma.notification.createMany({
        data: notifyUserIds.map((userId) => ({
          userId,
          type: "SUCCESS",
          title: "Payment Received",
          body: `Payment of ${amount} received for invoice ${invoice.invoiceNo}`,
          link: `/portal/parent/fees`,
        })),
      });
    }
  } else {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
  }

  return payment;
}
