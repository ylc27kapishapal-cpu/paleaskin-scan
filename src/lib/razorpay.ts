/**
 * Razorpay Standard Web Checkout helpers.
 * Only the public KEY_ID is used here; the secret stays in the /api routes.
 * https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
 */

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error: { code?: string; description?: string; reason?: string };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", cb: (response: RazorpayFailureResponse) => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Checkout requires a browser"));
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // allow retry
      script.remove();
      reject(new Error("Could not load Razorpay Checkout. Check your connection and try again."));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

export type PaymentOutcome =
  | { status: "paid"; paymentId: string; orderId: string }
  | { status: "dismissed" }
  | { status: "failed"; message: string };

export interface StartCheckoutOptions {
  product: string;
  name: string;
  description?: string;
  themeColor?: string;
  /** Called on each failed attempt. The modal stays open so the user can retry. */
  onPaymentFailed?: (message: string) => void;
}

/**
 * Creates an order, opens the Razorpay modal, and verifies the signature server-side.
 * Resolves with the outcome; throws only for setup problems (network, config, order creation).
 */
export async function startCheckout(opts: StartCheckoutOptions): Promise<PaymentOutcome> {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("Payments are not configured (missing VITE_RAZORPAY_KEY_ID).");

  const [order] = await Promise.all([
    postJson<{ order_id: string; amount: number; currency: string }>("/api/create-order", {
      product: opts.product,
    }),
    loadRazorpayScript(),
  ]);

  return new Promise<PaymentOutcome>((resolve) => {
    let lastFailure: string | null = null;

    const rzp = new window.Razorpay!({
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.order_id,
      name: opts.name,
      description: opts.description,
      theme: opts.themeColor ? { color: opts.themeColor } : undefined,
      handler: async (response) => {
        try {
          await postJson("/api/verify-payment", response);
          resolve({ status: "paid", paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id });
        } catch (err) {
          resolve({
            status: "failed",
            message: err instanceof Error ? err.message : "Payment verification failed",
          });
        }
      },
      modal: {
        // If the user closes the modal after a failed attempt, report that failure.
        ondismiss: () => resolve(lastFailure ? { status: "failed", message: lastFailure } : { status: "dismissed" }),
      },
    });

    // Razorpay keeps the modal open for retries, so don't settle the promise here.
    rzp.on("payment.failed", (response) => {
      lastFailure = response.error?.description || "Payment failed. Please try again.";
      opts.onPaymentFailed?.(lastFailure);
    });

    rzp.open();
  });
}
