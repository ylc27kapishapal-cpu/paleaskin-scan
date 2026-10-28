import { describe, it, expect } from "vitest";
import { getIndianFoundationMatches } from "@/lib/skinAnalysis";

describe("getIndianFoundationMatches", () => {
  it("recommends deep shades for deep skin and never very-light ones", () => {
    const matches = getIndianFoundationMatches(80, "warm");
    expect(matches.length).toBe(3);
    const shades = matches.map((m) => m.shade);
    expect(shades).toContain("NC50");
    expect(shades).not.toContain("110 Porcelain");
    expect(shades).not.toContain("120 Classic Ivory");
  });

  it("recommends light shades for fair skin", () => {
    const matches = getIndianFoundationMatches(225, "cool");
    const shades = matches.map((m) => m.shade);
    expect(shades).toContain("Ivory Cream");
    expect(shades).not.toContain("NC50");
  });

  it("gives every match clickable links on the requested Indian platforms", () => {
    const matches = getIndianFoundationMatches(160, "warm");
    expect(matches.length).toBe(3);
    for (const match of matches) {
      expect(match.retailers.length).toBeGreaterThanOrEqual(2);
      const domains = match.retailers.map((r) => new URL(r.url).hostname);
      for (const d of domains) {
        expect(["www.nykaa.com", "www.amazon.in", "www.flipkart.com", "www.myntra.com"]).toContain(d);
      }
      // search query embeds brand and shade so results are pre-filled
      const nykaaLink = match.retailers.find((r) => r.name === "Nykaa");
      if (nykaaLink) {
        expect(nykaaLink.url).toContain(encodeURIComponent(`${match.brand} `));
        expect(nykaaLink.url).toContain(encodeURIComponent(match.shade));
      }
    }
  });
});
