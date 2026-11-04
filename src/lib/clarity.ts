/**
 * Thin, type-safe wrapper around the Microsoft Clarity client API.
 * https://learn.microsoft.com/clarity/setup-and-installation/clarity-api
 *
 * The Clarity snippet itself is loaded from index.html. These calls are no-ops
 * when the script is blocked (for example by an ad blocker).
 */

type ClarityFn = {
  (action: "event", name: string): void;
  (action: "set", key: string, value: string | string[]): void;
  (action: "identify", id: string, sessionId?: string, pageId?: string, friendlyName?: string): void;
  (action: "consent"): void;
  (action: "upgrade", reason: string): void;
};

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

/** Record a custom event (shows up under Smart events in Clarity). */
export function trackEvent(name: string): void {
  if (typeof window === "undefined") return;
  window.clarity?.("event", name);
}

/** Attach a custom tag to the current session for filtering. */
export function setTag(key: string, value: string | string[]): void {
  if (typeof window === "undefined") return;
  window.clarity?.("set", key, value);
}

/**
 * Record an SPA route change. Clarity only captures the initial URL on its
 * own, so each client-side navigation is tagged and emitted as an event.
 */
export function trackPageView(path: string): void {
  setTag("page_path", path);
  trackEvent("page_view");
}
