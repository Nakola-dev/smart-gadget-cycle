import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Laptop,
  Smartphone,
  Tablet,
  Headphones,
  Award,
  Search,
  Coins,
  TrendingUp,
  Heart,
  Eye,
  X,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  Zap,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

// --- Types ---
interface SwapItem {
  id: number;
  name: string;
  category: string;
  icon: typeof Laptop;
  points: number;
  cash: number;
  description: string;
  available: boolean;
  image: string;
  condition: "Refurbished" | "Like New" | "Good";
  stock: number;
  maxStock: number;
  rating: number;
  specs: { label: string; value: string }[];
}

interface Transaction {
  id: number;
  itemName: string;
  pointsUsed: number;
  cashUsed: number;
  date: string;
  status: "Completed" | "Pending";
}

// --- Data ---
const swapItems: SwapItem[] = [
  {
    id: 1, name: "Refurbished MacBook Air", category: "Laptop", icon: Laptop,
    points: 5000, cash: 450, description: "2020 model, 8GB RAM, 256GB SSD, excellent condition",
    available: true, image: "/placeholder.svg", condition: "Refurbished", stock: 5, maxStock: 10, rating: 4.8,
    specs: [{ label: "CPU", value: "M1 Chip" }, { label: "RAM", value: "8GB" }, { label: "Storage", value: "256GB SSD" }, { label: "Display", value: "13.3\" Retina" }],
  },
  {
    id: 2, name: "Samsung Galaxy S21", category: "Smartphone", icon: Smartphone,
    points: 3500, cash: 320, description: "Unlocked, good condition, includes charger",
    available: true, image: "/placeholder.svg", condition: "Good", stock: 8, maxStock: 15, rating: 4.5,
    specs: [{ label: "CPU", value: "Exynos 2100" }, { label: "RAM", value: "8GB" }, { label: "Storage", value: "128GB" }, { label: "Display", value: "6.2\" AMOLED" }],
  },
  {
    id: 3, name: "iPad 9th Gen", category: "Tablet", icon: Tablet,
    points: 4200, cash: 380, description: "64GB, Wi-Fi, like new condition",
    available: false, image: "/placeholder.svg", condition: "Like New", stock: 0, maxStock: 8, rating: 4.7,
    specs: [{ label: "CPU", value: "A13 Bionic" }, { label: "RAM", value: "3GB" }, { label: "Storage", value: "64GB" }, { label: "Display", value: "10.2\" Retina" }],
  },
  {
    id: 4, name: "Sony WH-1000XM4", category: "Headphones", icon: Headphones,
    points: 1800, cash: 165, description: "Noise-cancelling, excellent condition",
    available: true, image: "/placeholder.svg", condition: "Refurbished", stock: 12, maxStock: 20, rating: 4.9,
    specs: [{ label: "Type", value: "Over-ear" }, { label: "ANC", value: "Yes" }, { label: "Battery", value: "30 hours" }, { label: "Weight", value: "254g" }],
  },
  {
    id: 5, name: "Refurbished Dell XPS 13", category: "Laptop", icon: Laptop,
    points: 5500, cash: 495, description: "2021 model, 16GB RAM, 512GB SSD",
    available: true, image: "/placeholder.svg", condition: "Like New", stock: 3, maxStock: 6, rating: 4.6,
    specs: [{ label: "CPU", value: "Intel i7-1185G7" }, { label: "RAM", value: "16GB" }, { label: "Storage", value: "512GB SSD" }, { label: "Display", value: "13.4\" FHD+" }],
  },
  {
    id: 6, name: "iPhone 11", category: "Smartphone", icon: Smartphone,
    points: 2800, cash: 255, description: "64GB, good condition, battery health 85%",
    available: true, image: "/placeholder.svg", condition: "Good", stock: 6, maxStock: 10, rating: 4.3,
    specs: [{ label: "CPU", value: "A13 Bionic" }, { label: "RAM", value: "4GB" }, { label: "Storage", value: "64GB" }, { label: "Display", value: "6.1\" Liquid Retina" }],
  },
  {
    id: 7, name: "AirPods Pro 2nd Gen", category: "Headphones", icon: Headphones,
    points: 2200, cash: 200, description: "Active noise cancellation, MagSafe case",
    available: true, image: "/placeholder.svg", condition: "Like New", stock: 9, maxStock: 15, rating: 4.8,
    specs: [{ label: "Type", value: "In-ear" }, { label: "ANC", value: "Yes" }, { label: "Battery", value: "6 hours" }, { label: "Case", value: "MagSafe" }],
  },
  {
    id: 8, name: "Samsung Galaxy Tab S7", category: "Tablet", icon: Tablet,
    points: 3800, cash: 345, description: "128GB, Wi-Fi, S Pen included",
    available: true, image: "/placeholder.svg", condition: "Refurbished", stock: 4, maxStock: 8, rating: 4.4,
    specs: [{ label: "CPU", value: "Snapdragon 865+" }, { label: "RAM", value: "6GB" }, { label: "Storage", value: "128GB" }, { label: "Display", value: "11\" LTPS" }],
  },
];

