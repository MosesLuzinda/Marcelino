import type { PaymentProvider } from "./types.js";
import type { CheckoutSession, CheckoutResult, PaymentEvent } from "@marcelino/shared";
import { v4 as uuidv4 } from "uuid";

export class PayPalProvider implements PaymentProvider {
  name = "PAYPAL";

  async createCheckout(session: CheckoutSession): Promise<CheckoutResult> {
    const reference = `PP-${uuidv4().slice(0, 8).toUpperCase()}`;

    if (!process.env.PAYPAL_CLIENT_ID || process.env.PAYPAL_ENABLED !== "true") {
      return {
        reference,
        provider: this.name,
        checkoutUrl: `${session.redirectUrl}?ref=${reference}&provider=paypal&mock=true`,
        metadata: { mock: true },
      };
    }

    const baseUrl = process.env.PAYPAL_MODE === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

    const token = await this.getAccessToken(baseUrl);
    const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: reference,
          amount: { currency_code: session.currency, value: session.amount.toFixed(2) },
          description: "School Fees",
        }],
        application_context: {
          return_url: `${session.redirectUrl}?ref=${reference}&status=success`,
          cancel_url: `${session.redirectUrl}?status=cancelled`,
        },
      }),
    });

    const data = await res.json() as { id: string; links: { rel: string; href: string }[] };
    const approveLink = data.links.find((l) => l.rel === "approve");
    return { reference, provider: this.name, checkoutUrl: approveLink?.href, metadata: { orderId: data.id } };
  }

  private async getAccessToken(baseUrl: string): Promise<string> {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
    const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    });
    const data = await res.json() as { access_token: string };
    return data.access_token;
  }

  verifyWebhook(payload: unknown): PaymentEvent {
    const body = payload as { resource: { id: string; amount: { value: string }; status: string } };
    return {
      reference: body.resource.id,
      status: body.resource.status === "COMPLETED" ? "success" : "failed",
      amount: parseFloat(body.resource.amount.value),
      provider: this.name,
    };
  }
}
