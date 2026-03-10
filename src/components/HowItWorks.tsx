import { motion, useInView, AnimatePresence } from "framer-motion";
import { Smartphone, BarChart3, Gift, Globe, Check } from "lucide-react";
import { useRef, useState, useCallback } from "react";

const STEPS = [
  {
    icon: Smartphone,
    title: "Submit Your Gadget",
    shortDesc: "Upload photos & details of your device",
    backDesc: "Take clear photos of your device, describe its condition, and submit through our simple form. We accept phones, laptops, tablets, and more.",
    color: "text-primary",
    bgColor: "from-primary/20 to-primary/5",
  },
  {
    icon: BarChart3,
    title: "Get Points Value",
    shortDesc: "AI evaluates your device instantly",
    backDesc: "Our AI-powered system analyzes your device's condition, model, and market value to give you a fair and transparent points assessment within seconds.",
    color: "text-accent",
    bgColor: "from-accent/20 to-accent/5",
  },
  {
    icon: Gift,
    title: "Choose Reward",
    shortDesc: "Cash, credits, or refurbished gear",
    backDesc: "Redeem your points for cash payouts, carbon credits, discounts on refurbished devices, or donate to environmental causes. The choice is yours.",
    color: "text-primary",
    bgColor: "from-primary/20 to-primary/5",
  },
  {
    icon: Globe,
    title: "Save the Planet",
    shortDesc: "Track your environmental impact",
    backDesc: "Every device you submit prevents toxic materials from entering landfills. Track your CO₂ savings, trees equivalent, and overall environmental contribution.",
    color: "text-accent",
    bgColor: "from-accent/20 to-accent/5",
  },
];

// Particle burst on hover
const HoverParticles = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
          style={{ left: "50%", top: "50%" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(angle) * 40,
            y: Math.sin(angle) * 40,
            opacity: 0,
            scale: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      );
    })}
  </AnimatePresence>
);

// Visual wave rings
const WaveRings = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && [0, 0.15, 0.3].map((delay, i) => (
      <motion.div
        key={i}
        className="absolute inset-0 rounded-2xl border border-primary/20"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.4 + i * 0.15, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    ))}
  </AnimatePresence>
);

const StepCard = ({ step, index, activeStep, onActivate }: {
  step: typeof STEPS[0];
  index: number;
  activeStep: number;
  onActivate: (i: number) => void;
}) => {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isActive = activeStep >= index;

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.06;
    const dy = (e.clientY - cy) * 0.06;
    setMagnetOffset({ x: dx, y: dy });
  }, []);

  const Icon = step.icon;

  return (
    <motion.div
      ref={cardRef}
      className="relative flex-shrink-0 w-full sm:w-72 md:w-64 lg:w-72 perspective-[800px] cursor-pointer"
      style={{ transform: `translate(${magnetOffset.x}px, ${magnetOffset.y}px)` }}
      initial={{ opacity: 0, y: 50, rotateZ: index % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
      onMouseEnter={() => { setHovered(true); setFlipped(true); onActivate(index); }}
      onMouseLeave={() => { setHovered(false); setFlipped(false); setMagnetOffset({ x: 0, y: 0 }); }}
      onMouseMove={handleMouse}
      onClick={() => { setFlipped(!flipped); onActivate(index); }}
    >
      {/* Wave rings */}
      <WaveRings active={hovered} />

      {/* Float animation wrapper */}
      <motion.div
        animate={hovered ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="relative w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front face */}
          <div
            className="glass-lg rounded-2xl p-8 glass-border-gradient shadow-card text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Step number */}
            <div className="absolute -top-3 -left-1 glass rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-primary">
              {index + 1}
            </div>

            {/* Icon area */}
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.bgColor}`} />
              <div className="relative flex items-center justify-center h-full">
                <Icon className={`w-8 h-8 ${step.color} transition-all duration-300 ${isActive ? "fill-current opacity-100" : "opacity-70"}`} strokeWidth={isActive ? 1.5 : 2} />
              </div>
              <HoverParticles active={hovered} />
            </div>

            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.shortDesc}</p>

            {/* Completed check */}
            {isActive && activeStep > index && (
              <motion.div
                className="absolute top-3 right-3"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 glass-lg rounded-2xl p-6 glass-border-gradient shadow-glow flex flex-col items-center justify-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <Icon className={`w-10 h-10 ${step.color} mb-4`} />
            <p className="text-sm text-foreground/80 text-center leading-relaxed">{step.backDesc}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(-1);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4">How It <span className="text-gradient-primary">Works</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Four simple steps to turn your e-waste into rewards and impact
          </p>
        </motion.div>

        {/* Progress tracker */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
            {/* Active line */}
            <motion.div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-primary -translate-y-1/2"
              animate={{ width: `${Math.max(0, (activeStep / (STEPS.length - 1)) * 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            {STEPS.map((_, i) => (
              <motion.button
                key={i}
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 cursor-pointer ${
                  i <= activeStep
                    ? "bg-primary text-primary-foreground shadow-primary"
                    : "glass text-muted-foreground"
                }`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveStep(i)}
              >
                {i <= activeStep ? <Check className="w-4 h-4" /> : i + 1}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cards - horizontal scroll on desktop, vertical on mobile */}
        <div className="overflow-x-auto pb-4 md:overflow-visible">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 md:gap-6 items-stretch justify-center min-w-max sm:min-w-0 px-4 sm:px-0">
            {STEPS.map((step, i) => (
              <StepCard
                key={step.title}
                step={step}
                index={i}
                activeStep={activeStep}
                onActivate={setActiveStep}
              />
            ))}
          </div>
        </div>

        {/* Connecting lines (desktop only) */}
        <div className="hidden sm:flex justify-center mt-4 gap-4 md:gap-6">
          {Array.from({ length: STEPS.length - 1 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 max-w-[200px] h-px"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
              style={{
                background: i < activeStep
                  ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))"
                  : "hsl(var(--border))",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
