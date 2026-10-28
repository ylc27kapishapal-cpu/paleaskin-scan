// === TYPES ===

export type SkinDepth = "very-light" | "light" | "light-medium" | "medium" | "medium-tan" | "tan" | "tan-deep" | "deep" | "deep-rich" | "very-deep";
export type Undertone = "warm" | "cool" | "neutral" | "warm-olive" | "cool-olive" | "peach" | "golden" | "red";
export type UndertoneCategory = "warm" | "cool" | "neutral" | "olive";
export type TextureType = "smooth" | "normal" | "rough" | "combination";
export type HydrationLevel = "well-hydrated" | "normal" | "dehydrated";
export type WrinkleLevel = "minimal" | "mild" | "moderate" | "prominent";
export type Rating = "Worst" | "Bad" | "Better" | "Good" | "Excellent";

export interface ShadeCode {
  code: string;
  label: string;
  shadeName: string;       // e.g. "Angel Food", "Macchiato"
  closestProducts: string; // foundation recommendations
}

export interface ScoreWithRating {
  score: number;
  rating: Rating;
}

export interface SkinAnalysisResult {
  depth: SkinDepth;
  depthLabel: string;
  depthConcerns: string;
  foundationNote: string;

  undertone: Undertone;
  undertoneCategory: UndertoneCategory;
  undertoneConfidence: number;
  veinColor: string;
  jewelryPreference: string;
  sunReaction: string;
  foundationBase: string;

  shadeCode: ShadeCode;

  texture: TextureType;
  hydration: HydrationLevel;
  wrinkleLevel: WrinkleLevel;
  wrinkleDetails: string;

  overallScore: ScoreWithRating;
  textureScore: ScoreWithRating;
  hydrationScore: ScoreWithRating;
  undertoneScore: ScoreWithRating;
  depthScore: ScoreWithRating;
  wrinkleScore: ScoreWithRating;

  dominantHue: string;
  recommendations: string[];
  foundationMatches: FoundationMatch[];
}

// === HELPERS ===

function getRating(score: number): Rating {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 5) return "Better";
  if (score >= 3) return "Bad";
  return "Worst";
}

function makeScore(raw: number): ScoreWithRating {
  const score = Math.max(1, Math.min(10, Math.round(raw)));
  return { score, rating: getRating(score) };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// === PROFESSIONAL SHADE DATABASE ===
// Based on Huda Beauty complexion shade system (110-590 range)

interface ShadeEntry {
  shadeNumber: number;
  name: string;
  undertoneCode: string; // N, G, B, R
  depthRange: [number, number]; // brightness range
  undertoneType: Undertone;
  depthCategory: SkinDepth;
}

const SHADE_DATABASE: ShadeEntry[] = [
  // Very Light (Porcelain) — 200-240 brightness
  { shadeNumber: 110, name: "Angel Food", undertoneCode: "N", depthRange: [220, 245], undertoneType: "neutral", depthCategory: "very-light" },
  { shadeNumber: 120, name: "Vanilla", undertoneCode: "B", depthRange: [215, 240], undertoneType: "peach", depthCategory: "very-light" },

  // Light — 190-220 brightness
  { shadeNumber: 130, name: "Panna Cotta", undertoneCode: "G", depthRange: [200, 225], undertoneType: "golden", depthCategory: "light" },
  { shadeNumber: 140, name: "Cashew", undertoneCode: "G", depthRange: [195, 218], undertoneType: "golden", depthCategory: "light" },
  { shadeNumber: 150, name: "Crème Brûlée", undertoneCode: "G", depthRange: [190, 212], undertoneType: "golden", depthCategory: "light" },

  // Light-Medium — 170-200 brightness
  { shadeNumber: 200, name: "Shortbread", undertoneCode: "B", depthRange: [180, 205], undertoneType: "peach", depthCategory: "light-medium" },
  { shadeNumber: 210, name: "Chai", undertoneCode: "B", depthRange: [175, 198], undertoneType: "peach", depthCategory: "light-medium" },
  { shadeNumber: 220, name: "Custard", undertoneCode: "N", depthRange: [170, 195], undertoneType: "neutral", depthCategory: "light-medium" },
  { shadeNumber: 230, name: "Macaroon", undertoneCode: "N", depthRange: [165, 190], undertoneType: "neutral", depthCategory: "light-medium" },
  { shadeNumber: 240, name: "Toasted Coconut", undertoneCode: "N", depthRange: [160, 185], undertoneType: "neutral", depthCategory: "light-medium" },

  // Medium — 145-175 brightness
  { shadeNumber: 245, name: "Peaches N' Cream", undertoneCode: "B", depthRange: [155, 180], undertoneType: "peach", depthCategory: "medium" },
  { shadeNumber: 250, name: "Cheesecake", undertoneCode: "G", depthRange: [150, 175], undertoneType: "golden", depthCategory: "medium" },
  { shadeNumber: 255, name: "Apple Pie", undertoneCode: "B", depthRange: [148, 170], undertoneType: "peach", depthCategory: "medium" },
  { shadeNumber: 300, name: "Latte", undertoneCode: "N", depthRange: [143, 168], undertoneType: "neutral", depthCategory: "medium" },
  { shadeNumber: 310, name: "Amaretti", undertoneCode: "G", depthRange: [138, 162], undertoneType: "golden", depthCategory: "medium" },
  { shadeNumber: 315, name: "Shortcake", undertoneCode: "B", depthRange: [135, 158], undertoneType: "peach", depthCategory: "medium" },

  // Medium-Tan — 120-150 brightness
  { shadeNumber: 320, name: "Tres Leches", undertoneCode: "G", depthRange: [130, 155], undertoneType: "golden", depthCategory: "medium-tan" },
  { shadeNumber: 330, name: "Butter Pecan", undertoneCode: "N", depthRange: [125, 150], undertoneType: "neutral", depthCategory: "medium-tan" },
  { shadeNumber: 335, name: "Beignet", undertoneCode: "B", depthRange: [122, 148], undertoneType: "warm", depthCategory: "medium-tan" },
  { shadeNumber: 340, name: "Baklava", undertoneCode: "G", depthRange: [118, 145], undertoneType: "golden", depthCategory: "medium-tan" },
  { shadeNumber: 350, name: "Dulce de Leche", undertoneCode: "G", depthRange: [115, 140], undertoneType: "golden", depthCategory: "medium-tan" },

  // Tan — 100-125 brightness
  { shadeNumber: 400, name: "Macchiato", undertoneCode: "G", depthRange: [108, 132], undertoneType: "warm-olive", depthCategory: "tan" },
  { shadeNumber: 405, name: "Biscotti", undertoneCode: "N", depthRange: [105, 128], undertoneType: "neutral", depthCategory: "tan" },
  { shadeNumber: 410, name: "Brown Sugar", undertoneCode: "G", depthRange: [100, 125], undertoneType: "golden", depthCategory: "tan" },
  { shadeNumber: 415, name: "Churro", undertoneCode: "N", depthRange: [97, 122], undertoneType: "neutral", depthCategory: "tan" },
  { shadeNumber: 420, name: "Toffee", undertoneCode: "G", depthRange: [93, 118], undertoneType: "golden", depthCategory: "tan" },

  // Tan-Deep — 80-105 brightness
  { shadeNumber: 430, name: "Gingerbread", undertoneCode: "N", depthRange: [88, 112], undertoneType: "neutral", depthCategory: "tan-deep" },
  { shadeNumber: 440, name: "Cinnamon", undertoneCode: "G", depthRange: [83, 108], undertoneType: "warm", depthCategory: "tan-deep" },
  { shadeNumber: 450, name: "Chocolate Mousse", undertoneCode: "G", depthRange: [78, 102], undertoneType: "warm", depthCategory: "tan-deep" },
  { shadeNumber: 455, name: "Peanut Butter Cup", undertoneCode: "R", depthRange: [75, 98], undertoneType: "red", depthCategory: "tan-deep" },

  // Deep — 60-85 brightness
  { shadeNumber: 500, name: "Mocha", undertoneCode: "G", depthRange: [70, 92], undertoneType: "golden", depthCategory: "deep" },
  { shadeNumber: 510, name: "Cocoa", undertoneCode: "R", depthRange: [65, 88], undertoneType: "red", depthCategory: "deep" },
  { shadeNumber: 520, name: "Nutmeg", undertoneCode: "G", depthRange: [60, 82], undertoneType: "golden", depthCategory: "deep" },
  { shadeNumber: 530, name: "Coffee Bean", undertoneCode: "R", depthRange: [55, 78], undertoneType: "red", depthCategory: "deep" },

  // Deep-Rich — 45-68 brightness
  { shadeNumber: 540, name: "Chocolate Truffle", undertoneCode: "G", depthRange: [50, 72], undertoneType: "golden", depthCategory: "deep-rich" },
  { shadeNumber: 550, name: "Hot Fudge", undertoneCode: "R", depthRange: [45, 68], undertoneType: "red", depthCategory: "deep-rich" },
  { shadeNumber: 560, name: "Ganache", undertoneCode: "R", depthRange: [40, 62], undertoneType: "red", depthCategory: "deep-rich" },

  // Very Deep — 25-50 brightness
  { shadeNumber: 590, name: "Lava Cake", undertoneCode: "R", depthRange: [25, 55], undertoneType: "red", depthCategory: "very-deep" },
];

// === ADVANCED COLOR SPACE ANALYSIS ===

interface LabColor {
  L: number; // Lightness 0-100
  a: number; // green-red
  b: number; // blue-yellow
}

function rgbToLab(r: number, g: number, b: number): LabColor {
  // RGB to XYZ
  let rr = r / 255, gg = g / 255, bb = b / 255;
  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;

  let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047;
  let y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750);
  let z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

  return {
    L: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };
}

