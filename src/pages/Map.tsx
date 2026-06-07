import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const pickupLocations = [
  {
    id: 1,
    name: "Green Tech Recycling Center",
    address: "123 Eco Street, Green City, GC 12345",
    phone: "+1 (555) 123-4567",
    hours: "Mon-Sat: 9:00 AM - 6:00 PM",
  },
  {
    id: 2,
    name: "E-Waste Solutions Hub",
    address: "456 Sustainable Ave, Eco Town, ET 67890",
    phone: "+1 (555) 987-6543",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
  },
  {
    id: 3,
    name: "Tech Recycle Point",
    address: "789 Circular Road, Recycle City, RC 11223",
    phone: "+1 (555) 456-7890",
    hours: "Mon-Sun: 10:00 AM - 8:00 PM",
  },
];

const Map = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    location: "",
  });

  const handleSchedulePickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.location) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Pickup scheduled successfully! We'll contact you soon.");
    setFormData({ name: "", phone: "", address: "", location: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            pickupLocations.map((l) => ({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: l.name,
              address: l.address,
              telephone: l.phone,
              openingHours: l.hours,
            }))
          ),
        }}
      />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">Find Pickup Locations</h1>
            <p className="text-xl text-muted-foreground">
              Schedule a pickup or find the nearest e-waste collection point
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <div className="space-y-6">
              <Card className="p-8 shadow-card h-96 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Interactive Map</p>
                  <p className="text-muted-foreground">
                    Map integration would display pickup locations here
                  </p>
                </div>
              </Card>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Nearby Locations</h3>
                {pickupLocations.map((location) => (
                  <Card key={location.id} className="p-4 shadow-card hover:shadow-primary transition-shadow">
                    <h4 className="font-bold text-lg mb-2">{location.name}</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{location.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{location.hours}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Schedule Pickup Form */}
            <div>
              <Card className="p-8 shadow-card sticky top-24">
                <h3 className="text-2xl font-bold mb-6">Schedule a Pickup</h3>
                <form onSubmit={handleSchedulePickup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Pickup Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Preferred Location *</Label>
                    <select
                      id="location"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    >
                      <option value="">Select a location</option>
                      {pickupLocations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                    Schedule Pickup
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Our team will contact you within 24 hours to confirm your pickup schedule.
                  </p>
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

export default Map;
