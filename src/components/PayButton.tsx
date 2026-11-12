import { useState } from "react";
import { CreditCard, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startCheckout } from "@/lib/razorpay";
import { trackEvent } from "@/lib/clarity";

interface PayButtonProps {
  product: string;
  label: string;
  priceLabel: string;
  description?: string;
}

export const PayButton = ({ product, label, priceLabel, description }: PayButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleClick = async () => {
    if (loading || paid) return;
    setLoading(true);
    trackEvent("checkout_started");
    try {
      const outcome = await startCheckout({
        product,
        name: "Paléa Labs",
        description: description ?? label,
        themeColor: "#c07859",
        onPaymentFailed: (message) => {
          trackEvent("payment_failed");
          toast.error(message);
        },
      });
      if (outcome.status === "paid") {
        setPaid(true);
        trackEvent("payment_succeeded");
        toast.success("Payment successful. Thank you!");
      } else if (outcome.status === "dismissed") {
        trackEvent("payment_dismissed");
        toast("Payment cancelled. You have not been charged.");
      } else {
        // Failed attempts were already reported via onPaymentFailed; this is a verification failure or a close after failing.
        toast.error(outcome.message);
      }
    } catch (err) {
      trackEvent("payment_failed");
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || paid}
      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-sm tracking-wider hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : paid ? <Check className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
      {paid ? "Paid" : loading ? "Opening checkout…" : `${label} — ${priceLabel}`}
    </button>
  );
};