function rgbToHSV(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s, v };
}

// === ENHANCED DEPTH CLASSIFICATION ===

interface DepthInfo {
  depth: SkinDepth;
  label: string;
  concerns: string;
  foundationNote: string;
  depthNumber: number; // 100-600 scale
}

function classifyDepth(labL: number, brightness: number): DepthInfo {
  // Use both Lab L* and RGB brightness for more accurate classification
  const combined = labL * 0.6 + (brightness / 255 * 100) * 0.4;

  if (combined > 82) return { depth: "very-light", label: "Porcelain / Ivory", depthNumber: 110, concerns: "Redness, visible capillaries, pink patches", foundationNote: "Avoid overly pink bases; neutral-to-yellow undertones work best" };
  if (combined > 74) return { depth: "light", label: "Fair Beige / Cream", depthNumber: 140, concerns: "Oxidation, shade turning orange", foundationNote: "Test in natural light — many 'light' shades oxidize darker" };
  if (combined > 66) return { depth: "light-medium", label: "Light Beige / Sand", depthNumber: 220, concerns: "Grey cast in wrong shade", foundationNote: "Balance yellow & peach — avoid pure pink bases" };
  if (combined > 58) return { depth: "medium", label: "Golden Beige / Honey", depthNumber: 300, concerns: "Orange cast common with wrong undertone", foundationNote: "Undertone precision is critical at this depth" };
  if (combined > 50) return { depth: "medium-tan", label: "Warm Beige / Caramel", depthNumber: 340, concerns: "Ashy or orange mismatch", foundationNote: "Golden and warm-neutral bases recommended" };
  if (combined > 42) return { depth: "tan", label: "Warm Brown / Toffee", depthNumber: 410, concerns: "Ashy cast, white flashback", foundationNote: "Avoid white-based pigments and titanium dioxide flashback" };
  if (combined > 34) return { depth: "tan-deep", label: "Rich Brown / Cinnamon", depthNumber: 445, concerns: "Red/grey undertone mismatch", foundationNote: "Red and golden balance is key — test in multiple lights" };
  if (combined > 26) return { depth: "deep", label: "Deep Brown / Espresso", depthNumber: 520, concerns: "Grey flashback, ashy powders", foundationNote: "Red & golden undertones needed — avoid high titanium dioxide" };
  if (combined > 18) return { depth: "deep-rich", label: "Rich Cocoa / Mahogany", depthNumber: 550, concerns: "Extreme flashback risk, limited shade options", foundationNote: "Look for brands with deep shade ranges and rich pigments" };
  return { depth: "very-deep", label: "Ebony / Obsidian", depthNumber: 590, concerns: "Flashback, chalky textures", foundationNote: "Avoid all titanium dioxide — use iron oxide-heavy formulas" };
}

