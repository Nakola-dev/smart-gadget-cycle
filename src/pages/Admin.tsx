import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Smartphone, 
  Award, 
  TrendingUp,
  BarChart3,
  FileText,
  ShoppingBag
} from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated || userRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const stats = [
    { label: "Total Users", value: "5,234", icon: Users, color: "primary" },
    { label: "Gadgets Processed", value: "15,420", icon: Smartphone, color: "secondary" },
    { label: "Total Rewards", value: "98,500", icon: Award, color: "accent" },
    { label: "Revenue", value: "$47.2K", icon: TrendingUp, color: "primary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, gadgets, and platform content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 shadow-card hover:shadow-primary transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <Icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-card">
          <Tabs defaultValue="users" className="p-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="gadgets">
                <Smartphone className="w-4 h-4 mr-2" />
                Gadgets
              </TabsTrigger>
              <TabsTrigger value="articles">
                <FileText className="w-4 h-4 mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="swaps">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Swaps
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">User Management</h3>
                  <Button className="bg-gradient-primary">Add User</Button>
                </div>
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Role</th>
                        <th className="text-left p-4">Points</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t hover:bg-muted/50">
                        <td className="p-4">John Doe</td>
                        <td className="p-4">john@example.com</td>
                        <td className="p-4">User</td>
                        <td className="p-4">1,250</td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">Edit</Button>
                        </td>
                      </tr>
                      <tr className="border-t hover:bg-muted/50">
                        <td className="p-4">Jane Smith</td>
                        <td className="p-4">jane@example.com</td>
                        <td className="p-4">User</td>
                        <td className="p-4">2,840</td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gadgets" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Gadget Submissions</h3>
                  <div className="flex gap-2">
                    <Button variant="outline">Export</Button>
                    <Button className="bg-gradient-primary">Review Pending</Button>
                  </div>
                </div>
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4">Device</th>
                        <th className="text-left p-4">User</th>
                        <th className="text-left p-4">Condition</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t hover:bg-muted/50">
                        <td className="p-4">iPhone 12 Pro</td>
                        <td className="p-4">john@example.com</td>
                        <td className="p-4">Good</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                            Pending
                          </span>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">Review</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="articles" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Awareness Articles</h3>
                  <Button className="bg-gradient-primary">Create Article</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 hover:shadow-primary transition-shadow">
                    <h4 className="font-bold mb-2">E-Waste Best Practices</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Published: Jan 15, 2025 • 1,234 views
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Delete</Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="swaps" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Swap Listings</h3>
                  <Button className="bg-gradient-primary">Add Item</Button>
                </div>
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4">Item</th>
                        <th className="text-left p-4">Points Required</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t hover:bg-muted/50">
                        <td className="p-4">Refurbished Laptop</td>
                        <td className="p-4">5,000</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                            Available
                          </span>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
