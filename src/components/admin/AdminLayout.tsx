import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LayoutDashboard, Users, Smartphone, FileText, ShoppingBag, BarChart3, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminSearchModal from "./AdminSearchModal";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

const MOBILE_NAV = [
  { label: "Home", icon: LayoutDashboard, path: "/admin" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Gadgets", icon: Smartphone, path: "/admin/gadgets" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminLayout = ({ children, title, breadcrumbs }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);

  // Auth check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");
    if (!isAuthenticated || userRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((p) => !p);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const defaultBreadcrumbs = [
    { label: "Admin", path: "/admin" },
    { label: title },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-40 w-[250px] md:hidden"
            >
              <AdminSidebar
                collapsed={false}
                onToggle={() => setMobileMenuOpen(false)}
                onSearchOpen={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <motion.div
        animate={{ marginLeft: typeof window !== "undefined" && window.innerWidth >= 768 ? (sidebarCollapsed ? 70 : 250) : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen flex flex-col"
      >
        <AdminHeader
          breadcrumbs={breadcrumbs || defaultBreadcrumbs}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 p-4 lg:p-6 pb-24 md:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>

      {/* FAB */}
      <motion.button
        onClick={() => setShowFab(!showFab)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed right-5 bottom-20 md:bottom-6 z-40 w-12 h-12 rounded-full bg-gradient-primary shadow-primary flex items-center justify-center text-primary-foreground"
      >
        <motion.div animate={{ rotate: showFab ? 45 : 0 }}>
          <Plus className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showFab && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed right-5 bottom-36 md:bottom-20 z-40 flex flex-col gap-2"
          >
            {[
              { label: "New Gadget", icon: Smartphone, path: "/submit-gadget" },
              { label: "New Article", icon: FileText, path: "/admin/articles" },
              { label: "View Reports", icon: BarChart3, path: "/admin/reports" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.05, x: -4 }}
                  onClick={() => { navigate(item.path); setShowFab(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass-lg shadow-elevated text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden glass-lg border-t border-border/30">
        <div className="flex items-center justify-around py-2">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
                {active && (
                  <motion.div layoutId="mobileNav" className="w-4 h-0.5 rounded-full bg-primary mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search modal */}
      <AdminSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default AdminLayout;