// === ADVANCED UNDERTONE ANALYSIS ===

interface UndertoneInfo {
  undertone: Undertone;
  category: UndertoneCategory;
  confidence: number;
  veinColor: string;
  jewelryPreference: string;
  sunReaction: string;
  foundationBase: string;
}

function classifyUndertone(avgR: number, avgG: number, avgB: number, lab: LabColor, hsv: { h: number; s: number; v: number }): UndertoneInfo {
  // Multi-signal undertone analysis
  const warmthRatio = (avgR - avgB) / 255;
  const greenBias = (avgG - (avgR + avgB) / 2) / 255;
  const labASignal = lab.a; // positive = red, negative = green
  const labBSignal = lab.b; // positive = yellow, negative = blue
  const hue = hsv.h;
  const sat = hsv.s;

  // Compute undertone scores using multiple color space signals
  let warmScore = 0;
  let coolScore = 0;
  let neutralScore = 0;
  let oliveScore = 0;
  let goldenScore = 0;
  let peachScore = 0;
  let redScore = 0;

  // RGB-based signals
  if (warmthRatio > 0.10) warmScore += 3;
  else if (warmthRatio > 0.05) warmScore += 2;
  else if (warmthRatio > 0.02) warmScore += 1;

  if (warmthRatio < -0.05) coolScore += 3;
  else if (warmthRatio < -0.02) coolScore += 2;
  else if (warmthRatio < 0.01) coolScore += 1;

  if (Math.abs(warmthRatio) < 0.03) neutralScore += 2;

  // Lab-based signals (more perceptually uniform)
  if (labBSignal > 20) { goldenScore += 3; warmScore += 1; }
  else if (labBSignal > 12) { goldenScore += 2; warmScore += 1; }
  else if (labBSignal > 5) goldenScore += 1;

  if (labBSignal < -5) coolScore += 2;

  if (labASignal > 10) { redScore += 3; warmScore += 1; }
  else if (labASignal > 5) { redScore += 2; peachScore += 1; }
  else if (labASignal > 2) peachScore += 2;

  if (labASignal < -2 && labBSignal > 5) oliveScore += 3;
  if (labASignal < 0 && greenBias > 0.02) oliveScore += 2;

  // HSV hue-based signals
  if (hue >= 15 && hue <= 40 && sat > 0.12) { goldenScore += 2; warmScore += 1; }
  if (hue >= 0 && hue < 15 && sat > 0.10) { redScore += 2; }
  if (hue >= 40 && hue <= 55) peachScore += 1;
  if (hue >= 60 && hue <= 120 && sat > 0.08) oliveScore += 2;

  // Green cast detection for olive
  if (greenBias > 0.04 && warmthRatio > 0.01 && warmthRatio < 0.10) oliveScore += 3;
  if (greenBias > 0.025 && labASignal < 3) oliveScore += 1;

  // Determine winner
  const scores = { warm: warmScore, cool: coolScore, neutral: neutralScore, olive: oliveScore, golden: goldenScore, peach: peachScore, red: redScore };
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = entries[0][1];
  const topType = entries[0][0];
  const secondScore = entries[1][1];
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  // Calculate confidence based on separation between top and second
  const separation = topScore - secondScore;
  let confidence = clamp(50 + separation * 8 + (topScore / Math.max(totalScore, 1)) * 30, 45, 98);

  let undertone: Undertone;
  let category: UndertoneCategory;

  if (topType === "olive" && oliveScore >= 4) {
    undertone = labBSignal > 10 ? "warm-olive" : "cool-olive";
    category = "olive";
    confidence = clamp(confidence, 55, 92);
  } else if (topType === "golden" && goldenScore >= 3) {
    undertone = "golden";
    category = "warm";
  } else if (topType === "red" && redScore >= 3) {
    undertone = "red";
    category = "warm";
  } else if (topType === "peach" && peachScore >= 3) {
    undertone = "peach";
    category = "warm";
  } else if (topType === "cool" && coolScore >= 3) {
    undertone = "cool";
    category = "cool";
  } else if (topType === "warm" && warmScore >= 3) {
    undertone = "warm";
    category = "warm";
  } else if (neutralScore >= warmScore && neutralScore >= coolScore) {
    undertone = "neutral";
    category = "neutral";
    confidence = clamp(confidence - 5, 45, 88);
  } else if (warmScore > coolScore) {
    undertone = "warm";
    category = "warm";
  } else {
    undertone = "cool";
    category = "cool";
  }

  const infoMap: Record<Undertone, Omit<UndertoneInfo, "undertone" | "category" | "confidence">> = {
    "warm": { veinColor: "Green-toned veins", jewelryPreference: "Gold flatters most", sunReaction: "Tans easily with golden tone", foundationBase: "Yellow / Warm base" },
    "cool": { veinColor: "Blue-purple veins", jewelryPreference: "Silver and platinum", sunReaction: "Burns easily, pinkish tan", foundationBase: "Pink / Blue-based" },
    "neutral": { veinColor: "Blue-green blend veins", jewelryPreference: "Both gold & silver work", sunReaction: "Mild tan with balance", foundationBase: "Balanced / Neutral base" },
    "warm-olive": { veinColor: "Greenish with muted warmth", jewelryPreference: "Antique gold, warm metals", sunReaction: "Tans deeply, rarely burns", foundationBase: "Green-balanced yellow base" },
    "cool-olive": { veinColor: "Grey-green cast", jewelryPreference: "Rose gold, soft silver", sunReaction: "Tans moderately with grey cast", foundationBase: "Green-balanced neutral base" },
    "golden": { veinColor: "Warm green veins", jewelryPreference: "Rich yellow gold", sunReaction: "Tans golden-bronze", foundationBase: "Rich golden / Yellow base" },
    "peach": { veinColor: "Soft pink-green veins", jewelryPreference: "Rose gold suits best", sunReaction: "Light tan with peachy flush", foundationBase: "Peach / Warm-pink base" },
    "red": { veinColor: "Deep red-blue veins", jewelryPreference: "Copper and bronze", sunReaction: "Tans with warm-red undertone", foundationBase: "Red / Warm-red base" },
  };

  return { undertone, category, confidence: Math.round(confidence), ...infoMap[undertone] };
}

