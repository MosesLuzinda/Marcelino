import type { PaymentProvider } from "./types.js";
import { FlutterwaveProvider } from "./flutterwave.js";
import { MtnMomoProvider } from "./mtn-momo.js";
import { AirtelMoneyProvider } from "./airtel-money.js";
import { StripeProvider } from "./stripe.js";
import { PayPalProvider } from "./paypal.js";

const providers: Record<string, PaymentProvider> = {
  FLUTTERWAVE: new FlutterwaveProvider(),
  MTN_MOMO: new MtnMomoProvider(),
  AIRTEL_MONEY: new AirtelMoneyProvider(),
  STRIPE: new StripeProvider(),
  PAYPAL: new PayPalProvider(),
};

export function getPaymentProvider(name: string): PaymentProvider {
  const provider = providers[name];
  if (!provider) throw new Error(`Unknown payment provider: ${name}`);
  return provider;
}

export { FlutterwaveProvider, MtnMomoProvider, AirtelMoneyProvider, StripeProvider, PayPalProvider };
