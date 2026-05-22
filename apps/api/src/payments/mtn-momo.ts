import type { PaymentProvider } from "./types.js";
import type { CheckoutSession, CheckoutResult, PaymentEvent } from "@marcelino/shared";
import { v4 as uuidv4 } from "uuid";

export class MtnMomoProvider implements PaymentProvider {
  name = "MTN_MOMO";

  async createCheckout(session: CheckoutSession): Promise<CheckoutResult> {
    const reference = `MTN-${uuidv4().slice(0, 8).toUpperCase()}`;

    if (!process.env.MTN_MOMO_API_KEY) {
      return {
        reference,
        provider: this.name,
        checkoutUrl: `${session.redirectUrl}?ref=${reference}&provider=mtn&mock=true`,
        metadata: { mock: true, phone: session.phone },
      };
    }

    // Production: MTN MoMo Collection API
    const baseUrl = process.env.MTN_MOMO_ENV === "production"
      ? "https://proxy.momoapi.mtn.com"
      : "https://sandbox.momodeveloper.mtn.com";

    const res = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
      method: "POST",
      headers: {
        "X-Reference-Id": reference,
        "X-Target-Environment": process.env.MTN_MOMO_ENV || "sandbox",
        "Ocp-Apim-Subscription-Key": process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
        Authorization: `Bearer ${await this.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: session.amount.toString(),
        currency: session.currency,
        externalId: session.invoiceId,
        payer: { partyIdType: "MSISDN", partyId: session.phone?.replace(/\D/g, "") },
        payerMessage: "School fee payment",
        payeeNote: "Marcelino Academy",
      }),
    });

    if (!res.ok) throw new Error("MTN MoMo payment initiation failed");

    return {
      reference,
      provider: this.name,
      checkoutUrl: session.redirectUrl,
      metadata: { pending: true },
    };
  }

  private async getToken(): Promise<string> {
    const auth = Buffer.from(`${process.env.MTN_MOMO_API_USER}:${process.env.MTN_MOMO_API_KEY}`).toString("base64");
    const res = await fetch("https://sandbox.momodeveloper.mtn.com/collection/token/", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Ocp-Apim-Subscription-Key": process.env.MTN_MOMO_SUBSCRIPTION_KEY! },
    });
    const data = await res.json() as { access_token: string };
    return data.access_token;
  }

  verifyWebhook(payload: unknown): PaymentEvent {
    const body = payload as { reference: string; status: string; amount: number };
    return {
      reference: body.reference,
      status: body.status === "SUCCESSFUL" ? "success" : "failed",
      amount: body.amount,
      provider: this.name,
    };
  }
}
