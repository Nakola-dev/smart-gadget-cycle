import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TicketCheck, Plus, MessageSquare, Clock, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const fadeIn = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

const stats = [
  { label: "Open Tickets", value: "48", change: "+5", up: false },
  { label: "Avg Response", value: "2.4h", change: "-18min", up: true },
  { label: "Resolved Today", value: "12", change: "+33%", up: true },
  { label: "Satisfaction", value: "94.2%", change: "+1.8%", up: true },
];

const tickets = [
  { id: "TKT-1042", subject: "Cannot complete swap transaction", user: "Sarah J.", priority: "high", status: "open", replies: 3, created: "2h ago" },
  { id: "TKT-1041", subject: "Account verification stuck", user: "Mike C.", priority: "medium", status: "open", replies: 1, created: "4h ago" },
  { id: "TKT-1040", subject: "Wrong gadget condition assessment", user: "Emily D.", priority: "high", status: "in-progress", replies: 5, created: "6h ago" },
  { id: "TKT-1039", subject: "Payout not received after 7 days", user: "James W.", priority: "urgent", status: "open", replies: 2, created: "8h ago" },
  { id: "TKT-1038", subject: "Feature request: bulk upload", user: "Ana G.", priority: "low", status: "closed", replies: 4, created: "1d ago" },
  { id: "TKT-1037", subject: "Mobile app crash on submit", user: "David K.", priority: "medium", status: "in-progress", replies: 6, created: "1d ago" },
];

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-muted text-muted-foreground border-border",
};

const statusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  closed: "bg-green-500/10 text-green-500 border-green-500/20",
};

const AdminTickets = () => (
  <AdminLayout title="Tickets" breadcrumbs={[{ label: "Support" }, { label: "Tickets" }]}>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-sm text-muted-foreground">Manage customer support requests</p>
      </div>
      <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Ticket</Button>
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
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">All Tickets</h3>
      </div>
      <div className="divide-y divide-border/50">
        {tickets.map((t, i) => (
          <motion.div key={t.id} {...fadeIn(i)} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                  <Badge className={`text-xs ${priorityColors[t.priority]}`}>{t.priority}</Badge>
                  <Badge className={`text-xs ${statusColors[t.status]}`}>{t.status}</Badge>
                </div>
                <h4 className="text-sm font-medium text-foreground truncate">{t.subject}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t.user} · {t.created}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />{t.replies}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  </AdminLayout>
);

export default AdminTickets;
