import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf, Target, Users, Heart, Globe, Zap, Shield, Recycle,
  ChevronRight, ExternalLink, Play, MapPin, TrendingUp,
  Award, Handshake, ArrowRight, Twitter, Linkedin, Github,
  Mail, Calendar, Star, Sparkles, ChevronLeft
} from "lucide-react";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

/* ───────────────────────── DATA ───────────────────────── */

const MISSION_WORDS = ["Sustainable", "Circular", "Responsible", "Regenerative", "Equitable"];

const TIMELINE_DATA = [
  { year: 2020, title: "The Spark", desc: "Founded in a garage with a vision to solve the e-waste crisis. First 100 gadgets collected.", milestone: "100 gadgets", icon: Sparkles },
  { year: 2021, title: "First Growth", desc: "Launched the reward points system and partnered with 5 local recycling centers.", milestone: "5 partners", icon: TrendingUp },
  { year: 2022, title: "Going Digital", desc: "Released the Triple G platform with swap marketplace and awareness hub.", milestone: "10K users", icon: Globe },
  { year: 2023, title: "National Reach", desc: "Expanded to 15 cities with mobile pickup service and corporate partnerships.", milestone: "15 cities", icon: MapPin },
  { year: 2024, title: "Impact Award", desc: "Won the Global Sustainability Innovation Award. 50K+ gadgets processed.", milestone: "50K gadgets", icon: Award },
  { year: 2025, title: "AI Integration", desc: "Launched AI-powered gadget valuation and automated sorting at partner facilities.", milestone: "AI launch", icon: Zap },
];

const TEAM_MEMBERS = [
  { name: "Sarah Johnson", role: "CEO & Founder", bio: "Former sustainability consultant with 15 years in green tech. Passionate about making e-waste management accessible to everyone.", department: "Leadership", social: { twitter: "#", linkedin: "#", email: "sarah@tripleg.eco" } },
  { name: "Michael Chen", role: "CTO", bio: "Full-stack engineer and AI researcher. Built scalable platforms at three startups before joining Triple G to tackle e-waste with technology.", department: "Engineering", social: { github: "#", linkedin: "#", email: "michael@tripleg.eco" } },
  { name: "Emma Rodriguez", role: "Head of Operations", bio: "Operations expert who streamlined logistics for Fortune 500 companies. Now optimizing e-waste collection routes across 15 cities.", department: "Operations", social: { linkedin: "#", email: "emma@tripleg.eco" } },
  { name: "David Kim", role: "Sustainability Director", bio: "Environmental scientist with a PhD in circular economy. Published 20+ papers on electronic waste reduction strategies.", department: "Leadership", social: { twitter: "#", linkedin: "#", email: "david@tripleg.eco" } },
  { name: "Aisha Patel", role: "Design Lead", bio: "Award-winning UX designer focused on making sustainability tools intuitive and engaging for all demographics.", department: "Engineering", social: { linkedin: "#", email: "aisha@tripleg.eco" } },
  { name: "James Okafor", role: "Community Manager", bio: "Built online communities of 100K+ members. Drives engagement through creative campaigns and educational content.", department: "Operations", social: { twitter: "#", linkedin: "#", email: "james@tripleg.eco" } },
];

const DEPARTMENTS = ["All", "Leadership", "Engineering", "Operations"];

const MAP_COUNTRIES = [
  { name: "USA", x: 22, y: 38, gadgets: 18500, users: 8200, growth: 24 },
  { name: "UK", x: 47, y: 30, gadgets: 9200, users: 4100, growth: 31 },
  { name: "Germany", x: 51, y: 32, gadgets: 7800, users: 3500, growth: 28 },
  { name: "India", x: 68, y: 45, gadgets: 12300, users: 6100, growth: 45 },
  { name: "Nigeria", x: 49, y: 52, gadgets: 5600, users: 2800, growth: 52 },
  { name: "Brazil", x: 30, y: 62, gadgets: 6400, users: 3200, growth: 38 },
  { name: "Japan", x: 82, y: 38, gadgets: 8900, users: 4500, growth: 19 },
  { name: "Australia", x: 82, y: 68, gadgets: 4200, users: 2100, growth: 22 },
];

