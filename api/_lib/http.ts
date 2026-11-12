// Minimal request/response shapes for Vercel's Node runtime (avoids a @vercel/node dependency).
export interface ApiRequest {
  method?: string;
  body?: unknown;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

/** Vercel parses JSON bodies for us, but tolerate a raw string body too. */
export function readJsonBody(req: ApiRequest): Record<string, unknown> {
  if (typeof req.body === "string") {
    try {
      const parsed = JSON.parse(req.body);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  return req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};
}

export function requirePost(req: ApiRequest, res: ApiResponse): boolean {
  if (req.method === "POST") return true;
  res.setHeader("Allow", "POST");
  res.status(405).json({ error: "Method not allowed" });
  return false;
}