const mockTransactions: Transaction[] = [
  { id: 1, itemName: "Sony WH-1000XM4", pointsUsed: 1800, cashUsed: 0, date: "2024-10-15", status: "Completed" },
  { id: 2, itemName: "iPhone 11", pointsUsed: 0, cashUsed: 255, date: "2024-10-10", status: "Completed" },
  { id: 3, itemName: "AirPods Pro", pointsUsed: 2200, cashUsed: 0, date: "2024-09-28", status: "Pending" },
];

const categories = ["All", "Laptop", "Smartphone", "Tablet", "Headphones"];
const conditions = ["All", "Refurbished", "Like New", "Good"];

// --- Animated Counter ---
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(value / 30);
    const interval = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [inView, value]);

  return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>;
};

// --- 3D Tilt Product Card ---
const ProductCard = ({
  item,
  onQuickView,
  onSwap,
  isWishlisted,
  onToggleWishlist,
  isComparing,
  onToggleCompare,
  showCash,
}: {
  item: SwapItem;
  onQuickView: (item: SwapItem) => void;
  onSwap: (item: SwapItem) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  isComparing: boolean;
  onToggleCompare: (id: number) => void;
  showCash: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);
  const lightX = useTransform(mouseX, [0, 1], [0, 100]);
  const lightY = useTransform(mouseY, [0, 1], [0, 100]);
  const lightGradient = useTransform(
    [lightX, lightY],
    ([lx, ly]) => `radial-gradient(circle at ${lx}% ${ly}%, hsl(160 84% 39% / 0.3), transparent 60%)`
  );
  const [hovered, setHovered] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setHovered(false);
  };

  const handleWishlist = () => {
    if (!isWishlisted) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 600);
    }
    onToggleWishlist(item.id);
  };

  const Icon = item.icon;
  const stockPercent = (item.stock / item.maxStock) * 100;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: hovered ? rotateX : 0, rotateY: hovered ? rotateY : 0, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      {/* Light reflection overlay */}
      {hovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-20"
          style={{
            background: useTransform(
              [lightX, lightY],
              ([lx, ly]) => `radial-gradient(circle at ${lx}% ${ly}%, hsl(160 84% 39% / 0.3), transparent 60%)`
            ),
          }}
        />
      )}

      <div className="relative rounded-2xl glass-lg glass-border-gradient overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-glow">
        {/* Top actions */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlist}
            className="relative w-9 h-9 rounded-full glass flex items-center justify-center"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? "fill-destructive text-destructive scale-110" : "text-muted-foreground"}`}
            />
            {/* Heart burst particles */}
            <AnimatePresence>
              {heartBurst && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{
                        scale: 1,
                        opacity: 0,
                        x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                        y: Math.sin((i * 60 * Math.PI) / 180) * 20,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-destructive"
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => onToggleCompare(item.id)}
            className={`w-9 h-9 rounded-full glass flex items-center justify-center transition-colors ${isComparing ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
          >
            <GitCompare className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Image/Icon area */}
        <div className="relative h-44 flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
          <motion.div
            animate={hovered ? { scale: 1.15, rotate: 3 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Icon className="w-20 h-20 text-primary/60" />
          </motion.div>

          {/* Condition badge */}
          <Badge className="absolute top-3 left-3 bg-primary/10 text-primary border-primary/20 text-xs">
            {item.condition}
          </Badge>

          {/* Quick view overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center"
              >
                <Button
                  onClick={() => onQuickView(item)}
                  variant="outline"
                  size="sm"
                  className="glass border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Eye className="w-4 h-4 mr-1" /> Quick View
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(item.rating) ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{item.rating}</span>
          </div>

          <h3 className="text-lg font-bold mb-1 text-foreground">{item.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">{item.description}</p>

          {/* Stock indicator */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
              </span>
              <span className="text-muted-foreground">{Math.round(stockPercent)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stockPercent}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full rounded-full ${stockPercent > 50 ? "bg-primary" : stockPercent > 20 ? "bg-accent" : "bg-destructive"}`}
              />
            </div>
          </div>

          {/* Price with flip */}
          <div className="pt-4 border-t border-border/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={showCash ? "cash" : "points"}
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-baseline gap-2 mb-3"
              >
                {showCash ? (
                  <>
                    <span className="text-2xl font-bold text-primary">${item.cash}</span>
                    <span className="text-xs text-muted-foreground">USD</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-primary">{item.points.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">pts</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <Button
              disabled={!item.available}
              onClick={() => onSwap(item)}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground relative overflow-hidden group/btn"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {item.available ? "Swap Now" : "Out of Stock"}
              </span>
              <motion.div
                className="absolute inset-0 bg-accent/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Quick View Modal ---
const QuickViewModal = ({
  item,
  open,
  onClose,
  onSwap,
  showCash,
}: {
  item: SwapItem | null;
  open: boolean;
  onClose: () => void;
  onSwap: (item: SwapItem) => void;
  showCash: boolean;
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [rotation, setRotation] = useState(0);
  const tabs = ["Overview", "Specs", "Reviews"];

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setRotation((r) => (r + 1) % 360), 50);
    return () => clearInterval(interval);
  }, [open]);

  if (!item) return null;
  const Icon = item.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl glass-lg border-border/30 p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left: Product visual */}
          <div className="relative h-64 md:h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent p-8">
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ duration: 0, ease: "linear" }}
              className="relative"
            >
              <Icon className="w-32 h-32 text-primary/40" />
            </motion.div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCw className="w-3 h-3 animate-spin" /> 360° view
            </div>
          </div>

          {/* Right: Info */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="p-0 mb-4">
              <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/20 text-xs">{item.condition}</Badge>
              <DialogTitle className="text-xl">{item.name}</DialogTitle>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(item.rating) ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{item.rating}</span>
              </div>
            </DialogHeader>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-1 rounded-lg bg-muted/50">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-h-[120px]"
              >
                {activeTab === 0 && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
                {activeTab === 1 && (
                  <div className="space-y-2">
                    {item.specs.map((s) => (
                      <div key={s.label} className="flex justify-between text-sm py-1.5 border-b border-border/30">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-medium text-foreground">{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 2 && (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary/40" />
                    No reviews yet
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Price & CTA */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-primary">
                  {showCash ? `$${item.cash}` : `${item.points.toLocaleString()} pts`}
                </span>
              </div>
              <Button
                disabled={!item.available}
                onClick={() => { onSwap(item); onClose(); }}
                className="w-full bg-gradient-primary text-primary-foreground"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {item.available ? "Swap Now" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Comparison Modal ---
const ComparisonModal = ({
  items,
  open,
  onClose,
  showCash,
}: {
  items: SwapItem[];
  open: boolean;
  onClose: () => void;
  showCash: boolean;
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-3xl glass-lg border-border/30">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-primary" /> Compare Products
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="rounded-xl glass p-4 text-center">
              <Icon className="w-12 h-12 text-primary/50 mx-auto mb-3" />
              <h4 className="font-bold text-sm mb-1">{item.name}</h4>
              <Badge className="mb-3 bg-primary/10 text-primary text-xs">{item.condition}</Badge>
              <div className="space-y-2 text-xs">
                {item.specs.map((s) => (
                  <div key={s.label} className="flex justify-between py-1 border-b border-border/20">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium">{s.value}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <span className="text-lg font-bold text-primary">
                    {showCash ? `$${item.cash}` : `${item.points.toLocaleString()} pts`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// --- Main Page ---
const Swap = () => {
  const [userPoints, setUserPoints] = useState(7250);
  const [pointsSpent] = useState(4600);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [showCash, setShowCash] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<SwapItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<SwapItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"points" | "cash">("points");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [columns, setColumns] = useState(3);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Active filter chips
  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (categoryFilter !== "All") activeFilters.push({ label: categoryFilter, onRemove: () => setCategoryFilter("All") });
  if (conditionFilter !== "All") activeFilters.push({ label: conditionFilter, onRemove: () => setConditionFilter("All") });
  if (priceRange[0] > 0 || priceRange[1] < 6000) activeFilters.push({ label: `${priceRange[0]}-${priceRange[1]} pts`, onRemove: () => setPriceRange([0, 6000]) });
  if (searchQuery) activeFilters.push({ label: `"${searchQuery}"`, onRemove: () => setSearchQuery("") });

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const toggleCompare = (id: number) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) { toast.error("Max 3 items to compare"); return prev; }
      return [...prev, id];
    });
  };

  const handleSwap = (item: SwapItem) => {
    setSelectedItem(item);
    setPaymentMethod("points");
    setIsDialogOpen(true);
  };

  const handleConfirmSwap = () => {
    if (!selectedItem) return;
    if (paymentMethod === "points") {
      if (userPoints >= selectedItem.points) {
        setUserPoints((prev) => prev - selectedItem.points);
        toast.success(`🎉 Successfully claimed ${selectedItem.name}!`);
      } else {
        toast.error(`You need ${selectedItem.points - userPoints} more points`);
        setIsDialogOpen(false);
        return;
      }
    } else {
      toast.success(`🎉 Purchased ${selectedItem.name} for $${selectedItem.cash}!`);
    }
    setIsDialogOpen(false);
  };

  const filteredItems = swapItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesCondition = conditionFilter === "All" || item.condition === conditionFilter;
    const matchesPrice = showCash
      ? item.cash >= priceRange[0] && item.cash <= priceRange[1]
      : item.points >= priceRange[0] && item.points <= priceRange[1];
    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  });

  const columnClasses: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  // --- Filter Sidebar Content ---
  const FilterSidebar = () => (
    <div className="space-y-2">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search gadgets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-muted/30 border-border/30 focus:border-primary/50"
        />
      </div>

      <Accordion type="multiple" defaultValue={["category", "condition", "price"]} className="space-y-1">
        {/* Category */}
        <AccordionItem value="category" className="border-border/20">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline text-foreground">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    categoryFilter === cat
                      ? "bg-primary text-primary-foreground shadow-primary"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Condition */}
        <AccordionItem value="condition" className="border-border/20">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline text-foreground">
            Condition
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {conditions.map((cond) => (
                <motion.button
                  key={cond}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setConditionFilter(cond)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    conditionFilter === cond
                      ? "bg-primary text-primary-foreground shadow-primary"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cond}
                </motion.button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-border/20">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline text-foreground">
            {showCash ? "Price Range ($)" : "Points Range"}
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-1 pt-2 pb-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={showCash ? 600 : 6000}
                step={showCash ? 10 : 100}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{showCash ? `$${priceRange[0]}` : `${priceRange[0]} pts`}</span>
                <span>{showCash ? `$${priceRange[1]}` : `${priceRange[1]} pts`}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Currency toggle */}
      <div className="pt-4">
        <p className="text-xs text-muted-foreground mb-2">Display prices as</p>
        <div className="flex rounded-lg overflow-hidden glass">
          <button
            onClick={() => { setShowCash(false); setPriceRange([0, 6000]); }}
            className={`flex-1 py-2 text-xs font-medium transition-all ${!showCash ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            <Coins className="w-3.5 h-3.5 inline mr-1" /> Points
          </button>
          <button
            onClick={() => { setShowCash(true); setPriceRange([0, 600]); }}
            className={`flex-1 py-2 text-xs font-medium transition-all ${showCash ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            $ Cash
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Sticky Points Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-16 left-0 right-0 z-30 glass-lg border-b border-border/20"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 gap-4 overflow-x-auto">
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Award className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">Balance</p>
                  <p className="text-sm font-bold text-foreground">
                    <AnimatedCounter value={userPoints} suffix=" pts" />
                  </p>
                </div>
              </div>
              <div className="w-px h-6 bg-border/30" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">Spent</p>
                  <p className="text-sm font-bold text-foreground">{pointsSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {compareList.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCompare(true)}
                  className="border-primary/30 text-primary text-xs"
                >
                  <GitCompare className="w-3.5 h-3.5 mr-1" /> Compare ({compareList.length})
                </Button>
              )}
              <Button size="sm" className="bg-gradient-primary text-primary-foreground text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Points
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <main className="container mx-auto px-4 pt-36 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-gradient-primary">Swap</span> & Exchange
            </h1>
            <p className="text-muted-foreground">Premium refurbished gadgets, earned with your eco-contributions</p>
          </motion.div>

          {/* Active Filters Bar */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Active filters:</span>
                  {activeFilters.map((f, i) => (
                    <motion.button
                      key={f.label}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={f.onRemove}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs group hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      {f.label}
                      <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </motion.button>
                  ))}
                  <button
                    onClick={() => { setCategoryFilter("All"); setConditionFilter("All"); setPriceRange([0, showCash ? 600 : 6000]); setSearchQuery(""); }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full border-border/30"
            >
              <Search className="w-4 h-4 mr-2" /> Filters & Search
              {showMobileFilters ? <Minus className="w-4 h-4 ml-auto" /> : <Plus className="w-4 h-4 ml-auto" />}
            </Button>
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-4 rounded-xl glass-lg">
                    <FilterSidebar />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block w-64 flex-shrink-0"
            >
              <div className="sticky top-36 rounded-2xl glass-lg p-5 glass-border-gradient">
                <h3 className="text-sm font-bold mb-4 text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Filters
                </h3>
                <FilterSidebar />
              </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <motion.p
                  key={filteredItems.length}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  <span className="font-semibold text-foreground">{filteredItems.length}</span> products found
                </motion.p>
                <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg glass">
                  {[2, 3, 4].map((col) => (
                    <button
                      key={col}
                      onClick={() => setColumns(col)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${columns === col ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div ref={gridRef} className={`grid ${columnClasses[columns] || columnClasses[3]} gap-5`}>
                {filteredItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onQuickView={setQuickViewItem}
                    onSwap={handleSwap}
                    isWishlisted={wishlist.includes(item.id)}
                    onToggleWishlist={toggleWishlist}
                    isComparing={compareList.includes(item.id)}
                    onToggleCompare={toggleCompare}
                    showCash={showCash}
                  />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No products match your filters</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => { setCategoryFilter("All"); setConditionFilter("All"); setPriceRange([0, showCash ? 600 : 6000]); setSearchQuery(""); }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}

              {/* Transaction History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16"
              >
                <h2 className="text-2xl font-bold mb-6 text-foreground">Recent Transactions</h2>
                <div className="rounded-2xl glass-lg glass-border-gradient overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/20">
                          <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item</th>
                          <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cost</th>
                          <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                          <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockTransactions.map((t, i) => (
                          <motion.tr
                            key={t.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="border-b border-border/10 hover:bg-muted/20 transition-colors"
                          >
                            <td className="py-3 px-5 text-sm font-medium text-foreground">{t.itemName}</td>
                            <td className="py-3 px-5 text-sm text-primary font-semibold">
                              {t.pointsUsed > 0 ? `${t.pointsUsed.toLocaleString()} pts` : `$${t.cashUsed}`}
                            </td>
                            <td className="py-3 px-5 text-sm text-muted-foreground">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="py-3 px-5">
                              <Badge className={`text-xs ${t.status === "Completed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                                {t.status === "Completed" && <Check className="w-3 h-3 mr-1" />}
                                {t.status}
                              </Badge>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      <QuickViewModal
        item={quickViewItem}
        open={!!quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onSwap={handleSwap}
        showCash={showCash}
      />

      {/* Compare Modal */}
      <ComparisonModal
        items={swapItems.filter((i) => compareList.includes(i.id))}
        open={showCompare}
        onClose={() => setShowCompare(false)}
        showCash={showCash}
      />

      {/* Swap Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md glass-lg border-border/30">
          <DialogHeader>
            <DialogTitle>Confirm Swap</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl glass">
                {(() => { const Icon = selectedItem.icon; return <Icon className="w-10 h-10 text-primary" />; })()}
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{selectedItem.name}</h4>
                  <p className="text-xs text-muted-foreground">{selectedItem.condition}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={paymentMethod === "points" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("points")}
                  className={`h-auto py-4 flex flex-col gap-1 ${paymentMethod === "points" ? "bg-gradient-primary" : "border-border/30"}`}
                >
                  <span className="text-xs opacity-80">Points</span>
                  <span className="text-lg font-bold">{selectedItem.points.toLocaleString()}</span>
                </Button>
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className={`h-auto py-4 flex flex-col gap-1 ${paymentMethod === "cash" ? "bg-gradient-primary" : "border-border/30"}`}
                >
                  <span className="text-xs opacity-80">Cash</span>
                  <span className="text-lg font-bold">${selectedItem.cash}</span>
                </Button>
              </div>

              {paymentMethod === "points" && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Balance</span>
                    <span className="font-semibold text-foreground">{userPoints.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-semibold text-foreground">−{selectedItem.points.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-primary/10">
                    <span className="font-semibold text-foreground">Remaining</span>
                    <span className={`font-bold ${userPoints >= selectedItem.points ? "text-primary" : "text-destructive"}`}>
                      {(userPoints - selectedItem.points).toLocaleString()} pts
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border/30">
              Cancel
            </Button>
            <Button onClick={handleConfirmSwap} className="bg-gradient-primary text-primary-foreground">
              <Check className="w-4 h-4 mr-1" /> Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Swap;
