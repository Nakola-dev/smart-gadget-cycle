import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, Search, Plus, MoreHorizontal, Mail, Shield, Ban, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fadeIn = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

const stats = [
  { label: "Total Users", value: "5,234", change: "+12.5%", up: true },
  { label: "Active Today", value: "1,892", change: "+5.3%", up: true },
  { label: "New This Week", value: "342", change: "+18.7%", up: true },
  { label: "Suspended", value: "23", change: "-8.1%", up: true },
];

const users = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", role: "admin", status: "active", joined: "2025-01-15", gadgets: 12 },
  { id: 2, name: "Mike Chen", email: "mike@example.com", role: "user", status: "active", joined: "2025-03-22", gadgets: 8 },
  { id: 3, name: "Emily Davis", email: "emily@example.com", role: "moderator", status: "active", joined: "2025-05-10", gadgets: 15 },
  { id: 4, name: "James Wilson", email: "james@example.com", role: "user", status: "suspended", joined: "2025-07-04", gadgets: 3 },
  { id: 5, name: "Ana Garcia", email: "ana@example.com", role: "user", status: "active", joined: "2025-09-18", gadgets: 22 },
  { id: 6, name: "David Kim", email: "david@example.com", role: "user", status: "pending", joined: "2026-02-28", gadgets: 0 },
];

const roleColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  moderator: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  user: "bg-muted text-muted-foreground border-border",
};

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  suspended: "bg-red-500/10 text-red-500 border-red-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Users" breadcrumbs={[{ label: "Content" }, { label: "Users" }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage platform users and permissions</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add User</Button>
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
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-left p-3 font-medium">Role</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Joined</th>
                <th className="text-right p-3 font-medium">Gadgets</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} {...fadeIn(i)} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3">
                    <div><span className="text-foreground font-medium">{u.name}</span></div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="p-3"><Badge className={`text-xs ${roleColors[u.role]}`}>{u.role}</Badge></td>
                  <td className="p-3"><Badge className={`text-xs ${statusColors[u.status]}`}>{u.status}</Badge></td>
                  <td className="p-3 text-muted-foreground">{u.joined}</td>
                  <td className="p-3 text-right text-foreground">{u.gadgets}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm"><Mail className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm"><MoreHorizontal className="h-3 w-3" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminUsers;
