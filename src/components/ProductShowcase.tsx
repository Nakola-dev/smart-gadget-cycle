import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Smartphone, Laptop, Tablet, Headphones, Watch, Monitor } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const PRODUCTS = [
  { icon: Smartphone, name: "iPhone 14 Pro", condition: "Good", points: 4500, cash: 180, desc: "128GB, minor scratches" },
  { icon: Laptop, name: "MacBook Air M2", condition: "Excellent", points: 8200, cash: 420, desc: "256GB SSD, like new" },
  { icon: Tablet, name: "iPad Pro 11\"", condition: "Fair", points: 3200, cash: 150, desc: "64GB, screen crack" },
  { icon: Headphones, name: "AirPods Pro", condition: "Good", points: 1200, cash: 55, desc: "With case, working" },
  { icon: Watch, name: "Galaxy Watch 5", condition: "Excellent", points: 2100, cash: 95, desc: "44mm, no damage" },
  { icon: Monitor, name: "Dell 27\" 4K", condition: "Good", points: 3800, cash: 170, desc: "USB-C, minimal wear" },
];

const ProductCard = ({
  product,
  isActive,
  offset,
  showCash,
}: {
  product: typeof PRODUCTS[0];
  isActive: boolean;
  offset: number;
  showCash: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = product.icon;

  return (
    <motion.div
      className={`glass-lg rounded-2xl glass-border-gradient overflow-hidden transition-all duration-500 ${
        isActive ? "shadow-glow" : "shadow-card"
      }`}
      animate={{
        scale: isActive ? 1 : 0.88,
        rotateY: offset * 8,
        z: isActive ? 50 : 0,
        opacity: Math.abs(offset) > 1.5 ? 0.4 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      onMouseEnter={() => isActive && setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Dynamic lighting */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="p-6 md:p-8">
        {/* Icon */}
        <div className="relative w-16 h-16 mx-auto mb-5">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10" />
          <div className="relative flex items-center justify-center h-full">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Condition badge */}
        <div className="flex justify-center mb-3">
          <span className={`glass text-xs font-medium px-3 py-1 rounded-full ${
            product.condition === "Excellent" ? "text-accent" : product.condition === "Good" ? "text-primary" : "text-muted-foreground"
          }`}>
            {product.condition}
          </span>
        </div>

        <h3 className="text-lg font-bold text-center mb-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground text-center mb-5">{product.desc}</p>

        {/* Price with flip animation */}
        <div className="relative h-12 flex items-center justify-center mb-4 overflow-hidden">
          <motion.div
            className="text-center"
            key={showCash ? "cash" : "points"}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-2xl font-bold text-gradient-primary">
              {showCash ? `$${product.cash}` : `${product.points.toLocaleString()} pts`}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {showCash ? "Cash Value" : "Points Value"}
            </div>
          </motion.div>
        </div>

        {/* Quick view expansion */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Points</span>
              <span className="font-medium text-primary">{product.points.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cash</span>
              <span className="font-medium text-accent">${product.cash}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Condition</span>
              <span className="font-medium">{product.condition}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProductShowcase = () => {
  const [current, setCurrent] = useState(0);
  const [showCash, setShowCash] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  const len = PRODUCTS.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % len), [len]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + len) % len), [len]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  // Drag handler
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) next();
    else if (info.offset.x > 50) prev();
  };

  // Mouse wheel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > 20) {
        e.preventDefault();
        if (e.deltaX > 0) next();
        else prev();
      }
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [next, prev]);

  // Visible cards for different screen sizes
  const getVisibleCards = () => {
    const cards: { product: typeof PRODUCTS[0]; offset: number; idx: number }[] = [];
    for (let i = -2; i <= 2; i++) {
      const idx = (current + i + len) % len;
      cards.push({ product: PRODUCTS[idx], offset: i, idx });
    }
    return cards;
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/50" />
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4">Featured <span className="text-gradient-primary">Devices</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            See what others are trading. Browse popular submissions and their rewards.
          </p>

          {/* Points / Cash toggle */}
          <div className="inline-flex glass rounded-full p-1">
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                !showCash ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setShowCash(false)}
            >
              Points
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                showCash ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setShowCash(true)}
            >
              Cash
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex items-center justify-center gap-4 md:gap-6 py-8"
            style={{ perspective: "1200px" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {getVisibleCards().map(({ product, offset, idx }) => (
              <div
                key={`${idx}-${product.name}`}
                className={`w-64 sm:w-72 flex-shrink-0 transition-all duration-300 ${
                  Math.abs(offset) > 1 ? "hidden lg:block" : ""
                } ${Math.abs(offset) > 0 && Math.abs(offset) <= 1 ? "hidden sm:block" : ""}`}
              >
                <ProductCard
                  product={product}
                  isActive={offset === 0}
                  offset={offset}
                  showCash={showCash}
                />
              </div>
            ))}
          </motion.div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 glass rounded-full w-10 h-10 flex items-center justify-center glass-hover cursor-pointer z-10"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 glass rounded-full w-10 h-10 flex items-center justify-center glass-hover cursor-pointer z-10"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div className="flex justify-center gap-3 mt-6">
          {PRODUCTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`glass rounded-lg p-2 transition-all duration-300 cursor-pointer ${
                  i === current ? "ring-1 ring-primary shadow-glow scale-110" : "opacity-50 hover:opacity-80"
                }`}
              >
                <Icon className="w-4 h-4 text-foreground" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
