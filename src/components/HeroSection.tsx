import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Smartphone, ArrowDown, Sparkles, Check } from "lucide-react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";

// Particle system
const Particle = ({ index }: { index: number }) => {
  const style = useMemo(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 4 + 1}px`,
    height: `${Math.random() * 4 + 1}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 8}s`,
  }), []);

  return (
    <motion.div
      className="absolute rounded-full bg-primary/30"
      style={style}
      animate={{
        y: [0, -80, 0],
        x: [0, Math.random() * 40 - 20, 0],
        opacity: [0, 0.8, 0],
        scale: [0, 1.2, 0],
      }}
      transition={{
        duration: parseFloat(style.animationDuration),
        repeat: Infinity,
        delay: parseFloat(style.animationDelay),
        ease: "easeInOut",
      }}
    />
  );
};

const SUBHEADLINES = [
  "Submit your e-waste, earn rewards",
  "Build a circular economy together",
  "Reduce, recycle, get rewarded",
  "Turn trash into treasure today",
];

const FloatingShape = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full ${className}`}
    animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
    transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [subIndex, setSubIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ctaState, setCtaState] = useState<"idle" | "success">("idle");

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.8]);

  // 3D tilt on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setTilt({ x: y, y: x });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  // Typewriter effect
  useEffect(() => {
    const current = SUBHEADLINES[subIndex];
    const speed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === current.length) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }
    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setSubIndex((prev) => (prev + 1) % SUBHEADLINES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, subIndex]);

  // CTA click handler
  const handleCtaClick = () => {
    setCtaState("success");
    setTimeout(() => {
      navigate("/submit-gadget");
      setCtaState("idle");
    }, 800);
  };

  const scrollToNext = () => {
    const next = sectionRef.current?.nextElementSibling;
    next?.scrollIntoView({ behavior: "smooth" });
  };

  // Headline stagger variants
  const headlineWords = "Turn Your Old Gadgets Into Rewards".split(" ");
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
  };
  const wordVariant = {
    hidden: { opacity: 0, y: 40, rotateX: -40 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } },
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
        <div className="absolute inset-0 bg-gradient-radial" />
        {/* Circuit pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10h80v80H10z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <circle cx="90" cy="90" r="2" fill="currentColor" />
              <path d="M50 10v30M10 50h30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-circuit)" />
        </svg>
      </motion.div>

      {/* Color-shifting gradient overlay */}
      <motion.div
        className="absolute inset-0 z-[1] bg-gradient-hero animate-gradient-shift opacity-20"
        style={{ opacity: overlayOpacity }}
      />

      {/* Particles */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* Floating shapes */}
      <FloatingShape className="w-64 h-64 -top-20 -left-20 bg-primary/5 blur-3xl" delay={0} />
      <FloatingShape className="w-48 h-48 top-1/4 -right-10 bg-accent/5 blur-2xl" delay={2} />
      <FloatingShape className="w-32 h-32 bottom-20 left-1/4 bg-primary/8 blur-xl" delay={4} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-primary/10 rotate-45 animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/3 left-1/3 w-10 h-10 rounded-full border border-accent/10 animate-[float_8s_ease-in-out_infinite_1s]" />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10 pt-24 pb-20">
        {/* Glass card with 3D tilt */}
        <motion.div
          ref={cardRef}
          className="max-w-4xl mx-auto glass-lg rounded-3xl p-8 md:p-14 glass-border-gradient"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.15s ease-out",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Sustainable E-Waste Management</span>
          </motion.div>

          {/* Staggered headline */}
          <motion.h1
            className="mb-6 leading-tight text-center md:text-left"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariant}
                className={`inline-block mr-[0.3em] ${word === "Gadgets" ? "text-gradient-primary" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Typewriter subheadline */}
          <motion.div
            className="text-lg md:text-xl text-muted-foreground mb-10 h-8 text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span>{SUBHEADLINES[subIndex].slice(0, charIndex)}</span>
            <span className="inline-block w-[2px] h-5 bg-primary ml-0.5 align-middle animate-[pulse_1s_infinite]" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Button
              size="lg"
              className="group relative bg-gradient-primary hover:opacity-90 text-lg h-14 px-8 shadow-primary overflow-hidden"
              onClick={handleCtaClick}
            >
              {/* Ripple */}
              <span className="absolute inset-0 bg-foreground/10 scale-0 rounded-full group-active:scale-[3] transition-transform duration-500" />
              <AnimatePresence mode="wait">
                {ctaState === "idle" ? (
                  <motion.span
                    key="idle"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <Smartphone className="w-5 h-5" />
                    Submit Gadget
                  </motion.span>
                ) : (
                  <motion.span
                    key="success"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Check className="w-5 h-5" />
                    Let's Go!
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg h-14 px-8 glass glass-hover border-primary/20"
              onClick={() => navigate("/awareness")}
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        {/* Mouse icon */}
        <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
