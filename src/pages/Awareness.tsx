import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Recycle, AlertTriangle, Lightbulb } from "lucide-react";
import { useState } from "react";

const articles = [
  {
    id: 1,
    title: "What is E-Waste?",
    category: "Basics",
    icon: BookOpen,
    excerpt: "Learn about electronic waste, its impact on the environment, and why proper disposal is crucial for our planet's future.",
    color: "primary"
  },
  {
    id: 2,
    title: "The Environmental Impact",
    category: "Impact",
    icon: AlertTriangle,
    excerpt: "Discover how improper e-waste disposal affects our ecosystem, groundwater, and contributes to climate change.",
    color: "destructive"
  },
  {
    id: 3,
    title: "Recycling Best Practices",
    category: "How-To",
    icon: Recycle,
    excerpt: "Step-by-step guide on how to properly prepare your electronics for recycling and maximize their environmental benefit.",
    color: "secondary"
  },
  {
    id: 4,
    title: "E-Waste Statistics 2025",
    category: "Data",
    icon: Lightbulb,
    excerpt: "Eye-opening statistics about global e-waste generation, recycling rates, and the growing challenge we face.",
    color: "accent"
  },
];

const Awareness = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">E-Waste Education Hub</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn about electronic waste, its environmental impact, and how you can make a difference
            </p>
          </div>

          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search articles..."
                className="pl-12 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {filteredArticles.map((article, index) => {
              const Icon = article.icon;
              return (
                <Card 
                  key={article.id}
                  className="p-8 shadow-card hover:shadow-primary transition-all hover:-translate-y-1 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-${article.color}/10 rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 text-${article.color}`} />
                  </div>
                  <div className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-medium mb-3">
                    {article.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{article.title}</h3>
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </Card>
              );
            })}
          </div>

          <Card className="p-12 bg-gradient-hero shadow-primary">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Did You Know?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div>
                  <p className="text-4xl font-bold mb-2">53.6M</p>
                  <p className="text-white/90">metric tons of e-waste generated globally in 2024</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">17.4%</p>
                  <p className="text-white/90">of e-waste was properly recycled</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">$57B</p>
                  <p className="text-white/90">worth of recoverable materials in e-waste</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Awareness;
