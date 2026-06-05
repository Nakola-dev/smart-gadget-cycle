import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Plus, Edit, Trash2, Send, Calendar, Users, Eye,
  AlertCircle, Info, CheckCircle2, Sparkles, Pin, Archive,
} from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "feature";
  audience: "all" | "admins" | "users" | "premium";
  status: "draft" | "scheduled" | "published" | "archived";
  pinned: boolean;
  date: string;
  views: number;
  reach: number;
}

const initial: Announcement[] = [
  { id: "1", title: "New Swap Categories Launched", message: "We've added tablets and components to our swap platform.", type: "feature", audience: "all", status: "published", pinned: true, date: "2025-01-12", views: 4520, reach: 8200 },
  { id: "2", title: "Scheduled Maintenance Notice", message: "System maintenance on Jan 20 from 2-4 AM UTC.", type: "warning", audience: "all", status: "scheduled", pinned: false, date: "2025-01-20", views: 0, reach: 8200 },
  { id: "3", title: "Holiday Reward Bonus", message: "Earn 2x points on all submissions this weekend!", type: "success", audience: "users", status: "published", pinned: false, date: "2025-01-10", views: 6890, reach: 7400 },
  { id: "4", title: "Admin Dashboard Update", message: "New analytics tools available in the dashboard.", type: "info", audience: "admins", status: "published", pinned: false, date: "2025-01-08", views: 47, reach: 50 },
  { id: "5", title: "Q1 Roadmap Preview", message: "Draft preview of upcoming features.", type: "feature", audience: "premium", status: "draft", pinned: false, date: "2025-01-14", views: 0, reach: 0 },
];

const typeConfig = {
  info: { color: "bg-primary/15 text-primary", icon: Info },
  success: { color: "bg-primary/15 text-primary", icon: CheckCircle2 },
  warning: { color: "bg-accent/15 text-accent", icon: AlertCircle },
  feature: { color: "bg-secondary/30 text-secondary-foreground", icon: Sparkles },
};

const statusConfig = {
  draft: "bg-muted/40 text-muted-foreground",
  scheduled: "bg-accent/15 text-accent",
  published: "bg-primary/15 text-primary",
  archived: "bg-muted/30 text-muted-foreground",
};

const AdminAnnouncements = () => {
  const [items, setItems] = useState<Announcement[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({
    title: "", message: "", type: "info" as Announcement["type"],
    audience: "all" as Announcement["audience"], pinned: false,
    schedule: false, scheduleDate: "",
  });

  const stats = [
    { label: "Active", value: items.filter((i) => i.status === "published").length, icon: Megaphone },
    { label: "Scheduled", value: items.filter((i) => i.status === "scheduled").length, icon: Calendar },
    { label: "Total Reach", value: items.reduce((a, b) => a + b.reach, 0).toLocaleString(), icon: Users },
    { label: "Total Views", value: items.reduce((a, b) => a + b.views, 0).toLocaleString(), icon: Eye },
  ];

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", message: "", type: "info", audience: "all", pinned: false, schedule: false, scheduleDate: "" });
    setOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({
      title: a.title, message: a.message, type: a.type, audience: a.audience,
      pinned: a.pinned, schedule: a.status === "scheduled", scheduleDate: a.date,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.title || !form.message) {
      toast.error("Title and message are required");
      return;
    }
    const status: Announcement["status"] = form.schedule ? "scheduled" : "published";
    if (editing) {
      setItems((p) => p.map((i) => (i.id === editing.id ? { ...i, ...form, status } : i)));
      toast.success("Announcement updated");
    } else {
      const item: Announcement = {
        ...form,
        id: Date.now().toString(),
        status,
        date: form.scheduleDate || new Date().toISOString().split("T")[0],
        views: 0,
        reach: form.audience === "admins" ? 50 : form.audience === "premium" ? 1200 : 8200,
      };
      setItems((p) => [item, ...p]);
      toast.success(form.schedule ? "Announcement scheduled" : "Announcement published");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    setItems((p) => p.filter((i) => i.id !== id));
    toast.success("Announcement deleted");
  };

  const togglePin = (id: string) => {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, pinned: !i.pinned } : i)));
  };

  const archive = (id: string) => {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: "archived" as const } : i)));
    toast.success("Archived");
  };

  return (
    <AdminLayout title="Announcements">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-sm text-muted-foreground">Broadcast updates, alerts, and features to users</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />New Announcement
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5 glass-hover">
                <Icon className="w-5 h-5 mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="glass">
        <Tabs defaultValue="all" className="p-4 lg:p-6">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          {(["all", "published", "scheduled", "draft", "archived"] as const).map((tab) => {
            const list = tab === "all" ? items : items.filter((i) => i.status === tab);
            const sorted = [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
            return (
              <TabsContent key={tab} value={tab} className="mt-6 space-y-3">
                <AnimatePresence>
                  {sorted.map((a, i) => {
                    const tc = typeConfig[a.type];
                    const TIcon = tc.icon;
                    return (
                      <motion.div key={a.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}>
                        <Card className="p-4 glass-hover">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tc.color}`}>
                              <TIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {a.pinned && <Pin className="w-3.5 h-3.5 text-accent fill-accent" />}
                                <h4 className="font-bold text-foreground">{a.title}</h4>
                                <Badge className={`${statusConfig[a.status]} border-0 capitalize text-[10px]`}>{a.status}</Badge>
                                <Badge variant="outline" className="text-[10px] capitalize">{a.audience}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{a.message}</p>
                              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{a.views.toLocaleString()} views</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{a.reach.toLocaleString()} reach</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <Button size="sm" variant="ghost" onClick={() => togglePin(a.id)} title="Pin">
                                <Pin className={`w-3.5 h-3.5 ${a.pinned ? "text-accent fill-accent" : ""}`} />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => openEdit(a)}>
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              {a.status !== "archived" && (
                                <Button size="sm" variant="ghost" onClick={() => archive(a.id)} title="Archive">
                                  <Archive className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(a.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {sorted.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Megaphone className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No announcements</p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Announcement" : "New Announcement"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Message</label>
              <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                <Select value={form.type} onValueChange={(v: Announcement["type"]) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Audience</label>
                <Select value={form.audience} onValueChange={(v: Announcement["audience"]) => setForm({ ...form, audience: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="users">Standard Users</SelectItem>
                    <SelectItem value="premium">Premium Users</SelectItem>
                    <SelectItem value="admins">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-accent" />
                <span className="text-sm text-foreground">Pin to top</span>
              </div>
              <Switch checked={form.pinned} onCheckedChange={(v) => setForm({ ...form, pinned: v })} />
            </div>
            <div className="p-3 rounded-lg bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Schedule for later</span>
                </div>
                <Switch checked={form.schedule} onCheckedChange={(v) => setForm({ ...form, schedule: v })} />
              </div>
              {form.schedule && (
                <Input type="datetime-local" value={form.scheduleDate} onChange={(e) => setForm({ ...form, scheduleDate: e.target.value })} />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-gradient-primary text-primary-foreground gap-2">
              <Send className="w-4 h-4" />{form.schedule ? "Schedule" : editing ? "Update" : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAnnouncements;
