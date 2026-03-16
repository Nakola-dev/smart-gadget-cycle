import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileBarChart, Download, Calendar, Filter, FileText, TrendingUp, Users, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fadeIn = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

const reports = [
  { id: 1, name: "Monthly User Growth", type: "Users", date: "2026-03-15", status: "ready", size: "2.4 MB" },
  { id: 2, name: "Q1 Revenue Summary", type: "Finance", date: "2026-03-14", status: "ready", size: "1.8 MB" },
  { id: 3, name: "Gadget Submissions Report", type: "Content", date: "2026-03-13", status: "generating", size: "-" },
  { id: 4, name: "Swap Activity Overview", type: "Commerce", date: "2026-03-12", status: "ready", size: "3.1 MB" },
  { id: 5, name: "Environmental Impact", type: "Impact", date: "2026-03-11", status: "ready", size: "980 KB" },
  { id: 6, name: "User Retention Analysis", type: "Users", date: "2026-03-10", status: "scheduled", size: "-" },
];

const templates = [
  { name: "User Activity", desc: "Active users, sessions, engagement metrics", icon: Users },
  { name: "Gadget Pipeline", desc: "Submissions, approvals, rejections by period", icon: Smartphone },
  { name: "Financial Summary", desc: "Revenue, payouts, fees breakdown", icon: TrendingUp },
  { name: "Content Performance", desc: "Article views, shares, engagement rates", icon: FileText },
];

const statusColors: Record<string, string> = {
  ready: "bg-green-500/10 text-green-500 border-green-500/20",
  generating: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const AdminReports = () => (
  <AdminLayout title="Reports" breadcrumbs={[{ label: "Core" }, { label: "Reports" }]}>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and download platform reports</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-1" />Filter</Button>
        <Button size="sm"><FileBarChart className="h-4 w-4 mr-1" />New Report</Button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {templates.map((t, i) => {
        const Icon = t.icon;
        return (
          <motion.div key={t.name} {...fadeIn(i)}>
            <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer group">
              <Icon className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-semibold text-foreground">{t.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
            </Card>
          </motion.div>
        );
      })}
    </div>

    <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Recent Reports</h3>
        <Select defaultValue="all">
          <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="content">Content</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-3 font-medium">Report</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Size</th>
              <th className="text-right p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <motion.tr key={r.id} {...fadeIn(i)} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-3 text-foreground font-medium">{r.name}</td>
                <td className="p-3"><Badge variant="outline" className="text-xs">{r.type}</Badge></td>
                <td className="p-3 text-muted-foreground">{r.date}</td>
                <td className="p-3"><Badge className={`text-xs ${statusColors[r.status]}`}>{r.status}</Badge></td>
                <td className="p-3 text-muted-foreground">{r.size}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" disabled={r.status !== "ready"}>
                    <Download className="h-3 w-3" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </AdminLayout>
);

export default AdminReports;
