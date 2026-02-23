// === TYPES ===

export type SkinDepth = "very-light" | "light" | "light-medium" | "medium" | "tan" | "deep" | "very-deep";
export type Undertone = "warm" | "cool" | "neutral" | "olive";
export type TextureType = "smooth" | "normal" | "rough" | "combination";
export type HydrationLevel = "well-hydrated" | "normal" | "dehydrated";
export type WrinkleLevel = "minimal" | "mild" | "moderate" | "prominent";
export type Rating = "Worst" | "Bad" | "Better" | "Good" | "Excellent";

export interface ShadeCode {
  code: string;
  label: string;
}

export interface ScoreWithRating {
  score: number;       // 1-10
  rating: Rating;
}

export interface SkinAnalysisResult {
  // Depth (Level 1)
  depth: SkinDepth;
  depthLabel: string;
  depthConcerns: string;
  foundationNote: string;

  // Undertone (Level 2)
  undertone: Undertone;
  undertoneConfidence: number;
  veinColor: string;
  jewelryPreference: string;
  sunReaction: string;
  foundationBase: string;

  // Shade Matrix (Level 3)
  shadeCode: ShadeCode;

  // Texture, Hydration & Wrinkles
  texture: TextureType;
  hydration: HydrationLevel;
  wrinkleLevel: WrinkleLevel;
  wrinkleDetails: string;

  // Scores (1-10 with remarks)
  overallScore: ScoreWithRating;
  textureScore: ScoreWithRating;
  hydrationScore: ScoreWithRating;
  undertoneScore: ScoreWithRating;
  depthScore: ScoreWithRating;
  wrinkleScore: ScoreWithRating;

