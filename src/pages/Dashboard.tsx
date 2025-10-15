import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Award, 
  Leaf, 
  TrendingUp,
  Plus,
  Trash2,
  Eye
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Gadget {
  id: number;
  name: string;
  brand: string;
  condition: string;
  points: number;
  status: string;
  date: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [gadgets, setGadgets] = useState<Gadget[]>([
    {
      id: 1,
      name: "iPhone 12",
      brand: "Apple",
      condition: "Good",
      points: 850,
      status: "Approved",
      date: "2025-01-15"
    },
    {
      id: 2,
      name: "Galaxy S20",
      brand: "Samsung",
      condition: "Fair",
      points: 620,
      status: "Processing",
      date: "2025-01-20"
    }
  ]);

  const mockChartData = [
    { month: "Jan", points: 0 },
    { month: "Feb", points: 850 },
    { month: "Mar", points: 1470 },
    { month: "Apr", points: 1470 },
  ];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const totalPoints = gadgets.reduce((sum, gadget) => sum + gadget.points, 0);
  const co2Saved = (gadgets.length * 12.5).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your gadgets, rewards, and environmental impact</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card hover:shadow-primary transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Total Points</p>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{totalPoints}</p>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-primary transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Gadgets Recycled</p>
              <Smartphone className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-secondary">{gadgets.length}</p>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-primary transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">CO₂ Saved (kg)</p>
              <Leaf className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-accent">{co2Saved}</p>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-primary transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Total Value</p>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">${(totalPoints * 0.1).toFixed(2)}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Gadgets</h2>
                <Button 
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={() => navigate("/submit-gadget")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Gadget
                </Button>
              </div>

              <div className="space-y-4">
                {gadgets.map((gadget) => (
                  <div 
                    key={gadget.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{gadget.name}</h3>
                      <p className="text-sm text-muted-foreground">{gadget.brand} • {gadget.condition}</p>
                      <p className="text-xs text-muted-foreground mt-1">{gadget.date}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm text-muted-foreground">Points</p>
                      <p className="text-xl font-bold text-primary">{gadget.points}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 shadow-card">
              <h3 className="font-bold text-lg mb-4">Rewards Timeline</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="points" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/submit-gadget")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Gadget
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/swap")}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Browse Swap Center
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/awareness")}
                >
                  <Leaf className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
