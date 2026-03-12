import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  BookOpen,
  Recycle,
  Cpu,
  Lightbulb,
  TrendingUp,
  Video,
  FileText,
  Image as ImageIcon,
  Play,
  Share2,
  ArrowLeft,
  Plus,
  Users,
  Eye,
  FileCheck,
  Edit,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Clock,
  Heart,
  Award,
  Flame,
  Zap,
  Trophy,
  Star,
  Twitter,
  Facebook,
  Link2,
  ChevronRight,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import { AwarenessProvider, useAwareness, ContentItem } from "@/contexts/AwarenessContext";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── Floating E-Waste Icon ───────────────────────────────────────
const FloatingIcon = ({ icon: Icon, delay, x, y }: { icon: any; delay: number; x: string; y: string }) => (
  <motion.div
    className="absolute text-primary/20"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0],
      rotateY: [0, 180, 360],
      rotateZ: [0, 10, -10, 0],
    }}
    transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    <Icon className="w-8 h-8 md:w-12 md:h-12" />
  </motion.div>
);

// ─── Progress Ring ───────────────────────────────────────────────
const ProgressRing = ({ value, max, label }: { value: number; max: number; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const pct = (value / max) * 100;
  const r = 54;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = () => {
      start += Math.ceil(value / 60);
      if (start >= value) { setCount(value); return; }
      setCount(start);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r={r} fill="none"
            stroke="url(#ringGrad)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: circ - (circ * pct) / 100 } : {}}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{count.toLocaleString()}</span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
};

// ─── Search with Morphing Suggestions ────────────────────────────
const SUGGESTIONS = [
  "How to recycle batteries safely",
  "E-waste statistics 2024",
  "Reusing old smartphones",
  "Safe disposal methods",
  "Circular economy electronics",
];

const SearchWithSuggestions = ({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) => {
  const [focused, setFocused] = useState(false);
  const [suggIdx, setSuggIdx] = useState(0);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    if (focused) return;
    let i = 0;
    let adding = true;
    const target = SUGGESTIONS[suggIdx];
    const iv = setInterval(() => {
      if (adding) {
        i++;
        setPlaceholder(target.slice(0, i));
        if (i >= target.length) { adding = false; setTimeout(() => clearInterval(iv), 1500); }
      }
    }, 50);
    const timeout = setTimeout(() => {
      setSuggIdx((p) => (p + 1) % SUGGESTIONS.length);
    }, target.length * 50 + 2500);
    return () => { clearInterval(iv); clearTimeout(timeout); };
  }, [suggIdx, focused]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.div
        className="relative"
        animate={{ scale: focused ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder || "Search..."}
          className="pl-12 h-14 text-lg rounded-2xl glass-lg border-primary/20 focus:border-primary/40"
        />
      </motion.div>
      <AnimatePresence>
        {focused && !value && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 glass-lg rounded-xl p-2 z-50"
          >
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s}
                onMouseDown={() => onChange(s)}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary/50" />
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Category Chip ───────────────────────────────────────────────
const CategoryChip = ({
  cat, active, count, onClick,
}: { cat: { name: string; icon: any; emoji: string }; active: boolean; count: number; onClick: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.15);
    y.set(dy * 0.15);
  };

  return (
    <motion.button
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
        active
          ? "bg-gradient-primary text-primary-foreground shadow-primary"
          : "glass glass-hover"
      }`}
    >
      <span className="text-base">{cat.emoji}</span>
      {cat.name}
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
            active ? "bg-primary-foreground/20" : "bg-primary/20 text-primary"
          }`}
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
};

// ─── Bookmark Button ─────────────────────────────────────────────
const BookmarkButton = ({ id }: { id: string }) => {
  const [saved, setSaved] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    if (!saved) {
      setParticles(Array.from({ length: 6 }, (_, i) => i));
      toast.success("Bookmarked!");
      setTimeout(() => setParticles([]), 600);
    }
  };

  return (
    <button onClick={toggle} className="relative p-2 rounded-full hover:bg-muted/50 transition-colors">
      <AnimatePresence mode="wait">
        <motion.div
          key={saved ? "saved" : "unsaved"}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 30 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {saved ? (
            <BookmarkCheck className="w-5 h-5 text-primary" />
          ) : (
            <Bookmark className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.div>
      </AnimatePresence>
      {particles.map((p) => (
        <motion.span
          key={p}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary"
          style={{ top: "50%", left: "50%" }}
          initial={{ scale: 1, x: 0, y: 0 }}
          animate={{
            x: Math.cos((p / 6) * Math.PI * 2) * 20,
            y: Math.sin((p / 6) * Math.PI * 2) * 20,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </button>
  );
};

// ─── Share Expand Button ─────────────────────────────────────────
const ShareExpand = () => {
  const [open, setOpen] = useState(false);

  const share = (type: string) => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(`Link copied for ${type}!`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-2 rounded-full hover:bg-muted/50 transition-colors"
      >
        <Share2 className="w-5 h-5 text-muted-foreground" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute bottom-full right-0 mb-2 glass-lg rounded-xl p-1.5 flex gap-1 z-50"
          >
            {[
              { icon: Twitter, label: "Twitter" },
              { icon: Facebook, label: "Facebook" },
              { icon: Link2, label: "Copy" },
            ].map(({ icon: I, label }, idx) => (
              <motion.button
                key={label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={(e) => { e.stopPropagation(); share(label); }}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                title={label}
              >
                <I className="w-4 h-4" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Content Card ────────────────────────────────────────────────
const ContentCard = ({
  item, index, onClick, isAdmin, onEdit, onDelete,
}: {
  item: ContentItem; index: number; onClick: () => void;
  isAdmin: boolean; onEdit: () => void; onDelete: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [8, -8]);
  const rotateY = useTransform(mouseX, [-150, 150], [-8, 8]);
  const [hovered, setHovered] = useState(false);

  const readTime = item.content ? Math.max(1, Math.ceil(item.content.split(" ").length / 200)) : 3;
  const readProgress = Math.min(100, (item.views / 50) * 100);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const typeConfig = {
    article: { icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
    video: { icon: Video, color: "text-rose-400", bg: "bg-rose-400/10" },
    infographic: { icon: ImageIcon, color: "text-amber-400", bg: "bg-amber-400/10" },
  };
  const tc = typeConfig[item.type];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      style={{ perspective: 800 }}
      className="break-inside-avoid mb-6"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouse}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0); }}
        whileHover={{ y: -6 }}
        onClick={onClick}
        className="glass rounded-2xl overflow-hidden cursor-pointer group transition-shadow hover:shadow-primary"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <motion.img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-48 object-cover"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${tc.bg} ${tc.color} border-none gap-1`}>
              <tc.icon className="w-3 h-3" />
              {item.type}
            </Badge>
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-1">
            <BookmarkButton id={item.id} />
            <ShareExpand />
          </div>

          {/* Video Play */}
          {item.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-full glass-lg flex items-center justify-center"
              >
                <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
              </motion.div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <Badge variant="secondary" className="mb-3 text-xs">
            {item.category}
          </Badge>
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

          {/* Reading time + progress */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {item.views}
            </span>
          </div>

          {/* Read Progress Bar */}
          <div className="h-1 rounded-full bg-muted overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: `${readProgress}%` } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>

          {/* Author + Admin actions */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{item.author}</span>
            {isAdmin && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="p-1.5 rounded-lg hover:bg-muted/50"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="p-1.5 rounded-lg hover:bg-destructive/20 text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Animated Counter ────────────────────────────────────────────
const AnimCounter = ({ end, label, icon: Icon }: { end: number; label: string; icon: any }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = () => {
      v += Math.ceil(end / 50);
      if (v >= end) { setVal(end); return; }
      setVal(v);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="glass rounded-2xl p-6 text-center"
    >
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <p className="text-3xl font-bold mb-1">{val.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
};

// ─── Achievement Badge ───────────────────────────────────────────
const AchievementBadge = ({
  icon: Icon, title, desc, unlocked, delay,
}: { icon: any; title: string; desc: string; unlocked: boolean; delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
      animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay, type: "spring" }}
      className={`glass rounded-2xl p-4 text-center relative overflow-hidden ${
        unlocked ? "" : "opacity-40 grayscale"
      }`}
    >
      {unlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-primary opacity-5"
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
      <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${
        unlocked ? "bg-gradient-primary" : "bg-muted"
      }`}>
        <Icon className={`w-7 h-7 ${unlocked ? "text-primary-foreground" : "text-muted-foreground"}`} />
      </div>
      <p className="text-sm font-bold">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
      {unlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
        >
          <span className="text-xs">✓</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Learning Streak Calendar ────────────────────────────────────
const StreakCalendar = () => {
  const days = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    active: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 26].includes(i + 1),
    intensity: Math.random(),
  }));

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-accent" />
        <span className="font-bold">21 Day Streak!</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className={`w-full aspect-square rounded-md text-[10px] flex items-center justify-center ${
              d.active
                ? d.intensity > 0.6
                  ? "bg-primary/60"
                  : "bg-primary/30"
                : "bg-muted/30"
            }`}
          >
            {d.day}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── CO2 Meter ───────────────────────────────────────────────────
const CO2Meter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const saved = 3.8;
  const goal = 5;
  const pct = (saved / goal) * 100;

  return (
    <div ref={ref} className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Recycle className="w-5 h-5 text-primary" />
          <span className="font-bold">CO₂ Impact</span>
        </div>
        <span className="text-sm text-muted-foreground">{saved} / {goal} tons</span>
      </div>
      <div className="h-4 rounded-full bg-muted overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 animate-shimmer rounded-full"
          style={{ mixBlendMode: "overlay" }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Community goal: {goal} tons of CO₂ prevented
      </p>
    </div>
  );
};

// ─── Categories config ───────────────────────────────────────────
const categories = [
  { name: "All", icon: BookOpen, emoji: "📚" },
  { name: "Recycle Tips", icon: Recycle, emoji: "♻️" },
  { name: "Safe Disposal", icon: Cpu, emoji: "⚙️" },
  { name: "Reusing Components", icon: Lightbulb, emoji: "🔋" },
  { name: "Sustainability 101", icon: TrendingUp, emoji: "🧠" },
  { name: "Tech & Environment", icon: TrendingUp, emoji: "📈" },
];

// ─── Main Content Component ──────────────────────────────────────
const AwarenessContent = () => {
  const { content, addContent, updateContent, deleteContent, incrementViews } = useAwareness();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "popularity">("date");
  const [selectedArticle, setSelectedArticle] = useState<ContentItem | null>(null);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const articleContentRef = useRef<HTMLDivElement>(null);

  const isAdmin = localStorage.getItem("userRole") === "admin";

  const [formData, setFormData] = useState({
    type: "article" as ContentItem["type"],
    title: "",
    category: "Recycle Tips",
    description: "",
    content: "",
    author: "",
    thumbnail: "/placeholder.svg",
    videoUrl: "",
    featured: false,
  });

  const scrollToContent = () => contentRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleOpenArticle = (item: ContentItem) => {
    setSelectedArticle(item);
    incrementViews(item.id);
    setReadingProgress(0);
    if (item.type === "video") {
      setIsVideoDialogOpen(true);
    } else {
      setIsArticleDialogOpen(true);
    }
  };

  const handleArticleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    setReadingProgress(Math.min(100, pct));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleSubmitContent = () => {
    if (!formData.title || !formData.description || !formData.author) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (isEditMode && editingItem) {
      updateContent(editingItem.id, { ...formData, date: editingItem.date });
      toast.success("Content updated!");
    } else {
      addContent({ ...formData, date: new Date().toISOString().split("T")[0] });
      toast.success("Content added!");
    }
    setIsAdminDialogOpen(false);
    resetForm();
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setIsEditMode(true);
    setFormData({
      type: item.type,
      title: item.title,
      category: item.category,
      description: item.description,
      content: item.content || "",
      author: item.author,
      thumbnail: item.thumbnail,
      videoUrl: item.videoUrl || "",
      featured: item.featured || false,
    });
    setIsAdminDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this content?")) {
      deleteContent(id);
      toast.success("Deleted!");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "article", title: "", category: "Recycle Tips", description: "",
      content: "", author: "", thumbnail: "/placeholder.svg", videoUrl: "", featured: false,
    });
    setIsEditMode(false);
    setEditingItem(null);
  };

  const filteredContent = useMemo(() => {
    let filtered = content.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      filtered.sort((a, b) => b.views - a.views);
    }
    return filtered;
  }, [content, searchQuery, selectedCategory, sortBy]);

  const totalViews = content.reduce((sum, item) => sum + item.views, 0);
  const categoryStats = categories
    .filter((cat) => cat.name !== "All")
    .map((cat) => ({
      name: cat.name.split(" ")[0],
      views: content.filter((item) => item.category === cat.name).reduce((sum, item) => sum + item.views, 0),
    }));

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: content.length };
    categories.forEach((c) => {
      if (c.name !== "All") counts[c.name] = content.filter((i) => i.category === c.name).length;
    });
    return counts;
  }, [content]);

  // Key terms to highlight in articles
  const keyTerms = ["e-waste", "recycling", "circular economy", "toxic", "hazardous", "sustainability", "rare earth", "carbon footprint"];

  const highlightText = (text: string) => {
    let result = text;
    keyTerms.forEach((term) => {
      const regex = new RegExp(`(${term})`, "gi");
      result = result.replace(regex, `<mark class="bg-primary/20 text-foreground px-0.5 rounded">$1</mark>`);
    });
    return result;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Animated gradient BG */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-hero opacity-10"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <div className="absolute inset-0 bg-gradient-radial" />
        </div>

        {/* Floating E-Waste Icons */}
        <FloatingIcon icon={Monitor} delay={0} x="10%" y="15%" />
        <FloatingIcon icon={Smartphone} delay={1} x="85%" y="20%" />
        <FloatingIcon icon={Tablet} delay={2} x="15%" y="70%" />
        <FloatingIcon icon={Cpu} delay={3} x="80%" y="65%" />
        <FloatingIcon icon={Recycle} delay={1.5} x="50%" y="10%" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">E-Waste Education Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              Learn. Act.{" "}
              <span className="text-gradient-primary">Recycle.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Empowering you to make responsible e-waste decisions through knowledge
            </motion.p>

            {/* Progress Rings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-8 mb-10"
            >
              <ProgressRing value={4200} max={5000} label="Users Educated" />
              <ProgressRing value={content.length} max={20} label="Guides Published" />
              <ProgressRing value={totalViews} max={15000} label="Total Views" />
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <SearchWithSuggestions value={searchQuery} onChange={setSearchQuery} />
            </motion.div>

            {/* Admin CTA */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-6"
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => { resetForm(); setIsAdminDialogOpen(true); }}
                  className="gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Content
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16" ref={contentRef}>
        <div className="max-w-7xl mx-auto">

          {/* ── Admin Analytics ── */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Content Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: FileCheck, label: "Total Articles", val: content.length },
                  { icon: Eye, label: "Total Views", val: totalViews.toLocaleString() },
                  { icon: Users, label: "Users Educated", val: "4,200+" },
                ].map(({ icon: I, label, val }) => (
                  <Card key={label} className="p-6 shadow-card">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <I className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-3xl font-bold">{val}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <Card className="p-6 shadow-card">
                <h3 className="text-lg font-bold mb-4">Views by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          )}

          {/* ── Category Navigation ── */}
          <div className="mb-8">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
            >
              {categories.map((cat) => (
                <div key={cat.name} className="snap-start">
                  <CategoryChip
                    cat={cat}
                    active={selectedCategory === cat.name}
                    count={categoryCounts[cat.name] || 0}
                    onClick={() => setSelectedCategory(cat.name)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Sort Bar ── */}
          <div className="flex items-center justify-between mb-8">
            <motion.p
              key={filteredContent.length}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground"
            >
              <span className="font-bold text-foreground">{filteredContent.length}</span> results
            </motion.p>
            <Select value={sortBy} onValueChange={(v: "date" | "popularity") => setSortBy(v)}>
              <SelectTrigger className="w-[180px] glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="popularity">Sort by Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ── Content Masonry Grid ── */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mb-16">
            {filteredContent.map((item, idx) => (
              <ContentCard
                key={item.id}
                item={item}
                index={idx}
                onClick={() => handleOpenArticle(item)}
                isAdmin={isAdmin}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-lg text-muted-foreground">No content found</p>
              <p className="text-sm text-muted-foreground/60">Try a different search or category</p>
            </div>
          )}

          {/* ── Impact Statistics ── */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold mb-2">Your Learning Impact</h2>
              <p className="text-muted-foreground">Track your contribution to a greener planet</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <AnimCounter end={4200} label="Users Educated" icon={Users} />
              <AnimCounter end={totalViews} label="Articles Read" icon={BookOpen} />
              <AnimCounter end={890} label="Videos Watched" icon={Video} />
              <AnimCounter end={156} label="Badges Earned" icon={Award} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StreakCalendar />
              <CO2Meter />
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-accent" />
                  <span className="font-bold">Achievements</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <AchievementBadge icon={BookOpen} title="Bookworm" desc="Read 10 articles" unlocked delay={0} />
                  <AchievementBadge icon={Video} title="Binge Learner" desc="Watch 5 videos" unlocked delay={0.1} />
                  <AchievementBadge icon={Flame} title="On Fire" desc="7-day streak" unlocked delay={0.2} />
                  <AchievementBadge icon={Star} title="Master" desc="Complete all" unlocked={false} delay={0.3} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── Article Detail Dialog ── */}
      <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          {selectedArticle && (
            <div className="relative">
              {/* Reading Progress Bar */}
              <div className="sticky top-0 z-50 h-1 bg-muted">
                <motion.div
                  className="h-full bg-gradient-primary"
                  style={{ width: `${readingProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <div
                className="overflow-y-auto max-h-[calc(90vh-4px)] p-6 md:p-8"
                onScroll={handleArticleScroll}
              >
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{selectedArticle.category}</Badge>
                    <Badge className="bg-blue-400/10 text-blue-400 border-none gap-1">
                      <FileText className="w-3 h-3" />
                      {selectedArticle.type}
                    </Badge>
                  </div>
                  <DialogTitle className="text-3xl">{selectedArticle.title}</DialogTitle>
                  <DialogDescription className="text-base">
                    By {selectedArticle.author} • {new Date(selectedArticle.date).toLocaleDateString()} • {selectedArticle.views} views
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6">
                  <img
                    src={selectedArticle.thumbnail}
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />

                  {/* Article Content with highlighted terms */}
                  <div className="prose prose-lg max-w-none">
                    {selectedArticle.content?.split("\n\n").map((paragraph, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="mb-4 text-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: highlightText(paragraph) }}
                      />
                    ))}
                  </div>

                  {/* Related articles */}
                  <div className="mt-10 pt-6 border-t border-border">
                    <h4 className="font-bold mb-4">Related Articles</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content
                        .filter((c) => c.id !== selectedArticle.id && c.category === selectedArticle.category)
                        .slice(0, 2)
                        .map((rel) => (
                          <button
                            key={rel.id}
                            onClick={() => { handleOpenArticle(rel); }}
                            className="glass rounded-xl p-4 text-left hover:bg-muted/30 transition-colors flex gap-3"
                          >
                            <img src={rel.thumbnail} alt={rel.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm line-clamp-2">{rel.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{rel.author}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                    <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button onClick={() => setIsArticleDialogOpen(false)} variant="outline" className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Video Dialog ── */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedArticle && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedArticle.title}</DialogTitle>
                <DialogDescription>
                  By {selectedArticle.author} • {new Date(selectedArticle.date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6">
                <div className="aspect-video bg-card rounded-xl overflow-hidden mb-4">
                  <iframe
                    src={selectedArticle.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-muted-foreground mb-6">{selectedArticle.description}</p>

                {/* Related Videos */}
                <div className="mb-6">
                  <h4 className="font-bold mb-3">More Videos</h4>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {content
                      .filter((c) => c.type === "video" && c.id !== selectedArticle.id)
                      .slice(0, 4)
                      .map((v) => (
                        <button
                          key={v.id}
                          onClick={() => handleOpenArticle(v)}
                          className="flex-shrink-0 w-40 glass rounded-xl overflow-hidden hover:shadow-primary transition-shadow"
                        >
                          <div className="relative">
                            <img src={v.thumbnail} alt={v.title} className="w-full h-24 object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                              <Play className="w-6 h-6" />
                            </div>
                          </div>
                          <p className="p-2 text-xs font-medium line-clamp-2">{v.title}</p>
                        </button>
                      ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button onClick={() => setIsVideoDialogOpen(false)} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Admin CRUD Dialog ── */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Content" : "Add New Content"}</DialogTitle>
            <DialogDescription>Fill in the details to {isEditMode ? "update" : "create"} educational content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content Type</label>
              <Select value={formData.type} onValueChange={(v: ContentItem["type"]) => setFormData({ ...formData, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="infographic">Infographic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter title" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.filter((c) => c.name !== "All").map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description *</label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Short description" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Author *</label>
              <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="Author name" />
            </div>
            {formData.type === "article" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article content (double line breaks for paragraphs)"
                  className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background"
                />
              </div>
            )}
            {formData.type === "video" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Video URL (YouTube Embed)</label>
                <Input value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Thumbnail URL</label>
              <Input value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="/placeholder.svg" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4" />
              <label htmlFor="featured" className="text-sm font-medium">Featured Content</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={() => setIsAdminDialogOpen(false)} variant="outline" className="flex-1">Cancel</Button>
            <Button onClick={handleSubmitContent} className="flex-1 bg-gradient-primary hover:opacity-90">
              {isEditMode ? "Update" : "Create"} Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

const Awareness = () => (
  <AwarenessProvider>
    <AwarenessContent />
  </AwarenessProvider>
);

export default Awareness;
