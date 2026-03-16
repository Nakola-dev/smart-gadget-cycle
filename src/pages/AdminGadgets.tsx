import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Smartphone, Search, CheckCircle, XCircle, Clock, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";

const fadeIn = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

const stats = [
  { label: "Total Gadgets", value: "15,420", change: "+8.2%", up: true },
  { label: "Pending Review", value: "48", change: "+12", up: false },
  { label: "Approved Today", value: "23", change: "+15.3%", up: true },
  { label: "Rejection Rate", value: "4.2%", change: "-1.1%", up: true },
];

const gadgets = [
  { id: 1, name: "iPhone 14 Pro", brand: "Apple", condition: "Good", status: "pending", submitter: "Sarah J.", date: "2026-03-15", value: "$320" },
  { id: 2, name: "Samsung Galaxy S23", brand: "Samsung", condition: "Excellent", status: "approved", submitter: "Mike C.", date: "2026-03-14", value: "$280" },
  { id: 3, name: "MacBook Air M2", brand: "Apple", condition: "Fair", status: "approved", submitter: "Emily D.", date: "2026-03-13", value: "$540" },
  { id: 4, name: "Google Pixel 7", brand: "Google", condition: "Good", status: "rejected", submitter: "James W.", date: "2026-03-12", value: "$180" },
  { id: 5, name: "iPad Pro 11", brand: "Apple", condition: "Excellent", status: "pending", submitter: "Ana G.", date: "2026-03-11", value: "$420" },
  { id: 6, name: "Dell XPS 13", brand: "Dell", condition: "Good", status: "approved", submitter: "David K.", date: "2026-03-10", value: "$380" },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  approved: { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  pending: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  rejected: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
};

const AdminGadgets = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const filtered = gadgets.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.brand.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || g.status === tab;
    return matchSearch && matchTab;
  });

  return (
    <AdminLayout title="Gadgets" breadcrumbs={[{ label: "Content" }, { label: "Gadgets" }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gadget Management</h1>
          <p className="text-sm text-muted-foreground">Review and manage gadget submissions</p>
        </div>
        <Button size="sm"><Smartphone className="h-4 w-4 mr-1" />Export</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeIn(i)}>
            <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <span className={`text-xs flex items-center gap-0.5 ${s.up ? "text-green-500" : "text-red-500"}`}>
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{s.change}
              </span>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search gadgets..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">Gadget</th>
                <th className="text-left p-3 font-medium">Condition</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Submitter</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-right p-3 font-medium">Value</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => {
                const sc = statusConfig[g.status];
                const StatusIcon = sc.icon;
                return (
                  <motion.tr key={g.id} {...fadeIn(i)} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="text-foreground font-medium">{g.name}</div>
                      <div className="text-xs text-muted-foreground">{g.brand}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">{g.condition}</td>
                    <td className="p-3"><Badge className={`text-xs gap-1 ${sc.color}`}><StatusIcon className="h-3 w-3" />{g.status}</Badge></td>
                    <td className="p-3 text-muted-foreground">{g.submitter}</td>
                    <td className="p-3 text-muted-foreground">{g.date}</td>
                    <td className="p-3 text-right text-foreground font-medium">{g.value}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                        {g.status === "pending" && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600"><CheckCircle className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600"><XCircle className="h-3 w-3" /></Button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminGadgets;
