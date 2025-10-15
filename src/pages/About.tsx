import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Leaf, Target, Users, Heart } from "lucide-react";

const teamMembers = [
  { name: "Sarah Johnson", title: "CEO & Founder" },
  { name: "Michael Chen", title: "CTO" },
  { name: "Emma Rodriguez", title: "Head of Operations" },
  { name: "David Kim", title: "Sustainability Director" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">About Triple G</h1>
            <p className="text-xl text-muted-foreground">
              Building a sustainable future through smart e-waste management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 shadow-card">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To revolutionize e-waste management by creating a circular economy where technology waste becomes a valuable resource, rewarding responsible disposal while protecting our planet.
              </p>
            </Card>

            <Card className="p-8 shadow-card">
              <Leaf className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
              <p className="text-muted-foreground">
                A world where every electronic device is responsibly recycled or refurbished, minimizing environmental impact while maximizing value for communities and individuals.
              </p>
            </Card>

            <Card className="p-8 shadow-card">
              <Users className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-2xl font-bold mb-3">Our Community</h3>
              <p className="text-muted-foreground">
                Join thousands of environmentally conscious individuals and organizations committed to sustainable technology practices and reducing electronic waste worldwide.
              </p>
            </Card>

            <Card className="p-8 shadow-card">
              <Heart className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Our Values</h3>
              <p className="text-muted-foreground">
                Sustainability, transparency, innovation, and community. We believe in making e-waste management accessible, rewarding, and environmentally responsible for everyone.
              </p>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6 text-center shadow-card hover:shadow-primary transition-shadow">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.title}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-12 text-center bg-gradient-hero shadow-primary">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Together, we can make a difference in reducing e-waste and building a more sustainable future for generations to come.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
