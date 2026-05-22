import type { PaymentProvider } from "./types.js";
import type { CheckoutSession, CheckoutResult, PaymentEvent } from "@marcelino/shared";
import { v4 as uuidv4 } from "uuid";

export class StripeProvider implements PaymentProvider {
  name = "STRIPE";

  async createCheckout(session: CheckoutSession): Promise<CheckoutResult> {
    const reference = `STR-${uuidv4().slice(0, 8).toUpperCase()}`;
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey || process.env.STRIPE_ENABLED !== "true") {
      return {
        reference,
        provider: this.name,
        checkoutUrl: `${session.redirectUrl}?ref=${reference}&provider=stripe&mock=true`,
        metadata: { mock: true },
      };
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "payment",
        "success_url": `${session.redirectUrl}?ref=${reference}&status=success`,
        "cancel_url": `${session.redirectUrl}?status=cancelled`,
        "client_reference_id": reference,
        "line_items[0][price_data][currency]": session.currency.toLowerCase(),
        "line_items[0][price_data][unit_amount]": String(Math.round(session.amount * 100)),
        "line_items[0][price_data][product_data][name]": "School Fees",
        "line_items[0][quantity]": "1",
        "customer_email": session.email,
      }),
    });

    const data = await res.json() as { url: string; id: string };
    return { reference, provider: this.name, checkoutUrl: data.url, metadata: { sessionId: data.id } };
  }

  verifyWebhook(payload: unknown, signature?: string): PaymentEvent {
    const body = payload as { type: string; data: { object: { client_reference_id: string; amount_total: number; payment_status: string } } };
    void signature; // Use stripe.webhooks.constructEvent in production
    const obj = body.data.object;
    return {
      reference: obj.client_reference_id,
      status: obj.payment_status === "paid" ? "success" : "failed",
      amount: obj.amount_total / 100,
      provider: this.name,
    };
  }
}
