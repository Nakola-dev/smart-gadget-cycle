import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Package, Eye, Truck, CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const fadeIn = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

const stats = [
  { label: "Total Orders", value: "2,847", change: "+9.8%", up: true },
  { label: "In Transit", value: "124", change: "+3.2%", up: true },
  { label: "Delivered", value: "2,680", change: "+11.4%", up: true },
  { label: "Cancelled", value: "43", change: "-5.1%", up: true },
];

const orders = [
  { id: "ORD-2341", customer: "Sarah Johnson", items: 2, total: "$189.00", status: "delivered", date: "2026-03-15", tracking: "UPS-12345" },
  { id: "ORD-2340", customer: "Mike Chen", items: 1, total: "$52.50", status: "shipped", date: "2026-03-15", tracking: "FDX-67890" },
  { id: "ORD-2339", customer: "Emily Davis", items: 3, total: "$320.00", status: "processing", date: "2026-03-14", tracking: "-" },
  { id: "ORD-2338", customer: "James Wilson", items: 1, total: "$75.00", status: "cancelled", date: "2026-03-14", tracking: "-" },
  { id: "ORD-2337", customer: "Ana Garcia", items: 2, total: "$148.00", status: "shipped", date: "2026-03-13", tracking: "DHL-11223" },
  { id: "ORD-2336", customer: "David Kim", items: 1, total: "$95.00", status: "delivered", date: "2026-03-13", tracking: "UPS-44556" },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  delivered: { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  shipped: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Truck },
  processing: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  cancelled: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
};

const AdminOrders = () => (
  <AdminLayout title="Orders" breadcrumbs={[{ label: "Commerce" }, { label: "Orders" }]}>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">Track and manage customer orders</p>
      </div>
      <Button size="sm"><Package className="h-4 w-4 mr-1" />Export Orders</Button>
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

    <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-x-auto">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left p-3 font-medium">Order</th>
            <th className="text-left p-3 font-medium">Customer</th>
            <th className="text-center p-3 font-medium">Items</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Tracking</th>
            <th className="text-left p-3 font-medium">Date</th>
            <th className="text-right p-3 font-medium">Total</th>
            <th className="text-right p-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => {
            const sc = statusConfig[o.status];
            const StatusIcon = sc.icon;
            return (
              <motion.tr key={o.id} {...fadeIn(i)} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-3 font-mono text-xs text-foreground">{o.id}</td>
                <td className="p-3 text-foreground">{o.customer}</td>
                <td className="p-3 text-center text-muted-foreground">{o.items}</td>
                <td className="p-3"><Badge className={`text-xs gap-1 ${sc.color}`}><StatusIcon className="h-3 w-3" />{o.status}</Badge></td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{o.tracking}</td>
                <td className="p-3 text-muted-foreground">{o.date}</td>
                <td className="p-3 text-right font-medium text-foreground">{o.total}</td>
                <td className="p-3 text-right"><Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button></td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  </AdminLayout>
);

export default AdminOrders;