// === SHADE MATCHING ===

function findClosestShade(brightness: number, undertone: Undertone, category: UndertoneCategory): ShadeCode {
  // Find shades whose brightness range includes our value
  let candidates = SHADE_DATABASE.filter(s =>
    brightness >= s.depthRange[0] - 8 && brightness <= s.depthRange[1] + 8
  );

  if (candidates.length === 0) {
    // Fallback: find closest by brightness midpoint
    candidates = [...SHADE_DATABASE].sort((a, b) => {
      const midA = (a.depthRange[0] + a.depthRange[1]) / 2;
      const midB = (b.depthRange[0] + b.depthRange[1]) / 2;
      return Math.abs(midA - brightness) - Math.abs(midB - brightness);
    }).slice(0, 3);
  }

  // Score candidates by undertone match
  const undertoneCodeMap: Record<UndertoneCategory, string[]> = {
    warm: ["G", "B", "R"],
    cool: ["B", "N"],
    neutral: ["N", "B"],
    olive: ["G", "N"],
  };

  const preferredCodes = undertoneCodeMap[category] || ["N"];

  let best = candidates[0];
  let bestScore = -Infinity;

  for (const c of candidates) {
    let score = 0;
    // Brightness proximity
    const mid = (c.depthRange[0] + c.depthRange[1]) / 2;
    score -= Math.abs(mid - brightness) * 0.5;
    // Undertone match
    if (c.undertoneType === undertone) score += 10;
    if (preferredCodes.includes(c.undertoneCode)) score += 5;
    if (score > bestScore) { bestScore = score; best = c; }
  }

  const undertoneLabel = undertone.charAt(0).toUpperCase() + undertone.slice(1).replace("-", " ");
  const depthLabel = best.depthCategory.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return {
    code: `${best.shadeNumber}${best.undertoneCode}`,
    label: `${depthLabel} — ${undertoneLabel}`,
    shadeName: best.name,
    closestProducts: getProductRecs(best.depthCategory, category),
  };
}

function getProductRecs(depth: SkinDepth, category: UndertoneCategory): string {
  const warmDeep = depth === "deep" || depth === "deep-rich" || depth === "very-deep";
  if (category === "warm" && !warmDeep) return "Golden/yellow-based foundations (Huda FauxFilter, MAC NC series)";
  if (category === "warm" && warmDeep) return "Rich golden foundations (Fenty 400+, NARS Tahoe+)";
  if (category === "cool") return "Pink/blue-based foundations (MAC NW series, NARS Mont Blanc line)";
  if (category === "olive") return "Green-balanced foundations (Koh Gen Do, Giorgio Armani Luminous Silk)";
  return "Neutral-balanced foundations (Fenty, Dior Backstage, NARS Sheer Glow)";
}

// === INDIAN MARKET FOUNDATION DATABASE ===
// Real foundations available across Nykaa, Amazon.in, Flipkart and Myntra,
// mapped to the same brightness scale as SHADE_DATABASE (0-255).

type Retailer = "Nykaa" | "Amazon" | "Flipkart" | "Myntra";

export interface FoundationMatch {
  brand: string;
  product: string;
  shade: string;
  undertone: "warm" | "cool" | "neutral";
  price: string;
  finish: string;
  note: string;
  retailers: { name: Retailer; url: string }[];
}

interface IndianProductEntry {
  brand: string;
  product: string;
  shade: string;
  undertone: "warm" | "cool" | "neutral";
  depthRange: [number, number]; // brightness range on the 0-255 scale
  price: string;
  finish: string;
  note: string;
  retailers: Retailer[];
}

const RETAILER_SEARCH_URLS: Record<Retailer, (query: string) => string> = {
  Nykaa: (q) => `https://www.nykaa.com/search/result/?q=${encodeURIComponent(q)}`,
  Amazon: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  Flipkart: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  Myntra: (q) => `https://www.myntra.com/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, "-"))}?rawQuery=${encodeURIComponent(q)}`,
};

