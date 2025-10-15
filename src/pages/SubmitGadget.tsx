import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Award } from "lucide-react";
import { toast } from "sonner";

const SubmitGadget = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    condition: "",
    description: "",
  });
  const [estimatedPoints, setEstimatedPoints] = useState(0);

  const calculatePoints = (condition: string, category: string) => {
    const baseValues: { [key: string]: number } = {
      smartphone: 100,
      laptop: 200,
      tablet: 150,
      smartwatch: 80,
      headphones: 50,
    };

    const conditionMultipliers: { [key: string]: number } = {
      excellent: 1.0,
      good: 0.75,
      fair: 0.5,
      poor: 0.25,
    };

    const base = baseValues[category] || 100;
    const multiplier = conditionMultipliers[condition] || 0.5;
    return Math.round(base * multiplier * 10); // multiply by 10 for more impressive numbers
  };

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (newFormData.condition && newFormData.category) {
      setEstimatedPoints(calculatePoints(newFormData.condition, newFormData.category));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.category || !formData.condition) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success(`Gadget submitted! Estimated reward: ${estimatedPoints} points`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Submit Gadget</h1>
            <p className="text-muted-foreground">Tell us about your device and we'll calculate your reward</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-8 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Device Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., iPhone 12"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Apple, Samsung, Google"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smartphone">Smartphone</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="smartwatch">Smartwatch</SelectItem>
                      <SelectItem value="headphones">Headphones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent - Like new, no damage</SelectItem>
                      <SelectItem value="good">Good - Minor wear, fully functional</SelectItem>
                      <SelectItem value="fair">Fair - Visible wear, works with issues</SelectItem>
                      <SelectItem value="poor">Poor - Damaged or not working</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Notes</Label>
                  <Textarea
                    id="description"
                    placeholder="Any additional information about your device..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Images</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  Submit for Evaluation
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Reward</p>
                    <p className="text-2xl font-bold text-primary">{estimatedPoints} pts</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>≈ ${(estimatedPoints * 0.1).toFixed(2)} cash value</p>
                  <p>≈ {(estimatedPoints * 0.05).toFixed(1)} kg CO₂ credits</p>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <h3 className="font-bold mb-3">Evaluation Process</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p>Submit device details and photos</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p>AI evaluates condition and value</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p>Receive instant reward points</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitGadget;
