import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, ChevronDown, Grid3X3, LayoutList, Quote } from "lucide-react";
import { useState, useRef, useMemo } from "react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    avatar: "SC",
    role: "Tech Enthusiast",
    rating: 5,
    text: "Triple G made recycling my old phones so easy! I earned enough points to get a discount on a refurbished laptop. The whole process took less than 5 minutes.",
    helpful: 42,
    date: "2026-02-28",
  },
  {
    name: "Marcus Johnson",
    avatar: "MJ",
    role: "Environmental Activist",
    rating: 5,
    text: "Finally, a platform that makes e-waste recycling rewarding. I've submitted over 15 devices and tracked my CO₂ savings. It's incredibly motivating to see the real impact.",
    helpful: 38,
    date: "2026-03-01",
  },
  {
    name: "Aisha Patel",
    avatar: "AP",
    role: "College Student",
    rating: 4,
    text: "Great concept and execution. I got cash for my broken tablet that I thought was worthless. The AI evaluation was spot-on. Would love more pickup options in my area.",
    helpful: 27,
    date: "2026-02-15",
  },
  {
    name: "David Kim",
    avatar: "DK",
    role: "Small Business Owner",
    rating: 5,
    text: "We recycled our entire office's old equipment through Triple G. The bulk submission feature saved us hours. Plus, the carbon credits are a nice addition to our sustainability report.",
    helpful: 55,
    date: "2026-03-05",
  },
  {
    name: "Lisa Thompson",
    avatar: "LT",
    role: "Parent & Educator",
    rating: 4,
    text: "Teaching my kids about e-waste responsibility through Triple G has been wonderful. They love seeing the points add up and understanding their environmental impact.",
    helpful: 31,
    date: "2026-01-20",
  },
  {
    name: "Raj Gupta",
    avatar: "RG",
    role: "Software Developer",
    rating: 5,
    text: "The evaluation algorithm is impressive. Fair prices, fast processing, and the platform is beautifully designed. As a developer, I appreciate the attention to detail here.",
    helpful: 44,
    date: "2026-03-08",
  },
];

const StarRating = ({ rating, animated = false }: { rating: number; animated?: boolean }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        initial={animated ? { scale: 0, rotate: -180 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
      >
        <Star
          className={`w-4 h-4 ${i < rating ? "text-accent fill-accent" : "text-border"}`}
        />
      </motion.div>
    ))}
  </div>
);

const TestimonialCard = ({
  t,
  layout,
  index,
}: {
  t: typeof TESTIMONIALS[0];
  layout: "grid" | "carousel";
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(t.helpful);
  const [liked, setLiked] = useState(false);
  const isLong = t.text.length > 120;

  return (
    <motion.div
      className="glass-lg rounded-2xl p-6 glass-border-gradient glass-hover relative group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
      layout
    >
      {/* Decorative quote */}
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 rotate-180" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-sm font-bold text-primary">
          {t.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold truncate">{t.name}</h4>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
        <StarRating rating={t.rating} animated />
      </div>

      {/* Text */}
      <div className="relative">
        <p className={`text-sm text-foreground/80 leading-relaxed ${!expanded && isLong ? "line-clamp-3" : ""}`}>
          {t.text}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary mt-1 flex items-center gap-1 cursor-pointer hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown className="w-3 h-3" />
            </motion.span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <button
          onClick={() => { if (!liked) { setLikes((l) => l + 1); setLiked(true); } }}
          className={`flex items-center gap-1.5 text-xs cursor-pointer transition-colors ${
            liked ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
          <span>{likes} helpful</span>
        </button>
        <span className="text-[10px] text-muted-foreground">
          {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const [layout, setLayout] = useState<"grid" | "carousel">("grid");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "helpful">("helpful");
  const [visibleCount, setVisibleCount] = useState(4);
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => {
    let items = [...TESTIMONIALS];
    if (filterRating) items = items.filter((t) => t.rating === filterRating);
    items.sort((a, b) => sortBy === "helpful" ? b.helpful - a.helpful : new Date(b.date).getTime() - new Date(a.date).getTime());
    return items;
  }, [filterRating, sortBy]);

  const visible = layout === "grid" ? filtered.slice(0, visibleCount) : filtered;

  return (
    <section ref={sectionRef} className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4">What People <span className="text-gradient-primary">Say</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of satisfied users making a difference
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {/* Layout toggle */}
          <div className="inline-flex glass rounded-full p-1">
            <button
              onClick={() => setLayout("grid")}
              className={`p-2 rounded-full transition-all cursor-pointer ${layout === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout("carousel")}
              className={`p-2 rounded-full transition-all cursor-pointer ${layout === "carousel" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          {/* Rating filter */}
          <div className="inline-flex glass rounded-full p-1 gap-1">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                !filterRating ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {[5, 4].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(filterRating === r ? null : r)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  filterRating === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r} <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="inline-flex glass rounded-full p-1">
            <button
              onClick={() => setSortBy("helpful")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                sortBy === "helpful" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Most Helpful
            </button>
            <button
              onClick={() => setSortBy("date")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                sortBy === "date" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Recent
            </button>
          </div>
        </div>

        {/* Testimonials layout */}
        <AnimatePresence mode="wait">
          {layout === "grid" ? (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              {visible.map((t, i) => (
                <TestimonialCard key={t.name} t={t} layout="grid" index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="carousel"
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {visible.map((t, i) => (
                <div key={t.name} className="min-w-[300px] sm:min-w-[350px] snap-center flex-shrink-0">
                  <TestimonialCard t={t} layout="carousel" index={i} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load more */}
        {layout === "grid" && visibleCount < filtered.length && (
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setVisibleCount((c) => c + 4)}
              className="glass glass-hover rounded-full px-8 py-3 text-sm font-medium text-foreground cursor-pointer"
            >
              Load More Reviews
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
