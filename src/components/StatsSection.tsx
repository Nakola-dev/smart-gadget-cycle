import { motion, useInView } from "framer-motion";
import { Recycle, Wind, Users, Award, Sparkles } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

interface StatConfig {
  icon: React.ElementType;
  end: number;
  label: string;
  suffix: string;
  color: string;
  detail: string;
}

const STATS: StatConfig[] = [
  { icon: Recycle, end: 125000, label: "Gadgets Recycled", suffix: "+", color: "text-primary", detail: "Phones: 45K · Laptops: 32K · Tablets: 28K · Other: 20K" },
  { icon: Wind, end: 45000, label: "CO₂ Saved (tons)", suffix: "", color: "text-accent", detail: "Equivalent to planting 2M trees" },
  { icon: Users, end: 25000, label: "Active Users", suffix: "+", color: "text-primary", detail: "Growing 15% month-over-month" },
  { icon: Award, end: 2500000, label: "Rewards Distributed", suffix: " pts", color: "text-accent", detail: "Avg 100 pts per submission" },
];

const formatNumber = (n: number): string => n.toLocaleString();

// Progress ring SVG
const ProgressRing = ({ progress, color }: { progress: number; color: string }) => {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
      <motion.circle
        cx="44" cy="44" r={r} fill="none" strokeWidth="3"
        className={color.replace("text-", "stroke-")}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] as const }}
      />
    </svg>
  );
};

const StatCard = ({ stat, index }: { stat: StatConfig; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const animRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  const animate = useCallback((timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp;
    const elapsed = timestamp - startRef.current;
    const duration = 2500;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    setCount(Math.floor(eased * stat.end));
    if (progress < 1) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      setDone(true);
    }
  }, [stat.end]);

  useEffect(() => {
    if (isInView && !paused) {
      setCount(0);
      setDone(false);
      startRef.current = null;
      animRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isInView, paused, animate]);

  const Icon = stat.icon;
  const progress = count / stat.end;

  return (
    <motion.div
      ref={ref}
      className="glass-lg rounded-2xl p-6 md:p-8 glass-border-gradient glass-hover relative group cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPaused((p) => !p)}
    >
      {/* Icon with ring */}
      <div className="relative w-20 h-20 md:w-22 md:h-22 mx-auto mb-5">
        <ProgressRing progress={progress} color={stat.color} />
        <motion.div
          className={`absolute inset-0 flex items-center justify-center ${stat.color}`}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
      </div>

      {/* Number */}
      <div className={`text-3xl md:text-4xl font-bold ${stat.color} text-center mb-1 tabular-nums`}>
        {formatNumber(count)}
        {done && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {stat.suffix}
          </motion.span>
        )}
      </div>

      <p className="text-muted-foreground text-center text-sm">{stat.label}</p>

      {/* Sparkle on done */}
      {done && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Sparkles className={`w-5 h-5 ${stat.color}`} />
        </motion.div>
      )}

      {/* Hover detail */}
      <motion.div
        className="absolute inset-x-0 bottom-0 glass-lg rounded-b-2xl px-4 py-3 text-xs text-muted-foreground text-center"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
        transition={{ duration: 0.2 }}
      >
        {stat.detail}
      </motion.div>

      {/* Paused indicator */}
      {paused && (
        <div className="absolute top-3 left-3 text-[10px] text-muted-foreground/60 uppercase tracking-wider">
          paused
        </div>
      )}
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4">Our Impact in <span className="text-gradient-primary">Numbers</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real-time metrics powering a sustainable future. Click any card to pause.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
