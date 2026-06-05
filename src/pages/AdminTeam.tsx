import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersRound, UserPlus, Search, Mail, Shield, MoreVertical,
  Crown, Edit, Trash2, Send, CheckCircle2, Clock, Circle,
} from "lucide-react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  status: "online" | "away" | "offline";
  joined: string;
  lastActive: string;
}

const initial: Member[] = [
  { id: "1", name: "Alex Morgan", email: "alex@eco.com", role: "owner", status: "online", joined: "2024-03-15", lastActive: "now" },
  { id: "2", name: "Sarah Chen", email: "sarah@eco.com", role: "admin", status: "online", joined: "2024-04-20", lastActive: "5 min ago" },
  { id: "3", name: "Mike Wilson", email: "mike@eco.com", role: "editor", status: "away", joined: "2024-06-10", lastActive: "2 hr ago" },
  { id: "4", name: "Lisa Park", email: "lisa@eco.com", role: "editor", status: "offline", joined: "2024-08-01", lastActive: "1 day ago" },
  { id: "5", name: "Tom Reed", email: "tom@eco.com", role: "viewer", status: "online", joined: "2024-11-05", lastActive: "now" },
];

const invites = [
  { email: "newhire@eco.com", role: "editor", sent: "2 days ago" },
  { email: "consultant@partner.com", role: "viewer", sent: "5 days ago" },
];

const roleConfig = {
  owner: { color: "bg-accent/20 text-accent", icon: Crown },
  admin: { color: "bg-primary/15 text-primary", icon: Shield },
  editor: { color: "bg-muted text-foreground", icon: Edit },
  viewer: { color: "bg-muted/40 text-muted-foreground", icon: Circle },
};

const statusDot = {
  online: "bg-primary",
  away: "bg-accent",
  offline: "bg-muted-foreground/40",
};

const AdminTeam = () => {
  const [members, setMembers] = useState<Member[]>(initial);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "viewer" });

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || m.role === filterRole;
    return matchSearch && matchRole;
  });

  const sendInvite = () => {
    if (!inviteForm.email) {
      toast.error("Email is required");
      return;
    }
    toast.success(`Invite sent to ${inviteForm.email}`);
    setInviteOpen(false);
    setInviteForm({ email: "", role: "viewer" });
  };

  const changeRole = (id: string, role: Member["role"]) => {
    setMembers((p) => p.map((m) => (m.id === id ? { ...m, role } : m)));
    toast.success("Role updated");
  };

  const remove = (id: string) => {
    setMembers((p) => p.filter((m) => m.id !== id));
    toast.success("Member removed");
  };

  const stats = [
    { label: "Total Members", value: members.length, icon: UsersRound },
    { label: "Online Now", value: members.filter((m) => m.status === "online").length, icon: CheckCircle2 },
    { label: "Pending Invites", value: invites.length, icon: Mail },
    { label: "Admins", value: members.filter((m) => m.role === "admin" || m.role === "owner").length, icon: Shield },
  ];

  return (
    <AdminLayout title="Team">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-sm text-muted-foreground">Manage members, roles, and permissions</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-gradient-primary text-primary-foreground gap-2">
          <UserPlus className="w-4 h-4" />Invite Member
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

      <Card className="p-4 glass mb-4">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="glass">
        <Tabs defaultValue="members" className="p-4 lg:p-6">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
            <TabsTrigger value="invites">Pending Invites ({invites.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filtered.map((m, i) => {
                  const rc = roleConfig[m.role];
                  const RIcon = rc.icon;
                  const initials = m.name.split(" ").map((n) => n[0]).join("");
                  return (
                    <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}>
                      <Card className="p-5 glass-hover">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-background ${statusDot[m.status]}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-foreground truncate">{m.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                          </div>
                          <Badge className={`${rc.color} border-0 gap-1 capitalize shrink-0`}>
                            <RIcon className="w-3 h-3" />{m.role}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                          <span>Joined {m.joined}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.lastActive}</span>
                        </div>
                        <div className="flex gap-2">
                          <Select value={m.role} onValueChange={(v: Member["role"]) => changeRole(m.id, v)}>
                            <SelectTrigger className="flex-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          {m.role !== "owner" && (
                            <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => remove(m.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="invites" className="mt-6 space-y-3">
            {invites.map((inv) => (
              <Card key={inv.email} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{inv.email}</p>
                    <p className="text-[11px] text-muted-foreground capitalize">{inv.role} • Sent {inv.sent}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1"><Send className="w-3 h-3" />Resend</Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <Input type="email" placeholder="member@example.com" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Role</label>
              <Select value={inviteForm.role} onValueChange={(v) => setInviteForm({ ...inviteForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — Full access</SelectItem>
                  <SelectItem value="editor">Editor — Manage content</SelectItem>
                  <SelectItem value="viewer">Viewer — Read-only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={sendInvite} className="bg-gradient-primary text-primary-foreground gap-2">
              <Send className="w-4 h-4" />Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTeam;