const INDIAN_FOUNDATION_DB: IndianProductEntry[] = [
  // Very Light — Porcelain / Ivory
  { brand: "Maybelline", product: "Fit Me Matte + Poreless", shade: "110 Porcelain", undertone: "neutral", depthRange: [205, 240], price: "₹549", finish: "Matte", note: "Budget-friendly everyday base", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },
  { brand: "L'Oréal Paris", product: "Infallible 24H Fresh Wear", shade: "20 Ivory", undertone: "neutral", depthRange: [210, 245], price: "₹1,599", finish: "Natural matte", note: "Full coverage, transfer-proof", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },
  { brand: "MAC", product: "Studio Fix Fluid SPF 15", shade: "NC15", undertone: "neutral", depthRange: [200, 232], price: "₹3,900", finish: "Satin", note: "Gold-standard neutral fair shade", retailers: ["Nykaa", "Amazon", "Myntra"] },
  { brand: "Lakmé", product: "Absolute 3D Cover", shade: "Ivory Cream", undertone: "cool", depthRange: [205, 235], price: "₹1,299", finish: "Dewy", note: "Cool-leaning ivory for pink undertones", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },

  // Light — Fair Beige
  { brand: "Maybelline", product: "Fit Me Matte + Poreless", shade: "120 Classic Ivory", undertone: "neutral", depthRange: [185, 215], price: "₹549", finish: "Matte", note: "Most popular fair shade in India", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },
  { brand: "MAC", product: "Studio Fix Fluid SPF 15", shade: "NC20", undertone: "warm", depthRange: [185, 215], price: "₹3,900", finish: "Satin", note: "Warm beige, minimal oxidation", retailers: ["Nykaa", "Amazon", "Myntra"] },
  { brand: "Huda Beauty", product: "#FauxFilter Luminous Matte", shade: "140G Cashew", undertone: "warm", depthRange: [190, 220], price: "₹3,950", finish: "Luminous matte", note: "Golden-fair, great for wheatish-light skin", retailers: ["Nykaa", "Amazon"] },
  { brand: "NYX Professional Makeup", product: "Can't Stop Won't Stop 24H", shade: "06 Golden", undertone: "warm", depthRange: [178, 208], price: "₹1,799", finish: "Matte", note: "Long-wear warm light shade", retailers: ["Nykaa", "Amazon"] },

  // Light-Medium — Sand / Wheatish
  { brand: "Maybelline", product: "Fit Me Matte + Poreless", shade: "220 Natural Beige", undertone: "neutral", depthRange: [170, 200], price: "₹549", finish: "Matte", note: "Neutral wheatish shade, oxidizes little", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },
  { brand: "MAC", product: "Studio Fix Fluid SPF 15", shade: "NC25", undertone: "warm", depthRange: [170, 198], price: "₹3,900", finish: "Satin", note: "Classic wheatish-light match", retailers: ["Nykaa", "Amazon", "Myntra"] },
  { brand: "Huda Beauty", product: "#FauxFilter Luminous Matte", shade: "210B Chai", undertone: "neutral", depthRange: [175, 198], price: "₹3,950", finish: "Luminous matte", note: "Peach-neutral chai shade, masks grey cast", retailers: ["Nykaa", "Amazon"] },
  { brand: "Lakmé", product: "Absolute 3D Cover", shade: "Warm Sand", undertone: "warm", depthRange: [160, 190], price: "₹1,299", finish: "Dewy", note: "Warm sand for golden wheatish skin", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },

  // Medium — Golden Beige / Honey
  { brand: "Maybelline", product: "Fit Me Matte + Poreless", shade: "230 Natural Buff", undertone: "neutral", depthRange: [148, 172], price: "₹549", finish: "Matte", note: "Neutral honey shade", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },
  { brand: "MAC", product: "Studio Fix Fluid SPF 15", shade: "NC30", undertone: "warm", depthRange: [148, 175], price: "₹3,900", finish: "Satin", note: "Golden honey — undertone precision critical here", retailers: ["Nykaa", "Amazon", "Myntra"] },
  { brand: "Estée Lauder", product: "Double Wear Stay-in-Place", shade: "3W1 Tawny", undertone: "warm", depthRange: [140, 165], price: "₹4,950", finish: "Matte", note: "Warm golden medium, 24-hour wear", retailers: ["Nykaa", "Amazon"] },
  { brand: "Colorbar", product: "Perfect Match", shade: "004 Sand", undertone: "neutral", depthRange: [140, 170], price: "₹995", finish: "Natural", note: "Affordable Indian-brand medium shade", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },

  // Medium-Tan — Caramel
  { brand: "Maybelline", product: "Fit Me Matte + Poreless", shade: "310 Warm Sun", undertone: "warm", depthRange: [122, 148], price: "₹549", finish: "Matte", note: "Warm caramel budget pick", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },
  { brand: "MAC", product: "Studio Fix Fluid SPF 15", shade: "NC35", undertone: "warm", depthRange: [120, 148], price: "₹3,900", finish: "Satin", note: "Golden caramel, avoids orange cast", retailers: ["Nykaa", "Amazon", "Myntra"] },
  { brand: "Huda Beauty", product: "#FauxFilter Luminous Matte", shade: "330N Butter Pecan", undertone: "neutral", depthRange: [125, 150], price: "₹3,950", finish: "Luminous matte", note: "Neutral caramel, balances ashy cast", retailers: ["Nykaa", "Amazon"] },

  // Tan — Toffee
  { brand: "MAC", product: "Studio Fix Fluid SPF 15", shade: "NC40", undertone: "warm", depthRange: [100, 128], price: "₹3,900", finish: "Satin", note: "Golden toffee, no white flashback", retailers: ["Nykaa", "Amazon", "Myntra"] },
  { brand: "Maybelline", product: "Fit Me Matte + Poreless", shade: "330 Toffee", undertone: "warm", depthRange: [95, 122], price: "₹549", finish: "Matte", note: "Best budget toffee shade in India", retailers: ["Nykaa", "Amazon", "Flipkart", "Myntra"] },

  // Tan-Deep — Cinnamon
  { brand: "MAC", product: "Studio Fix Fluid SPF 15", shade: "NC45", undertone: "warm", depthRange: [83, 108], price: "₹3,900", finish: "Satin", note: "Warm cinnamon, red-gold balance", retailers: ["Nykaa", "Amazon", "Myntra"] },
  { brand: "Huda Beauty", product: "#FauxFilter Luminous Matte", shade: "430N Gingerbread", undertone: "neutral", depthRange: [85, 112], price: "₹3,950", finish: "Luminous matte", note: "Neutral deep-caramel cult favourite", retailers: ["Nykaa", "Amazon"] },

  // Deep — Espresso
  { brand: "MAC", product: "Studio Fix Fluid SPF 15", shade: "NC50", undertone: "warm", depthRange: [68, 92], price: "₹3,900", finish: "Satin", note: "Rich golden espresso, low titanium dioxide", retailers: ["Nykaa", "Amazon", "Myntra"] },
  { brand: "Bobbi Brown", product: "Skin Long-Wear Weightless", shade: "Warm Espresso", undertone: "warm", depthRange: [60, 85], price: "₹4,950", finish: "Satin", note: "Deep golden, ashy-cast safe", retailers: ["Nykaa", "Amazon"] },

  // Deep-Rich & Very Deep — Mahogany / Ebony
  { brand: "MAC", product: "Studio Fix Fluid SPF 15", shade: "NC55", undertone: "warm", depthRange: [48, 72], price: "₹3,900", finish: "Satin", note: "Rich mahogany with true pigment", retailers: ["Nykaa", "Amazon", "Myntra"] },
  { brand: "Huda Beauty", product: "#FauxFilter Luminous Matte", shade: "530R Coffee Bean", undertone: "warm", depthRange: [50, 80], price: "₹3,950", finish: "Luminous matte", note: "Red-warm deep shade, no grey flashback", retailers: ["Nykaa", "Amazon"] },
  { brand: "Bobbi Brown", product: "Skin Long-Wear Weightless", shade: "Cool Espresso", undertone: "cool", depthRange: [28, 58], price: "₹4,950", finish: "Satin", note: "One of the deepest cool shades in India", retailers: ["Nykaa", "Amazon"] },
  { brand: "NYX Professional Makeup", product: "Can't Stop Won't Stop 24H", shade: "16 Espresso", undertone: "warm", depthRange: [28, 55], price: "₹1,799", finish: "Matte", note: "Affordable deep-warm option", retailers: ["Nykaa", "Amazon"] },
];

