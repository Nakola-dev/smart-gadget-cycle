import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Eye, Clock, ArrowUpRight, ArrowDownRight, Users, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const fadeIn = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

const kpis = [
  { label: "Page Views", value: "128,459", change: "+18.3%", up: true, icon: Eye },
  { label: "Avg. Session", value: "4m 32s", change: "+5.1%", up: true, icon: Clock },
  { label: "Bounce Rate", value: "32.4%", change: "-3.2%", up: true, icon: TrendingUp },
  { label: "Conversion", value: "6.8%", change: "+1.4%", up: true, icon: BarChart3 },
];

const trafficSources = [
  { source: "Organic Search", visits: "45,230", pct: 35, color: "bg-primary" },
  { source: "Direct", visits: "32,100", pct: 25, color: "bg-accent" },
  { source: "Social Media", visits: "25,680", pct: 20, color: "bg-chart-3" },
  { source: "Referral", visits: "15,230", pct: 12, color: "bg-chart-4" },
  { source: "Email", visits: "10,219", pct: 8, color: "bg-chart-5" },
];

const topPages = [
  { page: "/", views: "32,450", unique: "18,230", bounce: "28%" },
  { page: "/swap", views: "21,300", unique: "14,500", bounce: "35%" },
  { page: "/awareness", views: "18,700", unique: "12,100", bounce: "22%" },
  { page: "/submit-gadget", views: "15,200", unique: "9,800", bounce: "41%" },
  { page: "/about", views: "8,400", unique: "6,200", bounce: "45%" },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  value: Math.floor(Math.random() * 800 + 200),
}));

const AdminAnalytics = () => {
  const [range, setRange] = useState("7d");
  return (
    <AdminLayout title="Analytics" breadcrumbs={[{ label: "Core" }, { label: "Analytics" }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track platform performance and user behavior</p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} {...fadeIn(i)}>
              <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{k.label}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">{k.value}</p>
                <span className={`text-xs flex items-center gap-0.5 ${k.up ? "text-green-500" : "text-red-500"}`}>
                  {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {k.change}
                </span>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic">
          <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {trafficSources.map((s, i) => (
                <motion.div key={s.source} {...fadeIn(i)} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{s.source}</span>
                    <span className="text-muted-foreground">{s.visits} ({s.pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${s.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm overflow-x-auto">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top Pages</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 font-medium">Page</th>
                  <th className="text-right py-2 font-medium">Views</th>
                  <th className="text-right py-2 font-medium">Unique</th>
                  <th className="text-right py-2 font-medium">Bounce</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p, i) => (
                  <motion.tr key={p.page} {...fadeIn(i)} className="border-b border-border/50">
                    <td className="py-3 text-foreground font-mono text-xs">{p.page}</td>
                    <td className="py-3 text-right text-foreground">{p.views}</td>
                    <td className="py-3 text-right text-muted-foreground">{p.unique}</td>
                    <td className="py-3 text-right text-muted-foreground">{p.bounce}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="realtime">
          <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-foreground">Live visitors: 342</h3>
            </div>
            <div className="flex items-end gap-1 h-40">
              {hourlyData.map((d, i) => (
                <motion.div
                  key={d.hour}
                  className="flex-1 bg-primary/60 rounded-t hover:bg-primary transition-colors"
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / 1000) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                  title={`${d.hour}: ${d.value}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminAnalytics;
