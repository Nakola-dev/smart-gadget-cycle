import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Search, Download, Send, Clock, CheckCircle2, XCircle,
  TrendingUp, DollarSign, Users, Calendar, ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

interface Payout {
  id: string;
  recipient: string;
  email: string;
  amount: number;
  method: "bank" | "paypal" | "crypto";
  status: "pending" | "processing" | "completed" | "failed";
  date: string;
  batch: string;
}

const initial: Payout[] = [
  { id: "PO-1024", recipient: "John Doe", email: "john@example.com", amount: 245.50, method: "bank", status: "completed", date: "2025-01-12", batch: "B-12" },
  { id: "PO-1025", recipient: "Jane Smith", email: "jane@example.com", amount: 89.20, method: "paypal", status: "processing", date: "2025-01-13", batch: "B-12" },
  { id: "PO-1026", recipient: "Mike Chen", email: "mike@example.com", amount: 412.00, method: "bank", status: "pending", date: "2025-01-13", batch: "B-13" },
  { id: "PO-1027", recipient: "Sara Lee", email: "sara@example.com", amount: 56.75, method: "crypto", status: "failed", date: "2025-01-11", batch: "B-11" },
  { id: "PO-1028", recipient: "Alex Park", email: "alex@example.com", amount: 178.90, method: "paypal", status: "completed", date: "2025-01-10", batch: "B-11" },
];

const stats = [
  { label: "Pending", value: "$3,240", icon: Clock, color: "text-accent" },
  { label: "Processed (MTD)", value: "$24.8K", icon: CheckCircle2, color: "text-primary" },
  { label: "Recipients", value: "184", icon: Users, color: "text-primary" },
  { label: "Avg Payout", value: "$135", icon: DollarSign, color: "text-primary" },
];

const statusConfig = {
  pending: { color: "bg-accent/15 text-accent", icon: Clock },
  processing: { color: "bg-primary/15 text-primary", icon: ArrowUpRight },
  completed: { color: "bg-primary/15 text-primary", icon: CheckCircle2 },
  failed: { color: "bg-destructive/15 text-destructive", icon: XCircle },
};

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>(initial);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");

  const filtered = payouts.filter((p) => {
    const matchSearch = p.recipient.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchMethod = filterMethod === "all" || p.method === filterMethod;
    return matchSearch && matchMethod;
  });

  const runBatch = () => toast.success("Payout batch scheduled");
  const approve = (id: string) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "processing" as const } : p)));
    toast.success(`${id} approved`);
  };

  return (
    <AdminLayout title="Payouts">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payouts</h1>
          <p className="text-sm text-muted-foreground">Manage user payouts and batch transfers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export</Button>
          <Button onClick={runBatch} className="bg-gradient-primary text-primary-foreground gap-2">
            <Send className="w-4 h-4" />Run Batch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5 glass-hover">
                <Icon className={`w-5 h-5 mb-2 ${s.color}`} />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="p-4 glass mb-4">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by recipient or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="glass">
        <Tabs defaultValue="all" className="p-4 lg:p-6">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          {(["all", "pending", "processing", "completed", "failed"] as const).map((tab) => {
            const list = tab === "all" ? filtered : filtered.filter((p) => p.status === tab);
            return (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Payout ID</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Recipient</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Amount</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Method</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Batch</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Status</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {list.map((p) => {
                          const sc = statusConfig[p.status];
                          const SIcon = sc.icon;
                          return (
                            <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                              <td className="p-3 text-sm font-mono text-foreground">{p.id}</td>
                              <td className="p-3">
                                <div className="text-sm font-medium text-foreground">{p.recipient}</div>
                                <div className="text-[11px] text-muted-foreground">{p.email}</div>
                              </td>
                              <td className="p-3 text-sm font-medium text-foreground">${p.amount.toFixed(2)}</td>
                              <td className="p-3 text-sm text-muted-foreground capitalize">{p.method}</td>
                              <td className="p-3 text-sm text-muted-foreground">{p.batch}</td>
                              <td className="p-3">
                                <Badge className={`${sc.color} border-0 gap-1 capitalize`}>
                                  <SIcon className="w-3 h-3" />{p.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {p.status === "pending" ? (
                                  <Button size="sm" variant="outline" onClick={() => approve(p.id)}>Approve</Button>
                                ) : (
                                  <Button size="sm" variant="outline">View</Button>
                                )}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                {list.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Wallet className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No payouts</p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>
    </AdminLayout>
  );
};

export default AdminPayouts;