function buildRetailerLinks(entry: IndianProductEntry): FoundationMatch["retailers"] {
  const query = `${entry.brand} ${entry.product} ${entry.shade}`;
  return entry.retailers.map((name) => ({ name, url: RETAILER_SEARCH_URLS[name](query) }));
}

export function getIndianFoundationMatches(brightness: number, category: UndertoneCategory): FoundationMatch[] {
  const scored = INDIAN_FOUNDATION_DB.map((entry) => {
    const mid = (entry.depthRange[0] + entry.depthRange[1]) / 2;
    // Distance from brightness to the shade's range (0 when inside the range)
    const dist = brightness < entry.depthRange[0]
      ? entry.depthRange[0] - brightness
      : brightness > entry.depthRange[1]
        ? brightness - entry.depthRange[1]
        : 0;

    let score = -dist * 0.6;
    if (entry.undertone === category) score += 8;
    else if (entry.undertone === "neutral") score += 3; // neutrals suit any undertone
    else score -= 6;

    return { entry, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ entry }) => ({
      brand: entry.brand,
      product: entry.product,
      shade: entry.shade,
      undertone: entry.undertone,
      price: entry.price,
      finish: entry.finish,
      note: entry.note,
      retailers: buildRetailerLinks(entry),
    }));
}

// === SKIN PIXEL SAMPLING (IMPROVED) ===

interface SkinSample {
  avgR: number; avgG: number; avgB: number;
  brightness: number;
  lab: LabColor;
  hsv: { h: number; s: number; v: number };
  variances: number[];
  edgeStrengths: number[];
  horizontalEdges: number[];
  laplacianValues: number[];
  samples: number;
}

function sampleSkinPixels(data: Uint8ClampedArray, width: number, height: number): SkinSample | null {
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const sampleRadius = Math.min(width, height) * 0.22;

  // Multi-zone sampling: center face + cheek zones
  const zones = [
    { x: cx, y: cy, r: sampleRadius },                           // center
    { x: cx - sampleRadius * 0.5, y: cy + sampleRadius * 0.2, r: sampleRadius * 0.4 }, // left cheek
    { x: cx + sampleRadius * 0.5, y: cy + sampleRadius * 0.2, r: sampleRadius * 0.4 }, // right cheek
    { x: cx, y: cy + sampleRadius * 0.4, r: sampleRadius * 0.3 }, // chin area
  ];

  let totalR = 0, totalG = 0, totalB = 0;
  let samples = 0;
  const variances: number[] = [];
  const edgeStrengths: number[] = [];
  const horizontalEdges: number[] = [];
  const laplacianValues: number[] = [];

  // Skin-tone detection: filter non-skin pixels using YCbCr
  function isSkinPixel(r: number, g: number, b: number): boolean {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.169 * r - 0.331 * g + 0.500 * b;
    const cr = 128 + 0.500 * r - 0.419 * g - 0.081 * b;
    // Relaxed skin color range in YCbCr
    return y > 40 && y < 235 && cb > 77 && cb < 135 && cr > 133 && cr < 180;
  }

  for (const zone of zones) {
    for (let y = zone.y - zone.r; y < zone.y + zone.r; y += 2) {
      for (let x = zone.x - zone.r; x < zone.x + zone.r; x += 2) {
        const dx = x - zone.x;
        const dy = y - zone.y;
        if (dx * dx + dy * dy > zone.r * zone.r) continue;

        const px = Math.floor(x);
        const py = Math.floor(y);
        if (px < 0 || px >= width || py < 0 || py >= height) continue;

        const i = (py * width + px) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];

        if (!isSkinPixel(r, g, b)) continue;

        totalR += r;
        totalG += g;
        totalB += b;
        samples++;

        // Texture variance (neighbor comparison)
        if (px + 2 < width) {
          const ni = (py * width + (px + 2)) * 4;
          const nr = data[ni], ng = data[ni + 1], nb = data[ni + 2];
          const diff = Math.abs(r - nr) + Math.abs(g - ng) + Math.abs(b - nb);
          variances.push(diff);
        }

        // Enhanced multi-directional wrinkle edge detection
        if (px > 1 && px < width - 2 && py > 1 && py < height - 2) {
          const getLum = (ix: number, iy: number) => {
            const idx = (iy * width + ix) * 4;
            return 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          };

          const lum = getLum(px, py);

          // 3x3 Sobel for horizontal and vertical gradients
          const gx = (
            -1 * getLum(px - 1, py - 1) + 1 * getLum(px + 1, py - 1) +
            -2 * getLum(px - 1, py) + 2 * getLum(px + 1, py) +
            -1 * getLum(px - 1, py + 1) + 1 * getLum(px + 1, py + 1)
          );
          const gy = (
            -1 * getLum(px - 1, py - 1) - 2 * getLum(px, py - 1) - 1 * getLum(px + 1, py - 1) +
            1 * getLum(px - 1, py + 1) + 2 * getLum(px, py + 1) + 1 * getLum(px + 1, py + 1)
          );

          const edgeMag = Math.sqrt(gx * gx + gy * gy);
          // Normalize by local brightness to be fair across skin tones
          const normalizedEdge = lum > 10 ? edgeMag / (lum / 50) : edgeMag;

          const edgeAngle = Math.atan2(gy, gx) * (180 / Math.PI);
          const absAngle = Math.abs(edgeAngle);

          // Wrinkle-range edges (not too weak = noise, not too strong = features/shadows)
          if (normalizedEdge > 3 && normalizedEdge < 60) {
            edgeStrengths.push(normalizedEdge);
            // Horizontal-ish edges = forehead lines, under-eye creases
            if (absAngle < 30 || absAngle > 150) {
              horizontalEdges.push(normalizedEdge);
            }
          }

          // Laplacian (second-order) for fine line detection
          const lap = getLum(px - 1, py) + getLum(px + 1, py) + getLum(px, py - 1) + getLum(px, py + 1) - 4 * lum;
          if (Math.abs(lap) > 2 && Math.abs(lap) < 40) {
            laplacianValues.push(Math.abs(lap));
          }
        }
      }
    }
  }

  if (samples < 50) return null;

  const avgR = totalR / samples;
  const avgG = totalG / samples;
  const avgB = totalB / samples;

  return {
    avgR, avgG, avgB,
    brightness: (avgR + avgG + avgB) / 3,
    lab: rgbToLab(avgR, avgG, avgB),
    hsv: rgbToHSV(avgR, avgG, avgB),
    variances,
    edgeStrengths,
    horizontalEdges,
    laplacianValues,
    samples,
  };
}

