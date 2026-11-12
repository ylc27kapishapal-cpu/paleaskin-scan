import { createHmac, timingSafeEqual } from "node:crypto";
import { readJsonBody, requirePost, type ApiRequest, type ApiResponse } from "./_lib/http";

/**
 * POST /api/verify-payment
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Success only when HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET) === signature.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requirePost(req, res)) return;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    console.error("verify-payment: RAZORPAY_KEY_SECRET is not set");
    return res.status(500).json({ error: "Payments are not configured" });
  }

  const body = readJsonBody(req);
  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (
    typeof orderId !== "string" || !orderId ||
    typeof paymentId !== "string" || !paymentId ||
    typeof signature !== "string" || !signature
  ) {
    return res.status(400).json({ success: false, error: "Missing payment fields" });
  }

  const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  const valid = a.length === b.length && timingSafeEqual(a, b);

  if (!valid) {
    // Do NOT treat this payment as paid.
    return res.status(400).json({ success: false, error: "Invalid payment signature" });
  }

  return res.status(200).json({ success: true, order_id: orderId, payment_id: paymentId });
}
