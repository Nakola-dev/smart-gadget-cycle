import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CreditCard, Download, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fadeIn = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

const stats = [
  { label: "Total Volume", value: "$128,450", change: "+22.3%", up: true, icon: DollarSign },
  { label: "Transactions", value: "3,892", change: "+15.1%", up: true, icon: CreditCard },
  { label: "Avg. Value", value: "$33.01", change: "+3.4%", up: true, icon: TrendingUp },
  { label: "Refunds", value: "$1,240", change: "-12.5%", up: true, icon: RefreshCw },
];

const transactions = [
  { id: "TXN-7842", user: "Sarah Johnson", type: "purchase", amount: "$89.00", status: "completed", date: "2026-03-15 14:32", method: "Credit Card" },
  { id: "TXN-7841", user: "Mike Chen", type: "swap", amount: "$0.00", status: "completed", date: "2026-03-15 13:18", method: "Swap Credit" },
  { id: "TXN-7840", user: "Emily Davis", type: "payout", amount: "$245.00", status: "pending", date: "2026-03-15 11:45", method: "Bank Transfer" },
  { id: "TXN-7839", user: "James Wilson", type: "purchase", amount: "$52.50", status: "failed", date: "2026-03-15 10:22", method: "PayPal" },
  { id: "TXN-7838", user: "Ana Garcia", type: "refund", amount: "-$34.00", status: "completed", date: "2026-03-14 16:50", method: "Credit Card" },
  { id: "TXN-7837", user: "David Kim", type: "purchase", amount: "$128.00", status: "completed", date: "2026-03-14 15:12", method: "Credit Card" },
];

const statusColors: Record<string, string> = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  failed: "bg-red-500/10 text-red-500 border-red-500/20",
};

const typeColors: Record<string, string> = {
  purchase: "bg-primary/10 text-primary border-primary/20",
  swap: "bg-accent/80 text-accent-foreground border-accent",
  payout: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  refund: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const AdminTransactions = () => (
  <AdminLayout title="Transactions" breadcrumbs={[{ label: "Commerce" }, { label: "Transactions" }]}>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">Monitor all platform financial activity</p>
      </div>
      <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div key={s.label} {...fadeIn(i)}>
            <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <span className={`text-xs flex items-center gap-0.5 ${s.up ? "text-green-500" : "text-red-500"}`}>
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{s.change}
              </span>
            </Card>
          </motion.div>
        );
      })}
    </div>

    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Transaction History</h3>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="swap">Swap</SelectItem>
              <SelectItem value="payout">Payout</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-3 font-medium">ID</th>
              <th className="text-left p-3 font-medium">User</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Method</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-right p-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <motion.tr key={t.id} {...fadeIn(i)} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-3 font-mono text-xs text-foreground">{t.id}</td>
                <td className="p-3 text-foreground">{t.user}</td>
                <td className="p-3"><Badge className={`text-xs ${typeColors[t.type]}`}>{t.type}</Badge></td>
                <td className="p-3 text-muted-foreground">{t.method}</td>
                <td className="p-3"><Badge className={`text-xs ${statusColors[t.status]}`}>{t.status}</Badge></td>
                <td className="p-3 text-muted-foreground text-xs">{t.date}</td>
                <td className="p-3 text-right font-medium text-foreground">{t.amount}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </AdminLayout>
);

export default AdminTransactions;
