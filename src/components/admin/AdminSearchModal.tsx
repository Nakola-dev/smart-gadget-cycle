import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, LayoutDashboard, Users, Smartphone, FileText, ShoppingBag,
  CreditCard, Settings, TicketCheck, X, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const SEARCH_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, category: "Pages" },
  { label: "Users", path: "/admin/users", icon: Users, category: "Pages" },
  { label: "Gadgets", path: "/admin/gadgets", icon: Smartphone, category: "Pages" },
  { label: "Articles", path: "/admin/articles", icon: FileText, category: "Pages" },
  { label: "Swaps", path: "/admin/swaps", icon: ShoppingBag, category: "Pages" },
  { label: "Transactions", path: "/admin/transactions", icon: CreditCard, category: "Pages" },
  { label: "Settings", path: "/admin/settings", icon: Settings, category: "Pages" },
  { label: "Support Tickets", path: "/admin/tickets", icon: TicketCheck, category: "Pages" },
  { label: "Create new user", path: "/admin/users", icon: Users, category: "Actions" },
  { label: "Export report", path: "/admin/reports", icon: FileText, category: "Actions" },
  { label: "Review gadgets", path: "/admin/gadgets", icon: Smartphone, category: "Actions" },
];

interface AdminSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const AdminSearchModal = ({ open, onClose }: AdminSearchModalProps) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = query
    ? SEARCH_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS;

  const grouped = filtered.reduce<Record<string, typeof SEARCH_ITEMS>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) onClose(); // parent toggles
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex].path);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl glass-lg border border-border/50 shadow-elevated overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, actions..."
                className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/50"
              />
              <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">ESC</kbd>
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground/50 px-2 py-1.5">{cat}</p>
                  {items.map((item) => {
                    const Icon = item.icon;
                    const globalIdx = filtered.indexOf(item);
                    return (
                      <button
                        key={item.label + item.category}
                        onClick={() => handleSelect(item.path)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          globalIdx === selectedIndex
                            ? "bg-primary/15 text-primary"
                            : "text-muted-foreground hover:bg-muted/30"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {globalIdx === selectedIndex && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No results found</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminSearchModal;
