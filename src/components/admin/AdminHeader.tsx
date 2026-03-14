import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Plus, Download, RefreshCw, ChevronDown, Globe, Menu,
  Wifi, Database, Zap, Check, X, Clock, User, LogOut, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  breadcrumbs: { label: string; path?: string }[];
  onMenuToggle: () => void;
}

const STATUS_ITEMS = [
  { label: "API", icon: Zap, status: "healthy" as const },
  { label: "DB", icon: Database, status: "healthy" as const },
  { label: "Live", icon: Wifi, status: "healthy" as const },
];

const NOTIFICATIONS = [
  { id: 1, title: "New gadget submission", desc: "iPhone 14 Pro submitted for review", time: "2m ago", read: false },
  { id: 2, title: "User milestone", desc: "User #4521 reached 5000 points", time: "15m ago", read: false },
  { id: 3, title: "Payout completed", desc: "Batch #12 processed successfully", time: "1h ago", read: true },
  { id: 4, title: "System update", desc: "v2.4.1 deployed successfully", time: "3h ago", read: true },
  { id: 5, title: "New feedback", desc: "5 new feedback entries received", time: "5h ago", read: true },
];

const TIMEZONES = [
  { label: "UTC", offset: "+0:00", city: "London" },
  { label: "EST", offset: "-5:00", city: "New York" },
  { label: "PST", offset: "-8:00", city: "San Francisco" },
  { label: "JST", offset: "+9:00", city: "Tokyo" },
];

type AdminStatus = "online" | "away" | "busy";

const AdminHeader = ({ breadcrumbs, onMenuToggle }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTimezone, setShowTimezone] = useState(false);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("online");
  const [selectedTz, setSelectedTz] = useState(TIMEZONES[0]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const tzRef = useRef<HTMLDivElement>(null);

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  const statusColor: Record<AdminStatus, string> = {
    online: "bg-primary",
    away: "bg-accent",
    busy: "bg-destructive",
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (tzRef.current && !tzRef.current.contains(e.target as Node)) setShowTimezone(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border/30 glass-sm sticky top-0 z-30">
      {/* Left: mobile menu + breadcrumbs */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/40">/</span>}
              {crumb.path ? (
                <button
                  onClick={() => navigate(crumb.path!)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* System status */}
        <div className="hidden lg:flex items-center gap-1.5 mr-2">
          {STATUS_ITEMS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-muted-foreground glass-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
                <Icon className="w-3 h-3" />
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Environment badge */}
        <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30">
          Dev
        </span>

        {/* Quick actions */}
        <div className="hidden sm:flex items-center gap-1">
          <Button size="icon" variant="ghost" className="w-8 h-8 text-muted-foreground hover:text-foreground">
            <Plus className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="w-8 h-8 text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="w-8 h-8 text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Timezone */}
        <div ref={tzRef} className="relative hidden lg:block">
          <button
            onClick={() => setShowTimezone(!showTimezone)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{selectedTz.label}</span>
          </button>
          <AnimatePresence>
            {showTimezone && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl glass-lg border border-border/50 shadow-elevated overflow-hidden p-1.5 z-50"
              >
                {TIMEZONES.map((tz) => (
                  <button
                    key={tz.label}
                    onClick={() => { setSelectedTz(tz); setShowTimezone(false); }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedTz.label === tz.label ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{tz.city}</span>
                    <span className="text-xs opacity-60">{tz.offset}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Bell className="w-4.5 h-4.5 text-muted-foreground" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold animate-glow-pulse"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-xl glass-lg border border-border/50 shadow-elevated overflow-hidden z-50"
              >
                <div className="p-3 border-b border-border/30 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  <span className="text-[11px] text-primary cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "px-3 py-2.5 border-b border-border/10 hover:bg-muted/30 transition-colors cursor-pointer",
                        !n.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />}
                        <div className={cn(!n.read ? "" : "ml-4")}>
                          <p className="text-sm font-medium text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                          <p className="text-[11px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {n.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                A
              </div>
              <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card", statusColor[adminStatus])} />
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-xl glass-lg border border-border/50 shadow-elevated overflow-hidden z-50"
              >
                <div className="p-3 border-b border-border/30">
                  <p className="text-sm font-semibold text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@ecorecycle.com</p>
                </div>
                <div className="p-1.5">
                  <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-muted-foreground/50">Status</p>
                  {(["online", "away", "busy"] as AdminStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setAdminStatus(s)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                        adminStatus === s ? "bg-muted/50 text-foreground" : "text-muted-foreground hover:bg-muted/30"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full", statusColor[s])} />
                      <span className="capitalize">{s}</span>
                      {adminStatus === s && <Check className="w-3 h-3 ml-auto text-primary" />}
                    </button>
                  ))}
                </div>
                <div className="border-t border-border/30 p-1.5">
                  <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted/30 transition-colors">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("isAuthenticated");
                      localStorage.removeItem("userRole");
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
