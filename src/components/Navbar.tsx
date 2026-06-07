import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, Coins, User, Home, ArrowLeftRight, BookOpen, Info, LayoutDashboard, Shield } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/swap", label: "Swap", icon: ArrowLeftRight },
  { to: "/awareness", label: "Learn", icon: BookOpen },
  { to: "/about", label: "About", icon: Info },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [points, setPoints] = useState(0);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole") || "user";

  // Animated points counter
  const targetPoints = 2450;
  useEffect(() => {
    if (!isAuthenticated) return;
    let current = 0;
    const step = Math.ceil(targetPoints / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, targetPoints);
      setPoints(current);
      if (current >= targetPoints) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    setScrolled(currentY > 20);
    setVisible(currentY < lastScrollY.current || currentY < 80);
    setScrollProgress(docHeight > 0 ? (currentY / docHeight) * 100 : 0);
    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-lg shadow-elevated"
            : "bg-transparent"
        }`}
      >
        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-primary transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

        {/* Bottom border gradient on scroll */}
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`}
          style={{ background: "var(--gradient-border)" }}
        />

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center relative"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-60 blur-lg transition-opacity duration-500" />
                <Leaf className="w-5 h-5 text-primary-foreground relative z-10" />
              </motion.div>
              <span className="text-xl font-bold text-gradient-primary tracking-tight">Triple G</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg group ${
                    isActive(to) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                  {/* Animated underline */}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gradient-primary transition-all duration-300 ${
                    isActive(to) ? "w-3/4" : "w-0 group-hover:w-1/2"
                  }`} />
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg group ${
                    isActive("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dashboard
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gradient-primary transition-all duration-300 ${
                    isActive("/dashboard") ? "w-3/4" : "w-0 group-hover:w-1/2"
                  }`} />
                </Link>
              )}
              {isAuthenticated && userRole === "admin" && (
                <Link
                  to="/admin"
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg group ${
                    isActive("/admin") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Admin
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gradient-primary transition-all duration-300 ${
                    isActive("/admin") ? "w-3/4" : "w-0 group-hover:w-1/2"
                  }`} />
                </Link>
              )}
            </div>

            {/* Tablet Navigation (icons only) */}
            <div className="hidden md:flex lg:hidden items-center gap-1">
              {NAV_LINKS.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  title={label}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${
                    isActive(to)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
              {isAuthenticated && (
                <Link to="/dashboard" title="Dashboard" className={`p-2.5 rounded-lg transition-all duration-300 ${isActive("/dashboard") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
              )}
              {isAuthenticated && userRole === "admin" && (
                <Link to="/admin" title="Admin" className={`p-2.5 rounded-lg transition-all duration-300 ${isActive("/admin") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  <Shield className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Points counter (authenticated) */}
              {isAuthenticated && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm font-semibold"
                >
                  <Coins className="w-4 h-4 text-accent" />
                  <span className="text-accent">{points.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs">pts</span>
                </motion.div>
              )}

              {/* User avatar (authenticated) */}
              {isAuthenticated && (
                <div className="hidden sm:block relative">
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse scale-125" />
                  <div className="relative w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              )}

              {/* Desktop auth buttons */}
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated ? (
                  <Button onClick={handleLogout} variant="outline" size="sm" className="border-border/50 hover:border-primary/50 transition-all">
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => navigate("/login")} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Login
                    </Button>
                    <Button onClick={() => navigate("/register")} size="sm" className="bg-gradient-primary hover:opacity-90 shadow-primary text-primary-foreground">
                      Register
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                className="md:hidden p-2 rounded-lg glass-hover"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 glass-lg flex flex-col pt-20 pb-8 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2 flex-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }, i) => (
                <motion.div
                  key={to}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  <Link
                    to={to}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-lg font-medium transition-all ${
                      isActive(to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                </motion.div>
              ))}
              {isAuthenticated && (
                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.28, duration: 0.3 }}>
                  <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-lg font-medium transition-all ${isActive("/dashboard") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                </motion.div>
              )}
              {isAuthenticated && userRole === "admin" && (
                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.3 }}>
                  <Link to="/admin" className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-lg font-medium transition-all ${isActive("/admin") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                    <Shield className="w-5 h-5" />
                    Admin
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile auth + points */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex flex-col gap-3 mt-auto"
            >
              {isAuthenticated && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl glass mb-2">
                  <Coins className="w-5 h-5 text-accent" />
                  <span className="text-accent font-bold text-lg">{points.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm">points</span>
                </div>
              )}
              {isAuthenticated ? (
                <Button onClick={handleLogout} variant="outline" className="w-full border-border/50">
                  Logout
                </Button>
              ) : (
                <>
                  <Button onClick={() => navigate("/login")} variant="outline" className="w-full border-border/50">
                    Login
                  </Button>
                  <Button onClick={() => navigate("/register")} className="w-full bg-gradient-primary text-primary-foreground shadow-primary">
                    Register
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