// === MAIN ANALYSIS ===

export function analyzeSkin(imageData: ImageData): SkinAnalysisResult {
  const { data, width, height } = imageData;

  const sample = sampleSkinPixels(data, width, height);
  if (!sample) return getDefaultResult();

  const { avgR, avgG, avgB, brightness, lab, hsv, variances, edgeStrengths, horizontalEdges, laplacianValues } = sample;

  // Level 1: Depth (using Lab L* for perceptual accuracy)
  const depthInfo = classifyDepth(lab.L, brightness);

  // Level 2: Undertone (multi-signal analysis)
  const undertoneInfo = classifyUndertone(avgR, avgG, avgB, lab, hsv);

  // Level 3: Shade matching against professional shade database
  const shadeCode = findClosestShade(brightness, undertoneInfo.undertone, undertoneInfo.category);

  // Texture analysis
  const avgVariance = variances.length > 0 ? variances.reduce((a, b) => a + b, 0) / variances.length : 15;
  let texture: TextureType;
  let textureRaw: number;
  if (avgVariance < 7) { texture = "smooth"; textureRaw = 9; }
  else if (avgVariance < 16) { texture = "normal"; textureRaw = 7; }
  else if (avgVariance < 28) { texture = "combination"; textureRaw = 5; }
  else { texture = "rough"; textureRaw = 3; }

  // Hydration (saturation-based)
  const maxC = Math.max(avgR, avgG, avgB);
  const minC = Math.min(avgR, avgG, avgB);
  const saturation = maxC > 0 ? (maxC - minC) / maxC : 0;
  let hydration: HydrationLevel;
  let hydrationRaw: number;
  if (saturation > 0.15) { hydration = "well-hydrated"; hydrationRaw = 8; }
  else if (saturation > 0.08) { hydration = "normal"; hydrationRaw = 6; }
  else { hydration = "dehydrated"; hydrationRaw = 3; }

  // === ENHANCED WRINKLE DETECTION ===
  // Uses multiple independent signals to avoid giving everyone the same result
  
  const avgEdge = edgeStrengths.length > 0 ? edgeStrengths.reduce((a, b) => a + b, 0) / edgeStrengths.length : 3;
  const edgeDensity = edgeStrengths.length / Math.max(sample.samples, 1);
  
  // Signal 1: Horizontal edge ratio — wrinkles are mostly horizontal
  const horizRatio = horizontalEdges.length / Math.max(edgeStrengths.length, 1);
  
  // Signal 2: Edge strength standard deviation — wrinkles create uneven edge distribution
  const edgeStdDev = edgeStrengths.length > 5
    ? Math.sqrt(edgeStrengths.reduce((sum, e) => sum + (e - avgEdge) ** 2, 0) / edgeStrengths.length)
    : 0;
  
  // Signal 3: High-edge percentile — top 10% edge strength captures actual wrinkles vs noise
  const sortedEdges = [...edgeStrengths].sort((a, b) => b - a);
  const p90Edge = sortedEdges.length > 10 ? sortedEdges[Math.floor(sortedEdges.length * 0.1)] : avgEdge;
  
  // Signal 4: Laplacian (fine line sensitivity)
  const avgLap = laplacianValues.length > 0 ? laplacianValues.reduce((a, b) => a + b, 0) / laplacianValues.length : 2;
  const lapDensity = laplacianValues.length / Math.max(sample.samples, 1);
  
  // Composite wrinkle score (0-100) combining independent signals
  let wrinkleComposite = 0;
  wrinkleComposite += clamp(edgeDensity * 80, 0, 25);          // edge density contribution
  wrinkleComposite += clamp(horizRatio * 30, 0, 20);           // horizontal edge contribution
  wrinkleComposite += clamp(edgeStdDev * 1.5, 0, 15);         // edge variance contribution
  wrinkleComposite += clamp((p90Edge - 8) * 1.2, 0, 20);      // strong-edge contribution
  wrinkleComposite += clamp(avgLap * 1.5, 0, 10);             // fine-line Laplacian contribution
  wrinkleComposite += clamp(lapDensity * 60, 0, 10);          // Laplacian density contribution

  let wrinkleLevel: WrinkleLevel;
  let wrinkleRaw: number;
  let wrinkleDetails: string;
  
  if (wrinkleComposite < 18) {
    wrinkleLevel = "minimal"; wrinkleRaw = 9;
    wrinkleDetails = `Very few fine lines detected (score ${wrinkleComposite.toFixed(0)}/100). Skin appears youthful and smooth with minimal creasing.`;
  } else if (wrinkleComposite < 35) {
    wrinkleLevel = "mild"; wrinkleRaw = 7;
    wrinkleDetails = `Minor fine lines detected (score ${wrinkleComposite.toFixed(0)}/100). Mild expression lines present — typical of healthy skin. Preventive care recommended.`;
  } else if (wrinkleComposite < 55) {
    wrinkleLevel = "moderate"; wrinkleRaw = 5;
    wrinkleDetails = `Moderate fine lines and creases detected (score ${wrinkleComposite.toFixed(0)}/100). Visible lines around expression areas. Retinol and peptide serums recommended.`;
  } else {
    wrinkleLevel = "prominent"; wrinkleRaw = 3;
    wrinkleDetails = `Prominent wrinkles observed (score ${wrinkleComposite.toFixed(0)}/100). Deep creases and visible lines detected. Consider targeted anti-aging treatments.`;
  }

  const undertoneRaw = Math.round(undertoneInfo.confidence / 10);
  const depthRaw = clamp(Math.round(8 - Math.abs(lab.L - 55) / 15), 4, 10);
  const overallRaw = Math.round((textureRaw + hydrationRaw + undertoneRaw + depthRaw + wrinkleRaw) / 5);

  const dominantHue = rgbToHueName(avgR, avgG, avgB);
  const recommendations = getRecommendations(undertoneInfo.undertone, undertoneInfo.category, texture, hydration, depthInfo.depth, wrinkleLevel);

  return {
    depth: depthInfo.depth,
    depthLabel: depthInfo.label,
    depthConcerns: depthInfo.concerns,
    foundationNote: depthInfo.foundationNote,

    undertone: undertoneInfo.undertone,
    undertoneCategory: undertoneInfo.category,
    undertoneConfidence: undertoneInfo.confidence,
    veinColor: undertoneInfo.veinColor,
    jewelryPreference: undertoneInfo.jewelryPreference,
    sunReaction: undertoneInfo.sunReaction,
    foundationBase: undertoneInfo.foundationBase,

    shadeCode,
    texture,
    hydration,
    wrinkleLevel,
    wrinkleDetails,

    overallScore: makeScore(overallRaw),
    textureScore: makeScore(textureRaw),
    hydrationScore: makeScore(hydrationRaw),
    undertoneScore: makeScore(undertoneRaw),
    depthScore: makeScore(depthRaw),
    wrinkleScore: makeScore(wrinkleRaw),

    dominantHue,
    recommendations,
    foundationMatches: getIndianFoundationMatches(brightness, undertoneInfo.category),
  };
}

