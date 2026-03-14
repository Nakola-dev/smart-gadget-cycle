import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Users, Smartphone, Award, TrendingUp, FileText, ShoppingBag,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "5,234", change: "+12.5%", up: true, icon: Users },
  { label: "Gadgets Processed", value: "15,420", change: "+8.2%", up: true, icon: Smartphone },
  { label: "Total Rewards", value: "98,500", change: "+23.1%", up: true, icon: Award },
  { label: "Revenue", value: "$47.2K", change: "-2.4%", up: false, icon: TrendingUp },
];

const Admin = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of platform activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-5 glass-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-primary" : "text-destructive"}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Content tabs */}
      <Card className="glass">
        <Tabs defaultValue="users" className="p-4 lg:p-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/30">
            <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" />Users</TabsTrigger>
            <TabsTrigger value="gadgets"><Smartphone className="w-4 h-4 mr-2" />Gadgets</TabsTrigger>
            <TabsTrigger value="articles"><FileText className="w-4 h-4 mr-2" />Articles</TabsTrigger>
            <TabsTrigger value="swaps"><ShoppingBag className="w-4 h-4 mr-2" />Swaps</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">User Management</h3>
                <Button className="bg-gradient-primary text-primary-foreground">Add User</Button>
              </div>
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Name</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Email</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Role</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Points</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "John Doe", email: "john@example.com", role: "User", points: "1,250" },
                      { name: "Jane Smith", email: "jane@example.com", role: "User", points: "2,840" },
                    ].map((u) => (
                      <tr key={u.email} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-4 text-sm text-foreground">{u.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{u.role}</span></td>
                        <td className="p-4 text-sm text-foreground">{u.points}</td>
                        <td className="p-4"><Button size="sm" variant="outline">Edit</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gadgets" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Gadget Submissions</h3>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button className="bg-gradient-primary text-primary-foreground">Review Pending</Button>
                </div>
              </div>
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Device</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">User</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Condition</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Status</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-sm text-foreground">iPhone 12 Pro</td>
                      <td className="p-4 text-sm text-muted-foreground">john@example.com</td>
                      <td className="p-4 text-sm text-foreground">Good</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent">Pending</span></td>
                      <td className="p-4"><Button size="sm" variant="outline">Review</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Awareness Articles</h3>
                <Button className="bg-gradient-primary text-primary-foreground">Create Article</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 glass-hover">
                  <h4 className="font-bold text-foreground mb-2">E-Waste Best Practices</h4>
                  <p className="text-sm text-muted-foreground mb-3">Published: Jan 15, 2025 • 1,234 views</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">Delete</Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="swaps" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Swap Listings</h3>
                <Button className="bg-gradient-primary text-primary-foreground">Add Item</Button>
              </div>
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Item</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Points</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Status</th>
                      <th className="text-left p-4 text-sm text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-sm text-foreground">Refurbished Laptop</td>
                      <td className="p-4 text-sm text-foreground">5,000</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs bg-primary/15 text-primary">Available</span></td>
                      <td className="p-4"><Button size="sm" variant="outline">Edit</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </AdminLayout>
  );
};

export default Admin;
