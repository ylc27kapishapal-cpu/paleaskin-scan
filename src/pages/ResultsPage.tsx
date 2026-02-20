import { motion } from "framer-motion";
import { Link, useLocation, Navigate } from "react-router-dom";
import { ArrowLeft, ScanFace, Droplets, Layers, Palette, ChevronRight } from "lucide-react";
import type { SkinAnalysisResult } from "@/lib/skinAnalysis";

const ResultsPage = () => {
  const location = useLocation();
  const state = location.state as { result: SkinAnalysisResult; image: string } | null;

  if (!state) return <Navigate to="/scan" replace />;

  const { result, image } = state;

  const undertoneColors: Record<string, string> = {
    warm: "bg-amber-100 text-amber-800",
    cool: "bg-blue-100 text-blue-800",
    neutral: "bg-stone-100 text-stone-700",
  };

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
          <p className="font-body text-sm text-muted-foreground">Personalized analysis by Paléa Labs</p>
        </motion.div>

        {/* Photo */}
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-10 border-4 border-primary/20 shadow-lg"
          >
            <img src={image} alt="Your scan" className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
          </motion.div>
        )}

        {/* Cards */}
        <div className="space-y-4">
          {/* Undertone */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Skin Undertone</h3>
                <p className="font-body text-xs text-muted-foreground">Color analysis</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-4 py-1.5 rounded-full font-body text-sm font-medium capitalize ${undertoneColors[result.undertone]}`}>
                {result.undertone}
              </span>
              <span className="font-body text-sm text-muted-foreground">{result.undertoneConfidence}% confidence</span>
            </div>
            <div className="mt-3 w-full bg-secondary rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.undertoneConfidence}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
            <p className="mt-3 font-body text-xs text-muted-foreground">
              Dominant hue: <span className="text-foreground font-medium">{result.dominantHue}</span>
            </p>
          </motion.div>

          {/* Texture */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Skin Texture</h3>
                <p className="font-body text-xs text-muted-foreground">Surface analysis</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground font-body text-sm font-medium capitalize">
                {result.texture}
              </span>
              <span className="font-body text-sm text-muted-foreground">Score: {result.textureScore}/100</span>
            </div>
            <div className="mt-3 w-full bg-secondary rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.textureScore}%` }}
                transition={{ delay: 0.7, duration: 1 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
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
              <div>
                <h3 className="font-display text-lg text-foreground">Hydration Level</h3>
                <p className="font-body text-xs text-muted-foreground">Moisture estimation</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground font-body text-sm font-medium capitalize">
                {result.hydration}
              </span>
              <span className="font-body text-sm text-muted-foreground">Score: {result.hydrationScore}/100</span>
            </div>
            <div className="mt-3 w-full bg-secondary rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.hydrationScore}%` }}
                transition={{ delay: 0.9, duration: 1 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <h3 className="font-display text-lg text-foreground mb-4">Personalized Recommendations</h3>
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
