import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole") || "user";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-primary">Triple G</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/awareness" className="text-foreground hover:text-primary transition-colors">
              Learn
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                {userRole === "admin" && (
                  <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} variant="ghost">
                  Login
                </Button>
                <Button onClick={() => navigate("/register")} className="bg-gradient-primary hover:opacity-90">
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/awareness"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                Learn
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                About
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                  {userRole === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
              <div className="flex flex-col gap-2 px-4 pt-2">
                {isAuthenticated ? (
                  <Button onClick={handleLogout} variant="outline" className="w-full">
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => { navigate("/login"); setIsMenuOpen(false); }} variant="outline" className="w-full">
                      Login
                    </Button>
                    <Button onClick={() => { navigate("/register"); setIsMenuOpen(false); }} className="w-full bg-gradient-primary">
                      Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