const GROWTH_DATA = [
  { month: "Jan", gadgets: 2400, users: 1200 },
  { month: "Feb", gadgets: 3100, users: 1800 },
  { month: "Mar", gadgets: 4200, users: 2400 },
  { month: "Apr", gadgets: 5800, users: 3200 },
  { month: "May", gadgets: 7200, users: 4100 },
  { month: "Jun", gadgets: 9500, users: 5200 },
  { month: "Jul", gadgets: 11200, users: 6400 },
  { month: "Aug", gadgets: 14800, users: 7800 },
];

const VALUES_DATA = [
  { icon: Leaf, title: "Sustainability", front: "Every action we take considers its environmental impact. Zero-waste operations by 2026.", back: "We've reduced our operational carbon footprint by 78% since 2021. Our recycling partners maintain a 96% material recovery rate.", cta: "See Our Impact Report", color: "primary" },
  { icon: Shield, title: "Transparency", front: "Full traceability for every gadget — from collection to recycling or refurbishment.", back: "Every device gets a unique tracking ID. Users can see exactly where their gadget goes and how it's processed, in real-time.", cta: "Track a Gadget", color: "accent" },
  { icon: Zap, title: "Innovation", front: "AI-powered valuation, smart routing, and automated sorting drive our technology stack.", back: "Our ML models can identify 2,000+ device types in under 3 seconds with 98.5% accuracy. Route optimization saves 40% fuel costs.", cta: "Explore Our Tech", color: "primary" },
  { icon: Heart, title: "Community", front: "Rewarding responsible behavior through points, education, and collective impact tracking.", back: "Over 50K community members have earned rewards. 85% of users report increased awareness of e-waste after joining Triple G.", cta: "Join the Community", color: "accent" },
];

const PARTNERS = [
  { name: "EcoTech Solutions", tier: "platinum" },
  { name: "GreenCycle Inc", tier: "platinum" },
  { name: "CircularTech", tier: "gold" },
  { name: "ReNew Systems", tier: "gold" },
  { name: "EarthFirst Corp", tier: "silver" },
  { name: "CleanWave", tier: "silver" },
  { name: "SustainaByte", tier: "gold" },
  { name: "RecyclePro", tier: "silver" },
  { name: "GreenLoop", tier: "platinum" },
  { name: "EcoVault", tier: "gold" },
];

/* ───────────────────────── COMPONENTS ───────────────────────── */

const AnimCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let c = 0;
    const step = Math.ceil(end / 50);
    const iv = setInterval(() => { c = Math.min(c + step, end); setCount(c); if (c >= end) clearInterval(iv); }, 30);
    return () => clearInterval(iv);
  }, [inView, end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* Year flip digit */
const FlipDigit = ({ digit }: { digit: string }) => (
  <motion.span
    key={digit}
    initial={{ rotateX: -90, opacity: 0 }}
    animate={{ rotateX: 0, opacity: 1 }}
    exit={{ rotateX: 90, opacity: 0 }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    className="inline-block text-3xl md:text-5xl font-bold text-gradient-primary"
    style={{ perspective: "200px" }}
  >
    {digit}
  </motion.span>
);

/* Ripple pin for the map */
const MapPin2 = ({ country, onHover }: { country: typeof MAP_COUNTRIES[0]; onHover: (c: typeof MAP_COUNTRIES[0] | null) => void }) => (
  <motion.div
    className="absolute cursor-pointer"
    style={{ left: `${country.x}%`, top: `${country.y}%` }}
    onMouseEnter={() => onHover(country)}
    onMouseLeave={() => onHover(null)}
    whileHover={{ scale: 1.5 }}
  >
    <div className="relative">
      <div className="w-3 h-3 rounded-full bg-primary shadow-glow" />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/50"
        animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/30"
        animate={{ scale: [1, 3.5, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      />
    </div>
  </motion.div>
);

/* Team card with 3D flip */
const TeamCard = ({ member, index }: { member: typeof TEAM_MEMBERS[0]; index: number }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative h-[320px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute inset-0 glass rounded-2xl p-6 flex flex-col items-center justify-center text-center glass-border-gradient" style={{ backfaceVisibility: "hidden" }}>
          <div className="w-20 h-20 rounded-full bg-gradient-primary mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {member.name.split(" ").map(n => n[0]).join("")}
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
          <p className="text-sm text-primary">{member.role}</p>
          <Badge variant="outline" className="mt-3 border-border/50 text-muted-foreground text-xs">{member.department}</Badge>
        </div>
        {/* Back */}
        <div className="absolute inset-0 glass rounded-2xl p-6 flex flex-col justify-between glass-border-gradient" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">{member.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {member.social.twitter && (
              <motion.a href={member.social.twitter} whileHover={{ scale: 1.2 }} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-3.5 h-3.5" />
              </motion.a>
            )}
            {member.social.linkedin && (
              <motion.a href={member.social.linkedin} whileHover={{ scale: 1.2 }} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </motion.a>
            )}
            {member.social.github && (
              <motion.a href={member.social.github} whileHover={{ scale: 1.2 }} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-3.5 h-3.5" />
              </motion.a>
            )}
            {member.social.email && (
              <motion.a href={`mailto:${member.social.email}`} whileHover={{ scale: 1.2 }} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* Flippable value card */
const ValueCard = ({ value, index }: { value: typeof VALUES_DATA[0]; index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const Icon = value.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative h-[280px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center text-center glass-border-gradient" style={{ backfaceVisibility: "hidden" }}>
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.8 }}
            className={`w-16 h-16 rounded-2xl ${value.color === "primary" ? "bg-primary/10" : "bg-accent/10"} flex items-center justify-center mb-4`}
          >
            <Icon className={`w-8 h-8 ${value.color === "primary" ? "text-primary" : "text-accent"}`} />
          </motion.div>
          <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{value.front}</p>
          <p className="text-xs text-primary mt-3">Click to learn more →</p>
        </div>
        {/* Back */}
        <div className={`absolute inset-0 rounded-2xl p-8 flex flex-col justify-between ${value.color === "primary" ? "bg-primary/10 border border-primary/20" : "bg-accent/10 border border-accent/20"}`} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{value.back}</p>
          </div>
          <Button variant="outline" size="sm" className="mt-4 border-border/50 hover:border-primary/50 w-fit">
            {value.cta} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ───────────────────────── PAGE ───────────────────────── */

const About = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Word morph for mission
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setWordIdx(i => (i + 1) % MISSION_WORDS.length), 2500);
    return () => clearInterval(iv);
  }, []);

  // Timeline
  const [activeYear, setActiveYear] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Team filter
  const [deptFilter, setDeptFilter] = useState("All");
  const filteredTeam = deptFilter === "All" ? TEAM_MEMBERS : TEAM_MEMBERS.filter(m => m.department === deptFilter);

  // Map hover
  const [hoveredCountry, setHoveredCountry] = useState<typeof MAP_COUNTRIES[0] | null>(null);

  // Partner carousel
  const [partnerOffset, setPartnerOffset] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setPartnerOffset(o => o - 1), 30);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── HERO STORY ─── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient bg */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-hero opacity-20 animate-gradient-shift" style={{ backgroundSize: "200% 200%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          {/* Circuit pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="aboutCircuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="2" fill="currentColor" />
                <path d="M40 0V20M40 60V80M0 40H20M60 40H80" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <rect x="25" y="25" width="30" height="30" rx="4" stroke="currentColor" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#aboutCircuit)" />
          </svg>
          {/* Floating shapes */}
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [-20, 20, -20], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          {/* Video placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto mb-10 w-full max-w-2xl aspect-video rounded-2xl overflow-hidden glass-lg glass-border-gradient group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
              <motion.div whileHover={{ scale: 1.15 }} className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-primary">
                <Play className="w-7 h-7 text-primary-foreground ml-1" />
              </motion.div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <p className="text-sm text-foreground/80 font-medium">Watch Our Story</p>
              <p className="text-xs text-muted-foreground">How Triple G started — 2:30</p>
            </div>
          </motion.div>

          {/* Mission with word morph */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            Building a{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.5 }}
                className="text-gradient-primary inline-block"
              >
                {MISSION_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
            {" "}Future
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            We're on a mission to transform how the world handles electronic waste — 
            turning every old gadget into a step toward a healthier planet.
          </motion.p>

          {/* Stats reveal on scroll */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Gadgets Recycled", value: 52000, suffix: "+" },
              { label: "Active Users", value: 35000, suffix: "+" },
              { label: "Cities Covered", value: 15, suffix: "" },
              { label: "CO₂ Saved (tons)", value: 240, suffix: "t" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-xl p-4 text-center glass-border-gradient"
              >
                <div className="text-2xl md:text-3xl font-bold text-gradient-primary">
                  <AnimCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── TIMELINE JOURNEY ─── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="mb-3">Our Journey</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">From a small garage startup to a global e-waste movement.</p>
          </motion.div>

          {/* Year flip counter */}
          <div className="flex justify-center mb-10">
            <div className="glass rounded-2xl px-8 py-4 glass-border-gradient flex items-center gap-1">
              <AnimatePresence mode="popLayout">
                {String(TIMELINE_DATA[activeYear].year).split("").map((d, i) => (
                  <FlipDigit key={`${activeYear}-${i}`} digit={d} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Horizontal timeline */}
          <div className="relative" ref={timelineRef}>
            {/* Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-border/50 hidden md:block" />
            <motion.div
              className="absolute top-6 left-0 h-0.5 bg-gradient-primary hidden md:block"
              style={{ width: `${((activeYear) / (TIMELINE_DATA.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />

            <div className="flex flex-col md:flex-row gap-6 md:gap-0 md:justify-between relative">
              {TIMELINE_DATA.map((item, i) => {
                const Icon = item.icon;
                const isActive = i === activeYear;
                return (
                  <motion.div
                    key={item.year}
                    className="flex-1 cursor-pointer group"
                    onClick={() => setActiveYear(i)}
                    whileHover={{ y: -4 }}
                  >
                    {/* Dot */}
                    <div className="hidden md:flex justify-center mb-6">
                      <motion.div
                        animate={{ scale: isActive ? 1.3 : 1 }}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${isActive ? "bg-primary shadow-glow" : "bg-border group-hover:bg-primary/50"}`}
                      />
                    </div>
                    {/* Card */}
                    <motion.div
                      animate={{ opacity: 1 }}
                      className={`glass rounded-xl p-4 mx-1 transition-all duration-300 ${isActive ? "glass-border-gradient shadow-primary" : "opacity-60 hover:opacity-80"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-bold text-foreground">{item.year}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.desc}</p>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{item.milestone}</Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Nav arrows */}
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveYear(Math.max(0, activeYear - 1))}
                disabled={activeYear === 0}
                className="border-border/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveYear(Math.min(TIMELINE_DATA.length - 1, activeYear + 1))}
                disabled={activeYear === TIMELINE_DATA.length - 1}
                className="border-border/50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM SECTION ─── */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="mb-3">Meet the Team</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">The passionate people behind Triple G's mission to end e-waste.</p>
          </motion.div>

          {/* Department filter */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {DEPARTMENTS.map(dept => (
              <motion.button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  deptFilter === dept
                    ? "bg-primary text-primary-foreground shadow-primary"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {dept}
              </motion.button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredTeam.map((member, i) => (
                <TeamCard key={member.name} member={member} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ─── IMPACT MAP ─── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="mb-3">Global Impact</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Triple G's growing presence across the world.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="relative glass rounded-2xl p-6 aspect-[2/1] glass-border-gradient overflow-hidden">
                {/* Simplified world map outline */}
                <svg viewBox="0 0 100 70" className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] opacity-10">
                  <ellipse cx="50" cy="35" rx="45" ry="30" fill="none" stroke="currentColor" strokeWidth="0.3" />
                  <line x1="5" y1="35" x2="95" y2="35" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2,2" />
                  <line x1="50" y1="5" x2="50" y2="65" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2,2" />
                </svg>

                {/* Pins */}
                {MAP_COUNTRIES.map(c => (
                  <MapPin2 key={c.name} country={c} onHover={setHoveredCountry} />
                ))}

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredCountry && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-4 left-4 right-4 glass rounded-xl p-4 glass-border-gradient"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-foreground">{hoveredCountry.name}</h4>
                          <p className="text-xs text-muted-foreground">{hoveredCountry.gadgets.toLocaleString()} gadgets • {hoveredCountry.users.toLocaleString()} users</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20">+{hoveredCountry.growth}% growth</Badge>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Growth chart */}
            <div className="glass rounded-2xl p-6 glass-border-gradient">
              <h4 className="font-bold text-foreground mb-1">Growth Projection</h4>
              <p className="text-xs text-muted-foreground mb-4">Gadgets processed & users joined (2025)</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GROWTH_DATA}>
                    <defs>
                      <linearGradient id="gradGadgets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "hsl(220 40% 11%)", border: "1px solid hsl(220 20% 18%)", borderRadius: "8px", fontSize: "12px" }}
                      labelStyle={{ color: "hsl(210 20% 92%)" }}
                    />
                    <Area type="monotone" dataKey="gadgets" stroke="hsl(160 84% 39%)" fill="url(#gradGadgets)" strokeWidth={2} />
                    <Area type="monotone" dataKey="users" stroke="hsl(84 81% 44%)" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-primary rounded" /> Gadgets</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-accent rounded" style={{ borderTop: "1px dashed" }} /> Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUES CARDS ─── */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="mb-3">Our Values</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">The principles that guide everything we do. Click a card to explore.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {VALUES_DATA.map((v, i) => (
              <ValueCard key={v.title} value={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNERS SECTION ─── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="mb-3">Our Partners</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Trusted by leading organizations committed to sustainability.</p>
          </motion.div>

          {/* Infinite scroll carousel */}
          <div className="relative overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            
            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -(PARTNERS.length * 220)] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => {
                const tierColors: Record<string, string> = {
                  platinum: "border-primary/40 hover:border-primary",
                  gold: "border-accent/40 hover:border-accent",
                  silver: "border-border hover:border-muted-foreground",
                };
                const tierBadge: Record<string, string> = {
                  platinum: "bg-primary/10 text-primary border-primary/20",
                  gold: "bg-accent/10 text-accent border-accent/20",
                  silver: "bg-muted text-muted-foreground border-border",
                };
                return (
                  <motion.div
                    key={`${p.name}-${i}`}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className={`shrink-0 w-[200px] glass rounded-xl p-5 border transition-all duration-300 group cursor-pointer ${tierColors[p.tier]}`}
                  >
                    {/* Logo placeholder */}
                    <div className="w-12 h-12 rounded-lg bg-muted/50 mb-3 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                      <Handshake className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">{p.name}</h4>
                    <Badge variant="outline" className={`text-[10px] ${tierBadge[p.tier]}`}>
                      {p.tier.charAt(0).toUpperCase() + p.tier.slice(1)}
                    </Badge>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Partner CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <Card className="max-w-xl mx-auto glass rounded-2xl p-8 glass-border-gradient border-0">
              <h3 className="text-xl font-bold text-foreground mb-2">Become a Partner</h3>
              <p className="text-sm text-muted-foreground mb-5">Join our network of organizations making a real difference in e-waste management.</p>
              <Button className="bg-gradient-primary text-primary-foreground shadow-primary">
                <Handshake className="w-4 h-4 mr-2" />
                Partner With Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-lg rounded-3xl p-10 md:p-16 text-center max-w-3xl mx-auto glass-border-gradient relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-hero opacity-10 animate-gradient-shift" style={{ backgroundSize: "200% 200%" }} />
            <div className="relative z-10">
              <h2 className="mb-4">Join Our Mission</h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Together, we can transform how the world handles electronic waste. Every gadget counts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate("/submit-gadget")} className="bg-gradient-primary text-primary-foreground shadow-primary">
                  Submit a Gadget <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={() => navigate("/awareness")} variant="outline" className="border-border/50 hover:border-primary/50">
                  Learn About E-Waste
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
