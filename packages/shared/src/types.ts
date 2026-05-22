export interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  schoolId?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CheckoutSession {
  invoiceId: string;
  amount: number;
  currency: string;
  email: string;
  name: string;
  phone?: string;
  redirectUrl: string;
  provider: string;
}

export interface CheckoutResult {
  checkoutUrl?: string;
  reference: string;
  provider: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentEvent {
  reference: string;
  status: "success" | "failed" | "pending";
  amount: number;
  provider: string;
  metadata?: Record<string, unknown>;
}
