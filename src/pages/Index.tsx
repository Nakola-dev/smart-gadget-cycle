import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Leaf, 
  Recycle, 
  Award, 
  TrendingUp, 
  Users, 
  Smartphone,
  DollarSign,
  BarChart3,
  Heart
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">Sustainable E-Waste Management</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Turn Your Old <span className="text-gradient-primary">Gadgets</span> Into Rewards
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Triple G and help create a circular economy. Submit your e-waste, earn rewards, and contribute to a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-lg h-14 px-8 shadow-primary"
                onClick={() => navigate("/submit-gadget")}
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Submit Gadget
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg h-14 px-8"
                onClick={() => navigate("/awareness")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center shadow-card hover:shadow-primary transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={15420} suffix="+" />
              </div>
              <p className="text-muted-foreground">Gadgets Recycled</p>
            </Card>
            
            <Card className="p-8 text-center shadow-card hover:shadow-primary transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-4xl font-bold text-secondary mb-2">
                <AnimatedCounter end={98500} suffix="+" />
              </div>
              <p className="text-muted-foreground">Credits Earned</p>
            </Card>
            
            <Card className="p-8 text-center shadow-card hover:shadow-primary transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <div className="text-4xl font-bold text-accent mb-2">
                <AnimatedCounter end={5230} suffix="+" />
              </div>
              <p className="text-muted-foreground">Active Users</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to turn your e-waste into valuable rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-primary">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">1. Submit</h3>
              <p className="text-muted-foreground">
                List your old or damaged electronic devices with photos and condition details
              </p>
            </div>

            <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-primary">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">2. Evaluate</h3>
              <p className="text-muted-foreground">
                Our system automatically evaluates your device and calculates reward points
              </p>
            </div>

            <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-primary">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">3. Earn</h3>
              <p className="text-muted-foreground">
                Receive monetary rewards, carbon credits, or exchange for refurbished devices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Triple G?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make e-waste management rewarding and sustainable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 shadow-card hover:shadow-primary transition-all hover:-translate-y-1">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Smart Evaluation</h3>
              <p className="text-muted-foreground">
                AI-powered condition assessment for fair and accurate device valuation
              </p>
            </Card>

            <Card className="p-6 shadow-card hover:shadow-primary transition-all hover:-translate-y-1">
              <Award className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Multiple Rewards</h3>
              <p className="text-muted-foreground">
                Choose between cash, carbon credits, or exchange for refurbished items
              </p>
            </Card>

            <Card className="p-6 shadow-card hover:shadow-primary transition-all hover:-translate-y-1">
              <Recycle className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2">Circular Economy</h3>
              <p className="text-muted-foreground">
                Devices are responsibly recycled or refurbished for extended life
              </p>
            </Card>

            <Card className="p-6 shadow-card hover:shadow-primary transition-all hover:-translate-y-1">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Community Hub</h3>
              <p className="text-muted-foreground">
                Join thousands of users committed to sustainable electronics disposal
              </p>
            </Card>

            <Card className="p-6 shadow-card hover:shadow-primary transition-all hover:-translate-y-1">
              <Leaf className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Environmental Impact</h3>
              <p className="text-muted-foreground">
                Track your carbon footprint reduction and environmental contribution
              </p>
            </Card>

            <Card className="p-6 shadow-card hover:shadow-primary transition-all hover:-translate-y-1">
              <Heart className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2">Education Hub</h3>
              <p className="text-muted-foreground">
                Access resources and learn about responsible e-waste management
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-4xl mx-auto p-12 text-center shadow-primary">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Triple G today and start earning rewards while contributing to a sustainable future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-lg h-14 px-8"
                onClick={() => navigate("/register")}
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg h-14 px-8"
                onClick={() => navigate("/submit-gadget")}
              >
                Submit Your First Gadget
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
