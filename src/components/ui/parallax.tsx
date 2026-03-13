import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── ScrollReveal ─── */
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const ScrollReveal = ({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
}: ScrollRevealProps) => {
  const offsets = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ─── ParallaxLayer ─── */
interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // -1 to 1: negative = slower, positive = faster
  direction?: "vertical" | "horizontal";
}

export const ParallaxLayer = ({
  children,
  className,
  speed = 0.5,
  direction = "vertical",
}: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = speed * 100;
  const transform = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const smoothTransform = useSpring(transform, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        style={direction === "vertical" ? { y: smoothTransform } : { x: smoothTransform }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ─── DepthLayers ─── */
interface DepthLayersProps {
  children: React.ReactNode;
  className?: string;
  foreground?: React.ReactNode;
  background?: React.ReactNode;
}

export const DepthLayers = ({ children, className, foreground, background }: DepthLayersProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const fgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const midY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {background && (
        <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
          {background}
        </motion.div>
      )}
      <motion.div className="relative z-10" style={{ y: midY }}>
        {children}
      </motion.div>
      {foreground && (
        <motion.div className="absolute inset-0 z-20 pointer-events-none" style={{ y: fgY }}>
          {foreground}
        </motion.div>
      )}
    </div>
  );
};

/* ─── SectionTransition (shape morph divider) ─── */
interface SectionTransitionProps {
  className?: string;
  variant?: "wave" | "curve" | "slant" | "blob";
  flip?: boolean;
}

export const SectionTransition = ({ className, variant = "wave", flip = false }: SectionTransitionProps) => {
  const paths: Record<string, string> = {
    wave: "M0,64 C320,120 640,0 960,64 C1280,128 1600,0 1920,64 L1920,0 L0,0 Z",
    curve: "M0,96 Q960,0 1920,96 L1920,0 L0,0 Z",
    slant: "M0,0 L1920,96 L1920,0 L0,0 Z",
    blob: "M0,64 C200,120 400,20 600,80 C800,140 1000,30 1200,70 C1400,110 1600,20 1920,64 L1920,0 L0,0 Z",
  };

  return (
    <div className={cn("relative w-full overflow-hidden", flip && "rotate-180", className)} style={{ height: "80px", marginTop: "-1px" }}>
      <svg
        viewBox="0 0 1920 128"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <motion.path
          d={paths[variant]}
          fill="hsl(var(--background))"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </svg>
    </div>
  );
};

/* ─── StickyScrollIndicator ─── */
interface StickyScrollIndicatorProps {
  sections: { id: string; label: string }[];
  className?: string;
}

export const StickyScrollIndicator = ({ sections, className }: StickyScrollIndicatorProps) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className={cn(
        "fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3 items-end",
        className
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      {sections.map((s, i) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="group flex items-center gap-2 cursor-pointer"
        >
          <motion.span
            className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            initial={false}
            animate={active === i ? { opacity: 1 } : {}}
          >
            {s.label}
          </motion.span>
          <motion.div
            className={cn(
              "rounded-full transition-all duration-300",
              active === i
                ? "w-3 h-3 bg-primary shadow-glow"
                : "w-2 h-2 bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
            )}
            layout
          />
        </button>
      ))}
    </motion.nav>
  );
};

/* ─── BackToTop ─── */
export const BackToTop = () => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setVisible(v > 0.15));
    return unsub;
  }, [scrollYProgress]);

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-primary flex items-center justify-center cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
      </svg>
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="none" stroke="hsl(var(--primary-foreground) / 0.2)" strokeWidth="2" />
        <motion.circle
          cx="24" cy="24" r="22" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={138}
          style={{ strokeDashoffset: useTransform(scrollYProgress, [0, 1], [138, 0]) }}
        />
      </svg>
    </motion.button>
  );
};

/* ─── ParallaxParticles ─── */
interface ParallaxParticlesProps {
  count?: number;
  className?: string;
}

export const ParallaxParticles = ({ count = 20, className }: ParallaxParticlesProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: (Math.random() - 0.5) * 2,
        delay: Math.random() * 5,
        duration: Math.random() * 8 + 6,
      })),
    [count]
  );

  return (
    <div ref={ref} className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {particles.map((p, i) => {
        const y = useTransform(scrollYProgress, [0, 1], [p.speed * 80, -p.speed * 80]);
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              y,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};
