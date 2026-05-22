import type { PaymentProvider } from "./types.js";
import type { CheckoutSession, CheckoutResult, PaymentEvent } from "@marcelino/shared";
import { v4 as uuidv4 } from "uuid";

export class FlutterwaveProvider implements PaymentProvider {
  name = "FLUTTERWAVE";

  async createCheckout(session: CheckoutSession): Promise<CheckoutResult> {
    const reference = `MIA-${uuidv4().slice(0, 8).toUpperCase()}`;
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!secretKey) {
      // Sandbox mock
      return {
        reference,
        provider: this.name,
        checkoutUrl: `${session.redirectUrl}?ref=${reference}&status=success&mock=true`,
        metadata: { mock: true },
      };
    }

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: reference,
        amount: session.amount,
        currency: session.currency,
        redirect_url: session.redirectUrl,
        customer: { email: session.email, name: session.name, phonenumber: session.phone },
        customizations: { title: "Marcelino School Fees", description: `Invoice ${session.invoiceId}` },
        payment_options: "card,mobilemoney,ussd,banktransfer",
      }),
    });

    const data = await res.json() as { status: string; data: { link: string } };
    if (data.status !== "success") throw new Error("Flutterwave checkout failed");

    return { reference, provider: this.name, checkoutUrl: data.data.link };
  }

  verifyWebhook(payload: unknown, signature?: string): PaymentEvent {
    const body = payload as { event: string; data: { tx_ref: string; status: string; amount: number } };
    const hash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
    if (hash && signature !== hash) throw new Error("Invalid webhook signature");

    return {
      reference: body.data.tx_ref,
      status: body.data.status === "successful" ? "success" : "failed",
      amount: body.data.amount,
      provider: this.name,
    };
  }
}
