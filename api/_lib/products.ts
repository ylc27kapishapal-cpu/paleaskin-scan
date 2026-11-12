// Prices live on the server so a client can never choose what it pays.
// Amounts are in paise (₹1 = 100 paise). Razorpay's minimum is 100 paise.
export const PRODUCTS = {
  full_report: { amount: 49900, currency: "INR", label: "Full skin report" },
} as const;

export type ProductId = keyof typeof PRODUCTS;

export function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(PRODUCTS, value);
}
