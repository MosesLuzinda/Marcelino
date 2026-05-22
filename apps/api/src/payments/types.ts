import type { CheckoutSession, CheckoutResult, PaymentEvent } from "@marcelino/shared";

export interface PaymentProvider {
  name: string;
  createCheckout(session: CheckoutSession): Promise<CheckoutResult>;
  verifyWebhook(payload: unknown, signature?: string): PaymentEvent;
}
