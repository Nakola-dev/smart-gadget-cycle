import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BarChart3, FileBarChart, Smartphone, Users, FileText,
  ShoppingBag, CreditCard, Package, Wallet, Settings, UserCircle, Shield,
  UsersRound, TicketCheck, MessageSquare, Megaphone, ChevronLeft, ChevronRight,
  Star, Clock, Search, Command, Bookmark, X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Core",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
      { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
      { label: "Reports", icon: FileBarChart, path: "/admin/reports" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Gadgets", icon: Smartphone, path: "/admin/gadgets", badge: 12 },
      { label: "Users", icon: Users, path: "/admin/users" },
      { label: "Articles", icon: FileText, path: "/admin/articles", badge: 3 },
      { label: "Swaps", icon: ShoppingBag, path: "/admin/swaps" },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Transactions", icon: CreditCard, path: "/admin/transactions" },
      { label: "Orders", icon: Package, path: "/admin/orders", badge: 5 },
      { label: "Payouts", icon: Wallet, path: "/admin/payouts" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "System", icon: Settings, path: "/admin/settings" },
      { label: "Profile", icon: UserCircle, path: "/admin/profile" },
      { label: "Security", icon: Shield, path: "/admin/security" },
      { label: "Team", icon: UsersRound, path: "/admin/team" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Tickets", icon: TicketCheck, path: "/admin/tickets", badge: 8 },
      { label: "Feedback", icon: MessageSquare, path: "/admin/feedback" },
      { label: "Announcements", icon: Megaphone, path: "/admin/announcements" },
    ],
  },
];

const RECENT_ITEMS = [
  { label: "User #4521", path: "/admin/users", icon: Users },
  { label: "iPhone 14 Review", path: "/admin/gadgets", icon: Smartphone },
  { label: "Payout Batch #12", path: "/admin/payouts", icon: Wallet },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onSearchOpen: () => void;
}

const AdminSidebar = ({ collapsed, onToggle, onSearchOpen }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<string[]>(["/admin", "/admin/users"]);
  const [expandedSections, setExpandedSections] = useState<string[]>(
    NAV_SECTIONS.map((s) => s.title)
  );

  const isActive = (path?: string) => path && location.pathname === path;

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const toggleBookmark = (path: string) => {
    setBookmarks((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 70 : 250 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col glass-lg border-r border-border/50 overflow-hidden"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border/30">
        <motion.div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-foreground whitespace-nowrap"
              >
                EcoAdmin
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Search shortcut */}
      <div className="px-3 py-3 border-b border-border/20">
        <button
          onClick={onSearchOpen}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground text-sm",
            "glass-hover cursor-pointer transition-all duration-200",
            collapsed && "justify-center px-2"
          )}
        >
          <Search className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Search...</span>
              <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Nav sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-1">
            {!collapsed && (
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center px-4 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                <span>{section.title}</span>
                <motion.div
                  animate={{ rotate: expandedSections.includes(section.title) ? 0 : -90 }}
                  className="ml-auto"
                >
                  <ChevronLeft className="w-3 h-3" />
                </motion.div>
              </button>
            )}

            <AnimatePresence initial={false}>
              {(collapsed || expandedSections.includes(section.title)) && (
                <motion.div
                  initial={collapsed ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <motion.button
                        key={item.label}
                        onClick={() => item.path && navigate(item.path)}
                        whileHover={{ x: collapsed ? 0 : 4 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "group w-full flex items-center gap-3 px-4 py-2 mx-2 my-0.5 rounded-lg text-sm transition-all duration-200 relative",
                          collapsed && "justify-center mx-1 px-2",
                          active
                            ? "bg-primary/15 text-primary shadow-[inset_0_0_20px_hsl(var(--primary)/0.1)]"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {/* Active glow indicator */}
                        {active && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-primary"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}

                        <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", active && "text-primary")} />

                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                            {item.badge && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-primary/20 text-primary text-[11px] font-medium px-1.5 animate-glow-pulse"
                              >
                                {item.badge}
                              </motion.span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                item.path && toggleBookmark(item.path);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Bookmark
                                className={cn(
                                  "w-3.5 h-3.5",
                                  item.path && bookmarks.includes(item.path)
                                    ? "text-primary fill-primary"
                                    : "text-muted-foreground"
                                )}
                              />
                            </button>
                          </>
                        )}

                        {/* Tooltip for collapsed */}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-elevated">
                            {item.label}
                            {item.badge && (
                              <span className="ml-1.5 text-primary">({item.badge})</span>
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Recent items */}
        {!collapsed && (
          <div className="mt-4 px-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 mb-2 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Recent
            </p>
            {RECENT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-border/30 p-3">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
