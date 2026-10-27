import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScanFace, Sparkles, Droplets, AlertTriangle, Thermometer, FlaskConical, Palette, ShieldAlert, Pipette, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase
      .from("waitlist")
      .insert({ email: trimmed });
    if (insertError && insertError.code !== "23505") {
      setError("Something went wrong. Please try again in a moment.");
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    setSubmitting(false);
    setEmail("");
  };

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
            <a href="#waitlist" className="hover:text-foreground transition-colors">Waitlist</a>
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

      {/* What's Wrong With the Industry — Expanded */}
      <section id="industry" className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Backed by Science</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
              What's Wrong With the Industry
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-lg md:text-xl text-muted-foreground italic leading-relaxed max-w-3xl mx-auto text-center mb-6"
          >
            India's beauty challenges aren't personal — they're environmental, dermatological, and formulation-based realities. From high humidity to complex undertones, the Indian makeup experience is shaped by measurable factors — not just personal preference.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center mb-16"
          >
            Research from the American Academy of Dermatology, Indian Genome Variation Consortium, and the International Journal of Cosmetic Science all point to the same conclusion: products formulated for Western climates fail in Indian conditions.
          </motion.p>

          {/* Problem Cards — 6 detailed cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {[
              {
                icon: Thermometer,
                title: "Tropical Climate vs. Makeup Longevity",
                desc: "India has a predominantly tropical climate, with many cities experiencing summer temperatures above 35°C and humidity levels exceeding 70–80%. Research confirms increased heat and humidity stimulate sebaceous gland activity, leading to oilier skin that breaks down foundation films, causes separation, and drastically reduces wear time.",
                stat: "70–80%",
                statLabel: "humidity in most Indian cities",
                source: "Journal of Dermatological Science; American Academy of Dermatology",
              },
              {
                icon: FlaskConical,
                title: "The Science of Foundation Oxidation",
                desc: "Foundation oxidation occurs when pigments (especially iron oxides), oils, and environmental oxygen react together. Studies show increased sebum production and heat accelerate this reaction, causing foundations to darken by 1–3 shades or shift undertone entirely after application — turning your carefully chosen shade into the wrong colour within hours.",
                stat: "1–3",
                statLabel: "shades darker after oxidation",
                source: "International Journal of Cosmetic Science",
              },
              {
                icon: Palette,
                title: "Undertone Diversity Ignored",
                desc: "India is one of the most genetically diverse populations globally. Dermatological research shows significant variation in melanin composition and undertones — olive, golden, peach, and red undertones are common in South Asian skin. Yet Western shade systems rarely account for these, leading to ashiness, grey casts, and mismatched foundations.",
                stat: "8+",
                statLabel: "distinct undertone categories in Indian skin",
                source: "Indian Genome Variation Consortium; Journal of Investigative Dermatology",
              },
              {
                icon: ShieldAlert,
                title: "Heat, Sebum & Concealer Creasing",
                desc: "Research shows that increased temperature affects transepidermal water loss (TEWL), impacting how products adhere to skin. Cream concealers require proper setting in humid climates to prevent migration and creasing — but most formulations are designed for temperate 15–22°C environments, not India's 30–45°C reality.",
                stat: "30–45°C",
                statLabel: "daily temperatures in Indian summers",
                source: "British Journal of Dermatology",
              },
              {
                icon: Pipette,
                title: "Primer & Film-Forming Failures",
                desc: "Cosmetic science literature confirms that silicone-based and polymer-based primers improve makeup adhesion and moisture resistance. However, most primers sold in India use the same formulations as those designed for dry European winters. Gel-based, humidity-adapted primers perform significantly better but remain uncommon in the market.",
                stat: "2–3×",
                statLabel: "better adhesion with climate-adapted primers",
                source: "Cosmetics & Toiletries Science Journal",
              },
              {
                icon: AlertTriangle,
                title: "Transfer-Proof Lipstick Gap",
                desc: "Transfer-proof lipsticks use volatile solvents that evaporate, leaving pigment-binding polymers that resist smudging. In high humidity, evaporation rates change — meaning formulations optimized for 40–60% humidity fail in India's 70–90% conditions, leading to smudging, feathering, and significantly reduced longevity.",
                stat: "70–90%",
                statLabel: "humidity where most lipsticks fail",
                source: "Cosmetics & Toiletries Science Journal",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-destructive" />
                  </div>
                  <h3 className="font-display text-base text-foreground leading-tight">{item.title}</h3>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{item.desc}</p>
                <div className="bg-secondary/60 rounded-xl p-3 mb-3">
                  <span className="font-display text-2xl text-primary">{item.stat}</span>
                  <span className="font-body text-xs text-muted-foreground ml-2">{item.statLabel}</span>
                </div>
                <p className="font-body text-xs text-primary/60 italic">Source: {item.source}</p>
              </motion.div>
            ))}
          </div>

          {/* Industry Gap Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-8 md:p-10"
          >
            <div className="text-center mb-6">
              <h3 className="font-display text-2xl text-foreground mb-3">The Bigger Industry Gap</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                India's climate increases sebum and accelerates oxidation. India's genetic diversity creates complex undertone variations.
                Yet most foundations sold here are formulated for temperate Western climates — creating a fundamental mismatch between product design and real-world conditions.
              </p>
            </div>
            <div className="mb-6">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-widest text-center mb-4">What ideal foundations for India need</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                {[
                  "Heat-stable pigment systems",
                  "Sebum-resistant film formers",
                  "Oxidation-controlled formulations",
                  "Undertone-calibrated shade systems",
                  "Skin-barrier supportive ingredients",
                  "Climate-intelligent design",
                ].map((tag) => (
                  <span key={tag} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-body text-xs text-center">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="font-serif text-base text-center text-muted-foreground italic leading-relaxed max-w-2xl mx-auto">
              The opportunity lies in building climate-intelligent, undertone-accurate foundations designed specifically for Indian skin — and that's exactly what Paléa Labs is working toward.
            </p>
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

      {/* Join the Waitlist */}
      <section id="waitlist" className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Coming Soon</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
              Join the Waitlist
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6" />
            <p className="font-serif text-lg text-muted-foreground italic leading-relaxed">
              Be among the first to experience climate-intelligent, undertone-accurate beauty — designed for Indian skin.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-8 md:p-10 border border-border/50 shadow-lg"
          >
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-2">You're on the list!</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  We'll notify you as soon as Paléa Labs launches. Get ready to discover your perfect match.
                </p>
              </div>
            ) : (
              <>
                <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-4 py-3.5 rounded-full bg-secondary/60 border border-border text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-body text-sm tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60"
                  >
                    {submitting ? "Joining..." : "Join Waitlist"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
                {error && (
                  <p className="text-destructive font-body text-xs text-center mb-6">{error}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Early Access", desc: "Be first to try our AI skin analysis" },
                    { label: "Exclusive Updates", desc: "Behind-the-scenes R&D insights" },
                    { label: "Launch Pricing", desc: "Special pricing for early members" },
                  ].map((perk) => (
                    <div key={perk.label} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-body text-xs font-medium text-foreground">{perk.label}</p>
                        <p className="font-body text-xs text-muted-foreground">{perk.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
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
