import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Recycle, Award, TrendingUp, Users, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import ProductShowcase from "@/components/ProductShowcase";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Testimonials */}
      <Testimonials />

      {/* Features Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/50" />
        <div className="absolute inset-0 bg-gradient-radial opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="mb-4">Why Choose <span className="text-gradient-primary">Triple G</span>?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We make e-waste management rewarding and sustainable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: TrendingUp, title: "Smart Evaluation", desc: "AI-powered condition assessment for fair and accurate device valuation", color: "text-primary" },
              { icon: Award, title: "Multiple Rewards", desc: "Choose between cash, carbon credits, or exchange for refurbished items", color: "text-accent" },
              { icon: Recycle, title: "Circular Economy", desc: "Devices are responsibly recycled or refurbished for extended life", color: "text-primary" },
              { icon: Users, title: "Community Hub", desc: "Join thousands of users committed to sustainable electronics disposal", color: "text-accent" },
              { icon: Leaf, title: "Environmental Impact", desc: "Track your carbon footprint reduction and environmental contribution", color: "text-primary" },
              { icon: Heart, title: "Education Hub", desc: "Access resources and learn about responsible e-waste management", color: "text-accent" },
            ].map((feature, i) => (
              <Card key={feature.title} className="glass-lg glass-border-gradient glass-hover p-6 border-0 group">
                <feature.icon className={`w-10 h-10 ${feature.color} mb-4 transition-transform duration-300 group-hover:scale-110`} />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10 animate-gradient-shift" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto glass-lg rounded-3xl p-12 text-center glass-border-gradient shadow-glow">
            <h2 className="mb-6">
              Ready to Make a <span className="text-gradient-primary">Difference</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Triple G today and start earning rewards while contributing to a sustainable future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-lg h-14 px-8 shadow-primary"
                onClick={() => navigate("/register")}
              >
                Get Started Free
              </Button>
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
