import { motion } from "framer-motion";
import { Link, useLocation, Navigate } from "react-router-dom";
import { ArrowLeft, ScanFace, Droplets, Layers, Palette, ChevronRight, Crown, Sun, Gem, FlaskConical, Star, Sparkles } from "lucide-react";
import type { SkinAnalysisResult, Rating } from "@/lib/skinAnalysis";

const ratingColors: Record<Rating, string> = {
  Excellent: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Good: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Better: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Bad: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Worst: "bg-red-500/15 text-red-400 border-red-500/30",
};

const undertoneColors: Record<string, string> = {
  warm: "bg-amber-100 text-amber-800",
  cool: "bg-blue-100 text-blue-800",
  neutral: "bg-stone-100 text-stone-700",
  olive: "bg-lime-100 text-lime-800",
};

function ScoreBadge({ score, rating }: { score: number; rating: Rating }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${ratingColors[rating]}`}>
        {rating}
      </span>
      <span className="font-display text-2xl text-foreground">{score}</span>
      <span className="text-muted-foreground text-xs">/10</span>
    </div>
  );
}

function ScoreBar({ score, delay }: { score: number; delay: number }) {
  return (
    <div className="w-full bg-secondary rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score * 10}%` }}
        transition={{ delay, duration: 1 }}
        className="bg-primary h-2 rounded-full"
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0">
      <span className="font-body text-xs text-muted-foreground">{label}</span>
      <span className="font-body text-xs text-foreground font-medium">{value}</span>
    </div>
  );
}

const ResultsPage = () => {
  const location = useLocation();
  const state = location.state as { result: SkinAnalysisResult; image: string } | null;

  if (!state) return <Navigate to="/scan" replace />;

  const { result, image } = state;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-glass border-b border-border/50 px-6 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/scan" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm tracking-wider">New Scan</span>
          </Link>
          <span className="font-display text-lg tracking-[0.3em] text-foreground">
            P<span className="text-primary">\</span>L
          </span>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">Your Skin Profile</h1>
          <p className="font-body text-sm text-muted-foreground">Comprehensive analysis by Paléa Labs</p>
        </motion.div>

        {/* Photo + Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-10"
        >
          {image && (
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg mb-4">
              <img src={image} alt="Your scan" className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
            </div>
          )}
          <div className="text-center">
            <p className="font-body text-xs text-muted-foreground mb-1 uppercase tracking-widest">Overall Score</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display text-5xl text-foreground">{result.overallScore.score}</span>
              <span className="text-muted-foreground text-lg">/10</span>
            </div>
            <span className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-bold border ${ratingColors[result.overallScore.rating]}`}>
              {result.overallScore.rating}
            </span>
          </div>
        </motion.div>

        {/* Shade Code Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-4 text-center"
        >
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-1">Your Shade Code</p>
          <p className="font-display text-2xl text-foreground tracking-wider">{result.shadeCode.code}</p>
          <p className="font-body text-sm text-primary mt-1">{result.shadeCode.label}</p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-4">
          {/* Depth Classification */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Sun className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-foreground">Skin Depth</h3>
                <p className="font-body text-xs text-muted-foreground">Level 1 — Depth Classification</p>
              </div>
              <ScoreBadge score={result.depthScore.score} rating={result.depthScore.rating} />
            </div>
            <div className="mb-3">
              <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground font-body text-sm font-medium capitalize">
                {result.depth.replace("-", " ")}
              </span>
            </div>
            <ScoreBar score={result.depthScore.score} delay={0.4} />
            <div className="mt-4 space-y-0">
              <InfoRow label="Visual Description" value={result.depthLabel} />
              <InfoRow label="Common Concerns" value={result.depthConcerns} />
              <InfoRow label="Foundation Note" value={result.foundationNote} />
            </div>
          </motion.div>

          {/* Undertone Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-foreground">Undertone Analysis</h3>
                <p className="font-body text-xs text-muted-foreground">Level 2 — Most important for foundation</p>
              </div>
              <ScoreBadge score={result.undertoneScore.score} rating={result.undertoneScore.rating} />
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className={`px-4 py-1.5 rounded-full font-body text-sm font-medium capitalize ${undertoneColors[result.undertone]}`}>
                {result.undertone}
              </span>
              <span className="font-body text-xs text-muted-foreground">{result.undertoneConfidence}% confidence</span>
            </div>
            <ScoreBar score={result.undertoneScore.score} delay={0.6} />
            <div className="mt-4 space-y-0">
              <InfoRow label="Vein Color" value={result.veinColor} />
              <InfoRow label="Jewelry Preference" value={result.jewelryPreference} />
              <InfoRow label="Sun Reaction" value={result.sunReaction} />
              <InfoRow label="Foundation Base" value={result.foundationBase} />
              <InfoRow label="Dominant Hue" value={result.dominantHue} />
            </div>
          </motion.div>

          {/* Texture */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-foreground">Skin Texture</h3>
                <p className="font-body text-xs text-muted-foreground">Surface analysis</p>
              </div>
              <ScoreBadge score={result.textureScore.score} rating={result.textureScore.rating} />
            </div>
            <div className="mb-3">
              <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground font-body text-sm font-medium capitalize">
                {result.texture}
              </span>
            </div>
            <ScoreBar score={result.textureScore.score} delay={0.8} />
          </motion.div>

          {/* Hydration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-foreground">Hydration Level</h3>
                <p className="font-body text-xs text-muted-foreground">Moisture estimation</p>
              </div>
              <ScoreBadge score={result.hydrationScore.score} rating={result.hydrationScore.rating} />
            </div>
            <div className="mb-3">
              <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground font-body text-sm font-medium capitalize">
                {result.hydration}
              </span>
            </div>
            <ScoreBar score={result.hydrationScore.score} delay={1.0} />
          </motion.div>

          {/* Wrinkle Detection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-foreground">Wrinkle Detection</h3>
                <p className="font-body text-xs text-muted-foreground">Fine lines & crease analysis</p>
              </div>
              <ScoreBadge score={result.wrinkleScore.score} rating={result.wrinkleScore.rating} />
            </div>
            <div className="mb-3">
              <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground font-body text-sm font-medium capitalize">
                {result.wrinkleLevel}
              </span>
            </div>
            <ScoreBar score={result.wrinkleScore.score} delay={1.1} />
            <p className="font-body text-xs text-muted-foreground mt-4 leading-relaxed">{result.wrinkleDetails}</p>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground">Personalized Recommendations</h3>
            </div>
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{rec}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-sm tracking-wider hover:opacity-90 transition-opacity"
          >
            <ScanFace className="w-4 h-4" />
            Scan Again
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default ResultsPage;