// === UTILITIES ===

function getDefaultResult(): SkinAnalysisResult {
  return {
    depth: "medium", depthLabel: "N/A", depthConcerns: "N/A", foundationNote: "N/A",
    undertone: "neutral", undertoneCategory: "neutral", undertoneConfidence: 50,
    veinColor: "N/A", jewelryPreference: "N/A", sunReaction: "N/A", foundationBase: "N/A",
    shadeCode: { code: "N/A", label: "N/A", shadeName: "N/A", closestProducts: "N/A" },
    texture: "normal", hydration: "normal",
    wrinkleLevel: "mild", wrinkleDetails: "Unable to analyze — try better lighting.",
    overallScore: makeScore(5), textureScore: makeScore(5), hydrationScore: makeScore(5),
    undertoneScore: makeScore(5), depthScore: makeScore(5), wrinkleScore: makeScore(5),
    dominantHue: "N/A",
    recommendations: ["Try taking the photo in better lighting."],
    foundationMatches: [],
  };
}

function rgbToHueName(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 10) return "Neutral";
  let h = 0;
  if (max === r) h = ((g - b) / (max - min)) * 60;
  else if (max === g) h = (2 + (b - r) / (max - min)) * 60;
  else h = (4 + (r - g) / (max - min)) * 60;
  if (h < 0) h += 360;
  if (h < 15 || h >= 345) return "Rose";
  if (h < 35) return "Peach";
  if (h < 55) return "Golden";
  if (h < 85) return "Warm Yellow";
  if (h < 150) return "Olive";
  if (h < 260) return "Blue-toned";
  return "Mauve";
}

function getRecommendations(undertone: Undertone, category: UndertoneCategory, texture: string, hydration: string, depth: SkinDepth, wrinkleLevel?: string): string[] {
  const recs: string[] = [];

  // Undertone-specific recs
  if (category === "warm") {
    if (undertone === "golden") {
      recs.push("Rich golden and warm yellow-based foundations will be your best match. Look for shades marked 'G' or 'W'.");
    } else if (undertone === "peach") {
      recs.push("Peach-toned foundations with warm-pink balance will complement your skin. Avoid pure yellow bases.");
    } else if (undertone === "red") {
      recs.push("Foundations with warm-red undertones (marked 'R') will prevent ashy appearance. Copper and bronze highlights work well.");
    } else {
      recs.push("Earth-toned foundations with golden or peach undertones will complement your skin beautifully.");
    }
    recs.push("Gold jewelry and warm-toned blush shades will enhance your natural glow.");
  } else if (category === "cool") {
    recs.push("Look for foundations with pink or blue undertones (marked 'N' or 'C') for the best match.");
    recs.push("Silver jewelry and berry-toned lip colors will complement your complexion.");
  } else if (category === "olive") {
    recs.push("Olive skin needs green-balanced bases — most foundations pull orange or pink on you. Look for brands like Koh Gen Do or Giorgio Armani.");
    recs.push("Earthy greens, warm golds, and muted corals look stunning on olive undertones.");
  } else {
    recs.push("You're lucky — most foundation shades marked 'N' (neutral) will work well for you.");
    recs.push("Both gold and silver jewelry look great on neutral undertones.");
  }

  // Depth recs
  if (depth === "very-light" || depth === "light") {
    recs.push("Use SPF 50+ daily — lighter skin is significantly more prone to UV damage and premature aging.");
  } else if (depth === "tan" || depth === "deep" || depth === "deep-rich" || depth === "very-deep" || depth === "tan-deep") {
    recs.push("Watch for ashy casts in products — always test in natural light before purchasing. Avoid titanium dioxide-heavy formulas.");
  }

  if (texture === "rough" || texture === "combination") {
    recs.push("Incorporate gentle exfoliation 2-3 times per week (AHA/BHA) to refine skin texture.");
  } else {
    recs.push("Maintain your smooth texture with a consistent hydration routine and gentle cleanser.");
  }

  if (hydration === "dehydrated") {
    recs.push("Boost hydration with hyaluronic acid serums and drink more water throughout the day.");
  }

  if (wrinkleLevel === "moderate") {
    recs.push("Incorporate retinol (start at 0.25%) and peptide serums to reduce fine lines.");
  } else if (wrinkleLevel === "prominent") {
    recs.push("Consider professional treatments like micro-needling or retinoid therapy for deeper wrinkles.");
    recs.push("Use a rich night cream with retinol, peptides, and niacinamide for overnight repair.");
  } else if (wrinkleLevel === "mild") {
    recs.push("Preventive care: daily SPF and antioxidant serums (vitamin C) will keep fine lines at bay.");
  }

  return recs;
}

export function getImageDataFromCanvas(canvas: HTMLCanvasElement): ImageData | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
