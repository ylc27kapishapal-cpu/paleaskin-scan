import Razorpay from "razorpay";
import { randomBytes } from "node:crypto";
import { readJsonBody, requirePost, type ApiRequest, type ApiResponse } from "./_lib/http";
import { PRODUCTS, isProductId } from "./_lib/products";

const MIN_AMOUNT_PAISE = 100;

interface RazorpayError {
  statusCode?: number;
  error?: { description?: string };
}

/**
 * POST /api/create-order
 * Body: { product: "full_report" }
 * Returns: { order_id, amount, currency }
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requirePost(req, res)) return;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error("create-order: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set");
    return res.status(500).json({ error: "Payments are not configured" });
  }

  const { product } = readJsonBody(req);
  if (!isProductId(product)) {
    return res.status(400).json({ error: "Unknown product" });
  }

  const { amount, currency } = PRODUCTS[product];
  if (!Number.isInteger(amount) || amount < MIN_AMOUNT_PAISE) {
    return res.status(400).json({ error: `Amount must be at least ${MIN_AMOUNT_PAISE} paise` });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    // Razorpay limits receipt to 40 chars.
    const receipt = `${product}_${Date.now()}_${randomBytes(3).toString("hex")}`.slice(0, 40);
    const order = await razorpay.orders.create({ amount, currency, receipt });
    return res.status(200).json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    const e = err as RazorpayError;
    if (e?.statusCode === 401) {
      console.error("create-order: Razorpay rejected the API credentials");
      return res.status(401).json({ error: "Razorpay authentication failed" });
    }
    console.error("create-order: Razorpay error", e?.error?.description ?? err);
    return res.status(500).json({ error: "Could not create order" });
  }
}