  dominantHue: string;
  recommendations: string[];
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

// === DEPTH CLASSIFICATION ===

interface DepthInfo {
  depth: SkinDepth;
  label: string;
  concerns: string;
  foundationNote: string;
}

function classifyDepth(brightness: number): DepthInfo {
  if (brightness > 210) return { depth: "very-light", label: "Porcelain / Ivory", concerns: "Redness, pink patches", foundationNote: "Avoid overly pink bases" };
  if (brightness > 185) return { depth: "light", label: "Fair beige", concerns: "Oxidation issues", foundationNote: "Neutral undertones sell best" };
  if (brightness > 160) return { depth: "light-medium", label: "Wheatish light", concerns: "Looks grey in wrong shade", foundationNote: "Balance yellow & peach" };
  if (brightness > 135) return { depth: "medium", label: "Golden beige", concerns: "Turns orange easily", foundationNote: "Undertone precision critical" };
  if (brightness > 105) return { depth: "tan", label: "Warm brown", concerns: "Ashy cast common", foundationNote: "Avoid white-based pigments" };
  if (brightness > 75) return { depth: "deep", label: "Rich brown", concerns: "Red/grey mismatch", foundationNote: "Red & golden balance needed" };
  return { depth: "very-deep", label: "Espresso / cocoa", concerns: "Flashback risk", foundationNote: "Avoid high titanium dioxide" };
}

// === UNDERTONE ANALYSIS ===

interface UndertoneInfo {
  undertone: Undertone;
  confidence: number;
  veinColor: string;
  jewelryPreference: string;
  sunReaction: string;
  foundationBase: string;
}

function classifyUndertone(avgR: number, avgG: number, avgB: number): UndertoneInfo {
  const warmScore = (avgR - avgB) / 255;
  const greenCast = (avgG - (avgR + avgB) / 2) / 255;

  // Olive detection: green cast with moderate warmth
  if (greenCast > 0.03 && warmScore > 0.02 && warmScore < 0.12) {
    return {
      undertone: "olive",
      confidence: Math.min(95, 60 + greenCast * 400),
      veinColor: "Hard to detect, slightly green cast",
      jewelryPreference: "Gold looks soft",
      sunReaction: "Tans deeply",
      foundationBase: "Green-balanced yellow base",
    };
  }

  if (warmScore > 0.08) {
    return {
      undertone: "warm",
      confidence: Math.min(95, 60 + warmScore * 200),
      veinColor: "Greenish veins",
      jewelryPreference: "Gold suits better",
      sunReaction: "Tans easily",
      foundationBase: "Yellow / Golden base",
    };
  }

  if (warmScore < -0.03) {
    return {
      undertone: "cool",
      confidence: Math.min(95, 60 + Math.abs(warmScore) * 200),
      veinColor: "Bluish veins",
      jewelryPreference: "Silver suits better",
      sunReaction: "Burns easily",
      foundationBase: "Pink / Red base",
    };
  }

  return {
    undertone: "neutral",
    confidence: Math.min(90, 55 + (1 - Math.abs(warmScore) * 10) * 30),
    veinColor: "Blue-green veins",
    jewelryPreference: "Both look good",
    sunReaction: "Mild tan",
    foundationBase: "Balanced base",
  };
}

// === SHADE MATRIX ===

function getShadeCode(depth: SkinDepth, undertone: Undertone): ShadeCode {
  const depthMap: Record<SkinDepth, [string, number]> = {
    "very-light": ["VL", 1],
    "light": ["L", 2],
    "light-medium": ["LM", 3],
    "medium": ["M", 4],
    "tan": ["T", 5],
    "deep": ["D", 6],
    "very-deep": ["VD", 7],
  };
  const undertoneMap: Record<Undertone, string> = {
    warm: "W",
    neutral: "N",
    cool: "C",
    olive: "O",
  };

  const [dCode, dNum] = depthMap[depth];
  const uCode = undertoneMap[undertone];
  const code = `${dCode}${uCode} ${dNum}.${Math.floor(Math.random() * 3)}`;
  const label = `${dCode.replace("VL", "Very Light").replace("LM", "Light-Medium").replace("VD", "Very Deep")} ${undertone.charAt(0).toUpperCase() + undertone.slice(1)}`;

  return { code, label };
}

// === MAIN ANALYSIS ===

export function analyzeSkin(imageData: ImageData): SkinAnalysisResult {
  const { data, width, height } = imageData;

  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const sampleRadius = Math.min(width, height) * 0.25;

  let totalR = 0, totalG = 0, totalB = 0;
  let samples = 0;
  let variances: number[] = [];

  for (let y = cy - sampleRadius; y < cy + sampleRadius; y += 2) {
    for (let x = cx - sampleRadius; x < cx + sampleRadius; x += 2) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > sampleRadius * sampleRadius) continue;

      const px = Math.floor(x);
      const py = Math.floor(y);
      if (px < 0 || px >= width || py < 0 || py >= height) continue;

      const i = (py * width + px) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];

      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 240) continue;

      totalR += r;
      totalG += g;
      totalB += b;
      samples++;

      if (px + 2 < width) {
        const ni = (py * width + (px + 2)) * 4;
        const nr = data[ni], ng = data[ni + 1], nb = data[ni + 2];
        const diff = Math.abs(r - nr) + Math.abs(g - ng) + Math.abs(b - nb);
        variances.push(diff);
      }
    }
  }

  if (samples === 0) {
    return getDefaultResult();
  }

  const avgR = totalR / samples;
  const avgG = totalG / samples;
  const avgB = totalB / samples;
  const avgBrightness = (avgR + avgG + avgB) / 3;

  // Level 1: Depth
  const depthInfo = classifyDepth(avgBrightness);

  // Level 2: Undertone
  const undertoneInfo = classifyUndertone(avgR, avgG, avgB);

  // Level 3: Shade
  const shadeCode = getShadeCode(depthInfo.depth, undertoneInfo.undertone);

  // Texture
  const avgVariance = variances.length > 0
    ? variances.reduce((a, b) => a + b, 0) / variances.length : 15;

  let texture: TextureType;
  let textureRaw: number;
  if (avgVariance < 8) { texture = "smooth"; textureRaw = 9; }
  else if (avgVariance < 18) { texture = "normal"; textureRaw = 7; }
  else if (avgVariance < 30) { texture = "combination"; textureRaw = 5; }
  else { texture = "rough"; textureRaw = 3; }

  // Hydration
  const maxC = Math.max(avgR, avgG, avgB);
  const minC = Math.min(avgR, avgG, avgB);
  const saturation = maxC > 0 ? (maxC - minC) / maxC : 0;

  let hydration: HydrationLevel;
  let hydrationRaw: number;
  if (saturation > 0.15) { hydration = "well-hydrated"; hydrationRaw = 8; }
  else if (saturation > 0.08) { hydration = "normal"; hydrationRaw = 6; }
  else { hydration = "dehydrated"; hydrationRaw = 3; }

  // Wrinkle detection via high-frequency edge analysis
  const edgeStrengths: number[] = [];
  for (let y = cy - sampleRadius; y < cy + sampleRadius; y += 3) {
    for (let x = cx - sampleRadius; x < cx + sampleRadius; x += 3) {
      const px = Math.floor(x), py = Math.floor(y);
      if (px < 1 || px >= width - 1 || py < 1 || py >= height - 1) continue;
      const dx2 = (x - cx), dy2 = (y - cy);
      if (dx2 * dx2 + dy2 * dy2 > sampleRadius * sampleRadius) continue;

      const i0 = (py * width + px) * 4;
      const iUp = ((py - 1) * width + px) * 4;
      const iDown = ((py + 1) * width + px) * 4;
      const iLeft = (py * width + (px - 1)) * 4;
      const iRight = (py * width + (px + 1)) * 4;

      const lum = (data[i0] + data[i0 + 1] + data[i0 + 2]) / 3;
      const lumUp = (data[iUp] + data[iUp + 1] + data[iUp + 2]) / 3;
      const lumDown = (data[iDown] + data[iDown + 1] + data[iDown + 2]) / 3;
      const lumLeft = (data[iLeft] + data[iLeft + 1] + data[iLeft + 2]) / 3;
      const lumRight = (data[iRight] + data[iRight + 1] + data[iRight + 2]) / 3;

      const gx = lumRight - lumLeft;
      const gy = lumDown - lumUp;
      const edgeMag = Math.sqrt(gx * gx + gy * gy);
      // Filter for fine lines (moderate edges, not strong object boundaries)
      if (edgeMag > 3 && edgeMag < 40) {
        edgeStrengths.push(edgeMag);
      }
    }
  }

  const avgEdge = edgeStrengths.length > 0 ? edgeStrengths.reduce((a, b) => a + b, 0) / edgeStrengths.length : 5;
  const edgeDensity = edgeStrengths.length / (samples || 1);

  let wrinkleLevel: WrinkleLevel;
  let wrinkleRaw: number;
  let wrinkleDetails: string;
  if (edgeDensity < 0.15 && avgEdge < 8) {
    wrinkleLevel = "minimal"; wrinkleRaw = 9;
    wrinkleDetails = "Very few fine lines detected. Skin appears youthful and smooth.";
  } else if (edgeDensity < 0.3 && avgEdge < 14) {
    wrinkleLevel = "mild"; wrinkleRaw = 7;
    wrinkleDetails = "Minor fine lines present, typical of healthy skin. Consider preventive care.";
  } else if (edgeDensity < 0.5 || avgEdge < 22) {
    wrinkleLevel = "moderate"; wrinkleRaw = 5;
    wrinkleDetails = "Moderate fine lines and creases detected. Retinol and peptide serums recommended.";
  } else {
    wrinkleLevel = "prominent"; wrinkleRaw = 3;
    wrinkleDetails = "Prominent lines and wrinkles observed. Consider targeted anti-aging treatments.";
  }

  const undertoneRaw = Math.round(undertoneInfo.confidence / 10);
  const depthRaw = Math.min(10, Math.max(5, Math.round(8 - Math.abs(avgBrightness - 140) / 30)));
  const overallRaw = Math.round((textureRaw + hydrationRaw + undertoneRaw + depthRaw + wrinkleRaw) / 5);

  const dominantHue = rgbToHueName(avgR, avgG, avgB);
  const recommendations = getRecommendations(undertoneInfo.undertone, texture, hydration, depthInfo.depth, wrinkleLevel);

  return {
    depth: depthInfo.depth,
    depthLabel: depthInfo.label,
    depthConcerns: depthInfo.concerns,
    foundationNote: depthInfo.foundationNote,

    undertone: undertoneInfo.undertone,
    undertoneConfidence: Math.round(undertoneInfo.confidence),
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
  };
}

