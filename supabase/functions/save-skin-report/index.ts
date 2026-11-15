import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
const reportTemplateName = "palea_skin_scan_report";
const gatewayUrl = "https://connector-gateway.lovable.dev/whatsapp";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, maxLength = 450): string {
  if (typeof value !== "string") return "Not available";
  const cleaned = value.replace(/[\r\n]+/g, " ").trim();
  return cleaned.slice(0, maxLength) || "Not available";
}

function score(value: unknown): string {
  if (!isRecord(value) || typeof value.score !== "number" || !Number.isFinite(value.score)) return "—/10";
  return `${Math.max(1, Math.min(10, Math.round(value.score)))}/10`;
}

function reportParameters(analysis: JsonRecord): string[] {
  const shade = isRecord(analysis.shadeCode) ? analysis.shadeCode : {};
  const scores = isRecord(analysis.overallScore) ? analysis.overallScore : {};
  const matches = Array.isArray(analysis.foundationMatches) ? analysis.foundationMatches : [];
  const matchLines = matches.slice(0, 7).flatMap((item) => {
    if (!isRecord(item)) return [];
    const retailers = Array.isArray(item.retailers) ? item.retailers : [];
    const links = retailers.slice(0, 4).flatMap((retailer) => {
      if (!isRecord(retailer) || typeof retailer.url !== "string") return [];
      try {
        const url = new URL(retailer.url);
        if (!["nykaa.com", "amazon.in", "flipkart.com", "myntra.com"].some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`))) return [];
        return [`${text(retailer.name, 20)}: ${url.toString()}`];
      } catch {
        return [];
      }
    });
    return [`${text(item.brand, 60)} ${text(item.product, 80)} — ${text(item.shade, 80)}; ${links.join(" | ")}`];
  });
  const recs = Array.isArray(analysis.recommendations)
    ? analysis.recommendations.filter((item): item is string => typeof item === "string").slice(0, 4).map((item) => text(item, 100)).join("; ")
    : "Personalized care guidance is available in your scan report.";
  const scoreSummary = `Overall ${score(analysis.overallScore)}; Depth ${score(analysis.depthScore)}; undertone ${score(analysis.undertoneScore)}; hydration ${score(analysis.hydrationScore)}; texture ${score(analysis.textureScore)}; fine lines ${score(analysis.wrinkleScore)}.`;
  return [
    `${text(shade.code, 32)} ${text(shade.shadeName, 80)} — ${text(shade.label, 100)}`,
    `${text(analysis.depth, 40)} (${text(analysis.depthLabel, 60)}); ${text(analysis.undertone, 40)} undertone` ,
    `${text(analysis.jewelryPreference, 100)}; flattering colours: ${text(analysis.favourableColours, 120)}`,
    `Hydration: ${text(analysis.hydration, 40)}; texture: ${text(analysis.texture, 40)}; fine lines: ${text(analysis.wrinkleLevel, 40)} — ${text(analysis.wrinkleDetails, 150)}`,
    `${scoreSummary} ${recs}`,
    matchLines.length ? matchLines.join(". ") : "No foundation matches were available for this scan.",
  ].map((value) => value.slice(0, 900));
}

function response(status: number, payload: JsonRecord) {
  return new Response(JSON.stringify(payload), { status, headers: jsonHeaders });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response(405, { error: "Method not allowed." });

  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > 30_000) return response(413, { error: "This scan report is too large to save." });
    body = JSON.parse(raw);
  } catch {
    return response(400, { error: "Enter your details and try again." });
  }

  if (!isRecord(body) || typeof body.email !== "string" || typeof body.whatsappPhone !== "string" || body.whatsappConsent !== true || !isRecord(body.analysis)) {
    return response(400, { error: "Email, WhatsApp number, analysis, and report permission are required." });
  }

  const email = body.email.trim().toLowerCase();
  const phone = body.whatsappPhone.replace(/[^\d]/g, "");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response(400, { error: "Enter a valid email address." });
  }
  if (!/^[1-9]\d{7,14}$/.test(phone)) {
    return response(400, { error: "Enter a valid WhatsApp number, including its country code." });
  }
  if (!isRecord(body.analysis.shadeCode) || !Array.isArray(body.analysis.recommendations) || !Array.isArray(body.analysis.foundationMatches)) {
    return response(400, { error: "The scan report could not be verified. Please scan again." });
  }

  const projectUrl = Deno.env.get("SUPABASE_URL");
  const publicKey = Deno.env.get("SUPABASE_ANON_KEY");
  const whatsappKey = Deno.env.get("WHATSAPP_API_KEY");
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!projectUrl || !publicKey) {
    console.error("Scan report storage configuration is missing.");
    return response(503, { error: "Report saving is temporarily unavailable. Please try again later." });
  }

  const cloud = createClient(projectUrl, publicKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: saveError } = await cloud.from("skin_scan_reports").insert({
    email,
    whatsapp_phone: phone,
    analysis: body.analysis,
    whatsapp_consent: true,
  });
  if (saveError) {
    console.error("Scan report save failed:", saveError.message);
    return response(500, { error: "We could not save your report. Please try again." });
  }

  if (!whatsappKey || !lovableApiKey) {
    console.error("WhatsApp report credentials are unavailable.");
    return response(200, { saved: true, whatsapp: { status: "unavailable" } });
  }

  const gatewayHeaders = {
    Authorization: `Bearer ${lovableApiKey}`,
    "X-Connection-Api-Key": whatsappKey,
  };

  try {
    const templatesResponse = await fetch(`${gatewayUrl}/message_templates?fields=name,status,language,components&limit=100`, { headers: gatewayHeaders });
    const templatesText = await templatesResponse.text();
    if (!templatesResponse.ok) {
      console.error(`WhatsApp template lookup failed [${templatesResponse.status}]: ${templatesText}`);
      return response(200, { saved: true, whatsapp: { status: "unavailable" } });
    }
    const templatesPayload: unknown = JSON.parse(templatesText);
    const templates = isRecord(templatesPayload) && Array.isArray(templatesPayload.data) ? templatesPayload.data : [];
    const template = templates.find((item) => isRecord(item) && item.name === reportTemplateName);
    if (!isRecord(template) || template.status !== "APPROVED") {
      return response(200, { saved: true, whatsapp: { status: "template_pending" } });
    }

    const [shade, depth, colors, skin, scoreAndCare, matches] = reportParameters(body.analysis);
    const sendResponse = await fetch(`${gatewayUrl}/messages`, {
      method: "POST",
      headers: { ...gatewayHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: reportTemplateName,
          language: { code: typeof template.language === "string" ? template.language : "en_US" },
          components: [{
            type: "body",
            parameters: [shade, depth, colors, skin, scoreAndCare, matches].map((value) => ({ type: "text", text: value })),
          }],
        },
      }),
    });
    const sendText = await sendResponse.text();
    if (!sendResponse.ok) {
      console.error(`WhatsApp report send failed [${sendResponse.status}]: ${sendText}`);
      return response(200, { saved: true, whatsapp: { status: "send_failed" } });
    }
    const sendPayload: unknown = JSON.parse(sendText);
    if (isRecord(sendPayload) && (sendPayload.ok === false || sendPayload.error)) {
      console.error("WhatsApp report was not accepted:", JSON.stringify(sendPayload));
      return response(200, { saved: true, whatsapp: { status: "send_failed" } });
    }
    return response(200, { saved: true, whatsapp: { status: "submitted" } });
  } catch (error) {
    console.error("WhatsApp report processing failed:", error instanceof Error ? error.message : "Unknown error");
    return response(200, { saved: true, whatsapp: { status: "send_failed" } });
  }
});