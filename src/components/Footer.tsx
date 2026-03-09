import { Link } from "react-router-dom";
import { Leaf, Mail, MapPin, Phone, Send, Recycle, TreePine, Zap, Github, Twitter, Linkedin, Instagram, ChevronDown } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = Math.ceil(end / (duration / 30));
    const interval = setInterval(() => {
      current = Math.min(current + step, end);
      setCount(current);
      if (current >= end) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const SOCIAL_LINKS = [
  { icon: Twitter, href: "#", label: "Twitter", hoverColor: "hover:text-[hsl(200,90%,55%)]" },
  { icon: Github, href: "#", label: "GitHub", hoverColor: "hover:text-foreground" },
  { icon: Linkedin, href: "#", label: "LinkedIn", hoverColor: "hover:text-[hsl(210,80%,55%)]" },
  { icon: Instagram, href: "#", label: "Instagram", hoverColor: "hover:text-[hsl(330,70%,60%)]" },
];

const IMPACT_STATS = [
  { icon: Recycle, label: "Gadgets Recycled Today", value: 847, suffix: "+" },
  { icon: TreePine, label: "CO₂ Saved (kg)", value: 3200, suffix: "kg" },
  { icon: Zap, label: "Active Users", value: 12400, suffix: "+" },
];

const FOOTER_SECTIONS = [
  {
    title: "Quick Links",
    links: [
      { to: "/", label: "Home" },
      { to: "/submit-gadget", label: "Submit Gadget" },
      { to: "/swap", label: "Swap Center" },
      { to: "/awareness", label: "Learn More" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/map", label: "Find Pickup" },
    ],
  },
  {
    title: "Contact",
    contact: [
      { icon: Mail, text: "info@tripleg.eco" },
      { icon: Phone, text: "+1 (555) 123-4567" },
      { icon: MapPin, text: "123 Green Street, Eco City" },
    ],
  },
];

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden border-b border-border/30 last:border-b-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-4 text-left">
        <span className="font-semibold text-foreground">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const inView = useInView(footerRef, { once: true, margin: "-50px" });
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Subscribed! Welcome to the Triple G community 🌱");
      setEmail("");
      setSubmitting(false);
    }, 800);
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
  };

  return (
    <footer ref={footerRef} className="relative mt-20 overflow-hidden">
      {/* SVG e-waste pattern background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="currentColor" />
              <path d="M30 0 V15 M30 45 V60 M0 30 H15 M45 30 H60" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <rect x="20" y="20" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-[15%] w-3 h-3 rounded-full bg-primary/20 blur-sm hidden lg:block"
      />
      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 left-[10%] w-2 h-2 rounded-full bg-accent/20 blur-sm hidden lg:block"
      />

      {/* Impact counter strip */}
      <div className="relative border-y border-border/30">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {IMPACT_STATS.map(({ icon: Icon, label, value, suffix }) => (
              <div key={label} className="flex items-center gap-3 text-center">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-foreground">
                    <AnimatedCounter end={value} suffix={suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative container mx-auto px-4 py-12 lg:py-16"
      >
        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand + Newsletter */}
          <motion.div variants={fadeUp} className="lg:col-span-1 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500" />
                <Leaf className="w-5 h-5 text-primary-foreground relative z-10" />
              </motion.div>
              <span className="text-xl font-bold text-gradient-primary">Triple G</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Smart E-Waste Management & Reward System. Building a sustainable future, one gadget at a time.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverColor }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground transition-colors duration-300 ${hoverColor}`}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map((section) => (
            <motion.div key={section.title} variants={fadeUp}>
              <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">{section.title}</h4>
              {section.links && (
                <div className="space-y-2.5">
                  {section.links.map(({ to, label }) => (
                    <Link key={to} to={to} className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                      {label}
                    </Link>
                  ))}
                </div>
              )}
              {section.contact && (
                <div className="space-y-3">
                  {section.contact.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground group">
                      <Icon className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:text-foreground transition-colors">{text}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile collapsible sections */}
        <div className="md:hidden space-y-0">
          {/* Brand */}
          <div className="pb-6">
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">Triple G</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">Smart E-Waste Management & Reward System.</p>
            <div className="flex items-center gap-3 mt-4">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverColor }) => (
                <a key={label} href={href} aria-label={label} className={`w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground transition-colors duration-300 ${hoverColor}`}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <CollapsibleSection key={section.title} title={section.title}>
              {section.links && (
                <div className="space-y-3">
                  {section.links.map(({ to, label }) => (
                    <Link key={to} to={to} className="block text-sm text-muted-foreground hover:text-primary py-1 transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              )}
              {section.contact && (
                <div className="space-y-3">
                  {section.contact.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>
          ))}
        </div>

        {/* Newsletter section */}
        <motion.div variants={fadeUp} className="mt-10 lg:mt-14">
          <div className="glass rounded-2xl p-6 md:p-8 max-w-xl mx-auto text-center glass-border-gradient">
            <h4 className="font-semibold text-foreground mb-1">Stay in the loop 🌱</h4>
            <p className="text-sm text-muted-foreground mb-4">Get eco-tips and Triple G updates delivered to your inbox.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/50"
              />
              <Button type="submit" disabled={submitting} className="bg-gradient-primary text-primary-foreground shadow-primary shrink-0">
                <motion.div animate={submitting ? { rotate: 360 } : {}} transition={{ duration: 0.6, repeat: submitting ? Infinity : 0 }}>
                  <Send className="w-4 h-4" />
                </motion.div>
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Triple G. All rights reserved.</p>
          <p>Building a sustainable future together 🌍</p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
