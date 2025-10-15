import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, Tablet, Headphones, Award } from "lucide-react";
import { toast } from "sonner";

const swapItems = [
  {
    id: 1,
    name: "Refurbished MacBook Air",
    category: "Laptop",
    icon: Laptop,
    points: 5000,
    description: "2020 model, 8GB RAM, 256GB SSD, excellent condition",
    available: true,
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    category: "Smartphone",
    icon: Smartphone,
    points: 3500,
    description: "Unlocked, good condition, includes charger",
    available: true,
  },
  {
    id: 3,
    name: "iPad 9th Gen",
    category: "Tablet",
    icon: Tablet,
    points: 4200,
    description: "64GB, Wi-Fi, like new condition",
    available: false,
  },
  {
    id: 4,
    name: "Sony WH-1000XM4",
    category: "Headphones",
    icon: Headphones,
    points: 1800,
    description: "Noise-cancelling, excellent condition",
    available: true,
  },
  {
    id: 5,
    name: "Refurbished Dell XPS 13",
    category: "Laptop",
    icon: Laptop,
    points: 5500,
    description: "2021 model, 16GB RAM, 512GB SSD",
    available: true,
  },
  {
    id: 6,
    name: "iPhone 11",
    category: "Smartphone",
    icon: Smartphone,
    points: 2800,
    description: "64GB, good condition, battery health 85%",
    available: true,
  },
];

const Swap = () => {
  const userPoints = 1470; // Mock user points

  const handleSwap = (itemName: string, requiredPoints: number) => {
    if (userPoints >= requiredPoints) {
      toast.success(`Successfully claimed ${itemName}!`);
    } else {
      toast.error(`You need ${requiredPoints - userPoints} more points to claim this item`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">Swap & Exchange Center</h1>
            <p className="text-xl text-muted-foreground">
              Exchange your reward points for refurbished devices and accessories
            </p>
          </div>

          <Card className="p-6 mb-12 shadow-primary bg-gradient-hero">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white/80 mb-1">Your Available Points</p>
                  <p className="text-4xl font-bold text-white">{userPoints}</p>
                </div>
              </div>
              <Button size="lg" variant="secondary">
                View My Points History
              </Button>
            </div>
          </Card>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Available Items</h2>
            <p className="text-muted-foreground">Browse and claim items using your reward points</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {swapItems.map((item, index) => {
              const Icon = item.icon;
              const canAfford = userPoints >= item.points;
              
              return (
                <Card 
                  key={item.id}
                  className="p-6 shadow-card hover:shadow-primary transition-all"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    {item.available ? (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Points Required</p>
                      <p className="text-2xl font-bold text-primary">{item.points}</p>
                    </div>
                    <Button 
                      disabled={!item.available || !canAfford}
                      onClick={() => handleSwap(item.name, item.points)}
                      className={canAfford && item.available ? "bg-gradient-primary hover:opacity-90" : ""}
                    >
                      {!item.available ? "Out of Stock" : canAfford ? "Claim" : "Not Enough Points"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Swap;
