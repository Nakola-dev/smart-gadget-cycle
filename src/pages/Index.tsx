import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Recycle, Award, TrendingUp, Users, Heart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import ProductShowcase from "@/components/ProductShowcase";
import Testimonials from "@/components/Testimonials";
import {
  ScrollReveal,
  ParallaxLayer,
  DepthLayers,
  SectionTransition,
  StickyScrollIndicator,
  BackToTop,
  ParallaxParticles,
} from "@/components/ui/parallax";
import { TiltCard } from "@/components/ui/gestures";
import { LiquidButton } from "@/components/ui/interactive-button";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "stats", label: "Impact" },
  { id: "how-it-works", label: "How It Works" },
  { id: "showcase", label: "Showcase" },
  { id: "testimonials", label: "Reviews" },
  { id: "features", label: "Features" },
  { id: "cta", label: "Get Started" },
];

const FEATURES = [
  { icon: TrendingUp, title: "Smart Evaluation", desc: "AI-powered condition assessment for fair and accurate device valuation", color: "text-primary" },
  { icon: Award, title: "Multiple Rewards", desc: "Choose between cash, carbon credits, or exchange for refurbished items", color: "text-accent" },
  { icon: Recycle, title: "Circular Economy", desc: "Devices are responsibly recycled or refurbished for extended life", color: "text-primary" },
  { icon: Users, title: "Community Hub", desc: "Join thousands of users committed to sustainable electronics disposal", color: "text-accent" },
  { icon: Leaf, title: "Environmental Impact", desc: "Track your carbon footprint reduction and environmental contribution", color: "text-primary" },
  { icon: Heart, title: "Education Hub", desc: "Access resources and learn about responsible e-waste management", color: "text-accent" },
];

const Index = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef });

  // Global parallax values for floating background elements
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);

  return (
    <div ref={pageRef} className="min-h-screen relative scroll-snap-y">
      <Navbar />
      <StickyScrollIndicator sections={SECTIONS} />
      <BackToTop />

      {/* Global floating parallax background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-primary/[0.02] blur-3xl"
          style={{ rotate: bgRotate, scale: bgScale }}
        />
        <motion.div
          className="absolute -bottom-1/3 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-accent/[0.02] blur-3xl"
          style={{
            rotate: useTransform(scrollYProgress, [0, 1], [360, 0]),
          }}
        />
      </div>

      {/* Hero */}
      <div id="hero" className="scroll-snap-section relative z-10">
        <HeroSection />
      </div>

      {/* Wave transition */}
      <SectionTransition variant="wave" className="relative z-10" />

      {/* Stats */}
      <div id="stats" className="scroll-snap-section relative z-10">
        <DepthLayers
          background={
            <>
              <div className="absolute inset-0 bg-gradient-radial opacity-40" />
              <ParallaxParticles count={15} />
            </>
          }
        >
          <StatsSection />
        </DepthLayers>
      </div>

      <SectionTransition variant="curve" className="relative z-10" />

      {/* How It Works */}
      <div id="how-it-works" className="scroll-snap-section relative z-10">
        <ParallaxLayer speed={-0.1}>
          <HowItWorks />
        </ParallaxLayer>
      </div>

      <SectionTransition variant="blob" className="relative z-10" />

      {/* Product Showcase */}
      <div id="showcase" className="scroll-snap-section relative z-10">
        <DepthLayers
          background={
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/[0.04] blur-3xl"
                animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          }
        >
          <ProductShowcase />
        </DepthLayers>
      </div>

      <SectionTransition variant="slant" className="relative z-10" />

      {/* Testimonials */}
      <div id="testimonials" className="scroll-snap-section relative z-10">
        <ParallaxLayer speed={0.15}>
          <Testimonials />
        </ParallaxLayer>
      </div>

      <SectionTransition variant="wave" className="relative z-10" />

      {/* Features Section */}
      <section id="features" className="scroll-snap-section py-20 md:py-28 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-muted/50" />
        <div className="absolute inset-0 bg-gradient-radial opacity-20" />
        <ParallaxParticles count={12} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <h2 className="mb-4">Why Choose <span className="text-gradient-primary">Triple G</span>?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We make e-waste management rewarding and sustainable
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((feature, i) => (
              <ScrollReveal
                key={feature.title}
                delay={i * 0.1}
                direction={i % 2 === 0 ? "up" : "left"}
              >
                <TiltCard maxTilt={8} className="h-full">
                  <Card className="glass-lg glass-border-gradient glass-hover p-6 border-0 group h-full">
                    <feature.icon className={`w-10 h-10 ${feature.color} mb-4 transition-transform duration-300 group-hover:scale-110`} />
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </Card>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="scroll-snap-section py-20 md:py-28 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-hero opacity-10 animate-gradient-shift" />
        <ParallaxParticles count={10} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto glass-lg rounded-3xl p-12 text-center glass-border-gradient shadow-glow">
              <ParallaxLayer speed={0.2}>
                <h2 className="mb-6">
                  Ready to Make a <span className="text-gradient-primary">Difference</span>?
                </h2>
              </ParallaxLayer>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join Triple G today and start earning rewards while contributing to a sustainable future
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidButton
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-lg h-14 px-8 shadow-primary"
                  onClick={() => navigate("/register")}
                >
                  Get Started Free
                </LiquidButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg h-14 px-8 glass border-primary/20"
                  onClick={() => navigate("/submit-gadget")}
                >
                  Submit Your First Gadget
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
