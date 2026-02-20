import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Camera, RotateCcw, ArrowLeft } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { analyzeSkin, getImageDataFromCanvas, type SkinAnalysisResult } from "@/lib/skinAnalysis";

const ScanPage = () => {
  const { videoRef, canvasRef, isStreaming, error, startCamera, stopCamera, capturePhoto } = useCamera();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleCapture = useCallback(() => {
    const photo = capturePhoto();
    if (photo) {
      setCapturedImage(photo);
      stopCamera();
    }
  }, [capturePhoto, stopCamera]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleAnalyze = useCallback(() => {
    if (!canvasRef.current) return;
    setAnalyzing(true);

    setTimeout(() => {
      const imageData = getImageDataFromCanvas(canvasRef.current!);
      if (imageData) {
        const result = analyzeSkin(imageData);
        navigate("/results", { state: { result, image: capturedImage } });
      }
      setAnalyzing(false);
    }, 2000); // Simulate processing time
  }, [canvasRef, capturedImage, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-glass border-b border-border/50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm tracking-wider">Back</span>
          </Link>
          <span className="font-display text-lg tracking-[0.3em] text-foreground">
            P<span className="text-primary">\</span>L
          </span>
          <div className="w-16" />
        </div>
      </header>

      {/* Scanner */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">Skin Scanner</h1>
          <p className="font-body text-sm text-muted-foreground">
            Position your face in natural light for the most accurate results.
          </p>
        </motion.div>

        <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden bg-card border border-border shadow-xl">
          {/* Video feed */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${capturedImage ? "hidden" : ""}`}
            playsInline
            muted
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Captured preview */}
          {capturedImage && (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
          )}

          {/* Scan overlay */}
          {isStreaming && !capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-72 md:w-64 md:h-80 rounded-[50%] border-2 border-primary/40 animate-pulse-ring" />
            </div>
          )}

          {/* Empty state */}
          {!isStreaming && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/50">
              <Camera className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="font-body text-sm text-muted-foreground mb-6">Camera not started</p>
              <button
                onClick={startCamera}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-sm tracking-wider hover:opacity-90 transition-opacity"
              >
                Enable Camera
              </button>
              {error && (
                <p className="mt-4 text-destructive font-body text-xs px-6 text-center">{error}</p>
              )}
            </div>
          )}

          {/* Analyzing overlay */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mb-4" />
                <p className="font-display text-lg text-primary-foreground tracking-wider">Analyzing...</p>
                <p className="font-body text-xs text-primary-foreground/70 mt-1">Reading your skin profile</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Controls */}
        <div className="mt-8 flex gap-4">
          {isStreaming && !capturedImage && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCapture}
              className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-body text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-all hover:scale-105"
            >
              Capture
            </motion.button>
          )}

          {capturedImage && !analyzing && (
            <>
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-body text-sm tracking-wider hover:opacity-80 transition-opacity"
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </button>
              <button
                onClick={handleAnalyze}
                className="bg-primary text-primary-foreground px-10 py-3 rounded-full font-body text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-all hover:scale-105"
              >
                Analyze Skin
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScanPage;
