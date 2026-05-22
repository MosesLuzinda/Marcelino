import type { PaymentProvider } from "./types.js";
import type { CheckoutSession, CheckoutResult, PaymentEvent } from "@marcelino/shared";
import { v4 as uuidv4 } from "uuid";

export class AirtelMoneyProvider implements PaymentProvider {
  name = "AIRTEL_MONEY";

  async createCheckout(session: CheckoutSession): Promise<CheckoutResult> {
    const reference = `ATL-${uuidv4().slice(0, 8).toUpperCase()}`;

    if (!process.env.AIRTEL_MONEY_CLIENT_ID) {
      return {
        reference,
        provider: this.name,
        checkoutUrl: `${session.redirectUrl}?ref=${reference}&provider=airtel&mock=true`,
        metadata: { mock: true },
      };
    }

    const baseUrl = process.env.AIRTEL_MONEY_ENV === "production"
      ? "https://openapi.airtel.africa"
      : "https://openapiuat.airtel.africa";

    const token = await this.getToken(baseUrl);
    const res = await fetch(`${baseUrl}/merchant/v1/payments/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Country": "UG",
        "X-Currency": session.currency,
      },
      body: JSON.stringify({
        reference,
        subscriber: { country: "UG", currency: session.currency, msisdn: session.phone?.replace(/\D/g, "") },
        transaction: { amount: session.amount, id: reference },
      }),
    });

    if (!res.ok) throw new Error("Airtel Money payment failed");

    return { reference, provider: this.name, checkoutUrl: session.redirectUrl };
  }

  private async getToken(baseUrl: string): Promise<string> {
    const res = await fetch(`${baseUrl}/auth/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AIRTEL_MONEY_CLIENT_ID,
        client_secret: process.env.AIRTEL_MONEY_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });
    const data = await res.json() as { access_token: string };
    return data.access_token;
  }

  verifyWebhook(payload: unknown): PaymentEvent {
    const body = payload as { transaction: { id: string; status_code: string; amount: number } };
    return {
      reference: body.transaction.id,
      status: body.transaction.status_code === "TS" ? "success" : "failed",
      amount: body.transaction.amount,
      provider: this.name,
    };
  }
}
