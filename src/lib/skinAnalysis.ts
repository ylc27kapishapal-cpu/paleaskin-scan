export interface SkinAnalysisResult {
  undertone: "warm" | "cool" | "neutral";
  undertoneConfidence: number;
  texture: "smooth" | "normal" | "rough" | "combination";
  textureScore: number;
  hydration: "well-hydrated" | "normal" | "dehydrated";
  hydrationScore: number;
  dominantHue: string;
  recommendations: string[];
}

export function analyzeSkin(imageData: ImageData): SkinAnalysisResult {
  const { data, width, height } = imageData;

  // Sample center region (face area)
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

      // Skip very dark or very bright pixels
      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 240) continue;

      totalR += r;
      totalG += g;
      totalB += b;
      samples++;

      // Texture: check local variance with neighbor
      if (px + 2 < width) {
        const ni = (py * width + (px + 2)) * 4;
        const nr = data[ni], ng = data[ni + 1], nb = data[ni + 2];
        const diff = Math.abs(r - nr) + Math.abs(g - ng) + Math.abs(b - nb);
        variances.push(diff);
      }
    }
  }

  if (samples === 0) {
    return {
      undertone: "neutral",
      undertoneConfidence: 50,
      texture: "normal",
      textureScore: 50,
      hydration: "normal",
      hydrationScore: 50,
      dominantHue: "N/A",
      recommendations: ["Try taking the photo in better lighting."],
    };
  }

  const avgR = totalR / samples;
  const avgG = totalG / samples;
  const avgB = totalB / samples;

  // Undertone analysis
  const warmScore = (avgR - avgB) / 255;
  const greenBalance = (avgG - (avgR + avgB) / 2) / 255;

  let undertone: "warm" | "cool" | "neutral";
  let undertoneConfidence: number;

  if (warmScore > 0.08) {
    undertone = "warm";
    undertoneConfidence = Math.min(95, 60 + warmScore * 200);
  } else if (warmScore < -0.03) {
    undertone = "cool";
    undertoneConfidence = Math.min(95, 60 + Math.abs(warmScore) * 200);
  } else {
    undertone = "neutral";
    undertoneConfidence = Math.min(90, 55 + (1 - Math.abs(warmScore) * 10) * 30);
  }

  // Texture analysis from variance
  const avgVariance = variances.length > 0
    ? variances.reduce((a, b) => a + b, 0) / variances.length
    : 15;

  let texture: "smooth" | "normal" | "rough" | "combination";
  let textureScore: number;

  if (avgVariance < 8) {
    texture = "smooth";
    textureScore = 90;
  } else if (avgVariance < 18) {
    texture = "normal";
    textureScore = 70;
  } else if (avgVariance < 30) {
    texture = "combination";
    textureScore = 55;
  } else {
    texture = "rough";
    textureScore = 35;
  }

  // Hydration estimation based on color saturation
  const maxC = Math.max(avgR, avgG, avgB);
  const minC = Math.min(avgR, avgG, avgB);
  const saturation = maxC > 0 ? (maxC - minC) / maxC : 0;

  let hydration: "well-hydrated" | "normal" | "dehydrated";
  let hydrationScore: number;

  if (saturation > 0.15) {
    hydration = "well-hydrated";
    hydrationScore = 80;
  } else if (saturation > 0.08) {
    hydration = "normal";
    hydrationScore = 60;
  } else {
    hydration = "dehydrated";
    hydrationScore = 35;
  }

  // Dominant hue
  const hue = rgbToHueName(avgR, avgG, avgB);

  // Recommendations
  const recommendations = getRecommendations(undertone, texture, hydration);

  return {
    undertone,
    undertoneConfidence: Math.round(undertoneConfidence),
    texture,
    textureScore: Math.round(textureScore),
    hydration,
    hydrationScore: Math.round(hydrationScore),
    dominantHue: hue,
    recommendations,
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

function getRecommendations(
  undertone: string,
  texture: string,
  hydration: string
): string[] {
  const recs: string[] = [];

  if (undertone === "warm") {
    recs.push("Earth-toned foundations with golden or peach undertones will complement your skin beautifully.");
    recs.push("Gold jewelry and warm-toned blush shades will enhance your natural glow.");
  } else if (undertone === "cool") {
    recs.push("Look for foundations with pink or blue undertones for the best match.");
    recs.push("Silver jewelry and berry-toned lip colors will complement your complexion.");
  } else {
    recs.push("You're lucky — most foundation shades work well with neutral undertones.");
    recs.push("Both gold and silver jewelry will look great on you.");
  }

  if (texture === "rough" || texture === "combination") {
    recs.push("Incorporate gentle exfoliation 2-3 times per week to refine skin texture.");
  } else {
    recs.push("Maintain your smooth texture with a consistent hydration routine.");
  }

  if (hydration === "dehydrated") {
    recs.push("Boost hydration with hyaluronic acid serums and drink more water throughout the day.");
  }

  return recs;
}

export function getImageDataFromCanvas(
  canvas: HTMLCanvasElement
): ImageData | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