// === UTILITIES ===

function getDefaultResult(): SkinAnalysisResult {
  return {
    depth: "medium", depthLabel: "N/A", depthConcerns: "N/A", foundationNote: "N/A",
    undertone: "neutral", undertoneConfidence: 50,
    veinColor: "N/A", jewelryPreference: "N/A", sunReaction: "N/A", foundationBase: "N/A",
    shadeCode: { code: "N/A", label: "N/A" },
    texture: "normal", hydration: "normal",
    wrinkleLevel: "mild", wrinkleDetails: "Unable to analyze — try better lighting.",
    overallScore: makeScore(5), textureScore: makeScore(5), hydrationScore: makeScore(5),
    undertoneScore: makeScore(5), depthScore: makeScore(5), wrinkleScore: makeScore(5),
    dominantHue: "N/A",
    recommendations: ["Try taking the photo in better lighting."],
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
  if (h < 45) return "Peach";
  if (h < 75) return "Golden";
  if (h < 150) return "Olive";
  if (h < 260) return "Blue-toned";
  return "Mauve";
}

function getRecommendations(undertone: string, texture: string, hydration: string, depth: SkinDepth, wrinkleLevel?: string): string[] {
  const recs: string[] = [];

  // Undertone recs
  if (undertone === "warm") {
    recs.push("Earth-toned foundations with golden or peach undertones will complement your skin beautifully.");
    recs.push("Gold jewelry and warm-toned blush shades will enhance your natural glow.");
  } else if (undertone === "cool") {
    recs.push("Look for foundations with pink or blue undertones for the best match.");
    recs.push("Silver jewelry and berry-toned lip colors will complement your complexion.");
  } else if (undertone === "olive") {
    recs.push("Choose green-balanced yellow-based foundations to avoid ashiness.");
    recs.push("Earthy greens, warm golds, and muted corals will look stunning on you.");
  } else {
    recs.push("You're lucky — most foundation shades work well with neutral undertones.");
    recs.push("Both gold and silver jewelry will look great on you.");
  }

  // Depth recs
  if (depth === "very-light" || depth === "light") {
    recs.push("Use SPF 50+ daily — lighter skin is more prone to UV damage.");
  } else if (depth === "tan" || depth === "deep" || depth === "very-deep") {
    recs.push("Watch for ashy casts in products — test in natural light before purchasing.");
  }

  // Texture recs
  if (texture === "rough" || texture === "combination") {
    recs.push("Incorporate gentle exfoliation 2-3 times per week to refine skin texture.");
  } else {
    recs.push("Maintain your smooth texture with a consistent hydration routine.");
  }

  // Hydration recs
  if (hydration === "dehydrated") {
    recs.push("Boost hydration with hyaluronic acid serums and drink more water throughout the day.");
  }

  // Wrinkle recs
  if (wrinkleLevel === "moderate") {
    recs.push("Incorporate retinol (start low, 0.25%) and peptide serums to reduce fine lines.");
  } else if (wrinkleLevel === "prominent") {
    recs.push("Consider professional treatments like micro-needling or retinoid therapy for deeper wrinkles.");
    recs.push("Use a rich night cream with retinol, peptides, and niacinamide for overnight repair.");
  } else if (wrinkleLevel === "mild") {
    recs.push("Preventive care: daily SPF and antioxidant serums will keep fine lines at bay.");
  }

  return recs;
}

export function getImageDataFromCanvas(canvas: HTMLCanvasElement): ImageData | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
