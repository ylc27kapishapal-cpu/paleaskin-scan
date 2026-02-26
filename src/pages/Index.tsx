import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScanFace, Sparkles, Droplets } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-[0.3em] text-foreground">
              P<span className="text-primary">\</span>L
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-wider text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#industry" className="hover:text-foreground transition-colors">The Problem</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <Link
              to="/scan"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm tracking-wider hover:opacity-90 transition-opacity"
            >
              Start Scan
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
          <div className="absolute inset-0 bg-foreground/20" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground tracking-wide mb-2">
              P<span className="opacity-60 mx-1">\</span>L
            </h1>
            <div className="w-24 h-px bg-accent mx-auto my-6" />
            <p className="font-display text-xl md:text-2xl tracking-[0.35em] text-primary-foreground/90 uppercase mb-8">
              Paléa Labs
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-lg md:text-xl text-primary-foreground/80 italic mb-12 leading-relaxed"
          >
            Discover your skin's true story. Advanced AI-powered analysis
            reveals your unique undertone and texture profile.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to="/scan"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-all hover:scale-105"
            >
              <ScanFace className="w-5 h-5" />
              Analyze My Skin
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
              How It Works
            </h2>
            <div className="w-16 h-px bg-primary mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: ScanFace,
                title: "Scan Your Face",
                desc: "Use your device's camera to capture a clear photo of your face in natural lighting.",
              },
              {
                icon: Sparkles,
                title: "AI Analysis",
                desc: "Our algorithm analyzes thousands of data points to determine your skin's undertone and texture.",
              },
              {
                icon: Droplets,
                title: "Get Results",
                desc: "Receive a detailed profile with personalized skincare and color recommendations.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-card rounded-2xl p-8 text-center border border-border/50 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Wrong With the Industry */}
      <section id="industry" className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
              What's Wrong With the Industry
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6" />
            <p className="font-serif text-lg text-muted-foreground italic leading-relaxed max-w-2xl mx-auto">
              India's beauty challenges aren't personal — they're environmental, dermatological, and formulation-based realities backed by science.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: "Tropical Climate vs. Makeup Longevity",
                desc: "With summer temperatures above 35°C and humidity exceeding 70–80%, increased sebaceous gland activity breaks down foundation films, causes separation, and reduces wear time.",
                source: "Journal of Dermatological Science",
              },
              {
                title: "Foundation Oxidation",
                desc: "Iron oxides, oils, and environmental oxygen react together — accelerated by sebum and heat — causing foundations to darken or shift undertone after application.",
                source: "International Journal of Cosmetic Science",
              },
              {
                title: "Undertone Diversity Ignored",
                desc: "India is one of the most genetically diverse populations globally. Western shade systems fail to account for olive and golden undertones common in South Asian skin, leading to ashiness.",
                source: "Journal of Investigative Dermatology",
              },
              {
                title: "Heat, Sebum & Concealer Creasing",
                desc: "Increased temperature affects transepidermal water loss (TEWL), impacting product adherence. Cream concealers migrate and crease without proper climate-aware formulation.",
                source: "British Journal of Dermatology",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <h3 className="font-display text-lg text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                <p className="font-body text-xs text-primary/70 italic">Source: {item.source}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center"
          >
            <h3 className="font-display text-xl text-foreground mb-4">The Industry Gap</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Most foundations sold in India are formulated for temperate Western climates — creating a mismatch between product design and real-world conditions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                "Heat-stable pigments",
                "Sebum-resistant formulas",
                "Oxidation control",
                "Undertone-calibrated shades",
                "Barrier-supportive ingredients",
                "Climate-intelligent design",
              ].map((tag) => (
                <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full font-body text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 md:py-32 bg-gradient-warm">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6">
              The Science of <span className="italic">You</span>
            </h2>
            <p className="font-serif text-lg text-muted-foreground leading-relaxed mb-4">
              Paléa Labs combines advanced color science with skin analysis technology to give you
              a deeper understanding of your unique complexion. Know your undertone, understand your
              texture, and unlock the products and colors that truly work for you.
            </p>
            <p className="font-body text-sm text-muted-foreground">
              No guessing. No filters. Just your skin, understood.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="font-display text-lg tracking-[0.3em] text-foreground mb-2">
            PALÉA LABS
          </p>
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            © 2026 Paléa Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
