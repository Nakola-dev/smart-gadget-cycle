import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Shield, AlertTriangle, CheckCircle2, Lock, Eye, Globe, Activity,
  Ban, Plus, Trash2, KeyRound, FileWarning, Server, Fingerprint,
} from "lucide-react";
import { toast } from "sonner";

const stats = [
  { label: "Security Score", value: "92/100", icon: Shield, color: "text-primary" },
  { label: "Threats Blocked", value: "1,284", icon: Ban, color: "text-destructive" },
  { label: "Active Sessions", value: "47", icon: Activity, color: "text-primary" },
  { label: "Open Alerts", value: "3", icon: AlertTriangle, color: "text-accent" },
];

const auditLog = [
  { id: 1, action: "Admin login", user: "admin@eco.com", ip: "192.168.1.10", time: "2 min ago", risk: "low" },
  { id: 2, action: "Failed login attempt", user: "unknown@test.com", ip: "45.32.18.99", time: "12 min ago", risk: "high" },
  { id: 3, action: "Settings updated", user: "admin@eco.com", ip: "192.168.1.10", time: "1 hr ago", risk: "low" },
  { id: 4, action: "User role changed", user: "moderator@eco.com", ip: "10.0.0.5", time: "3 hr ago", risk: "medium" },
  { id: 5, action: "API key rotated", user: "admin@eco.com", ip: "192.168.1.10", time: "1 day ago", risk: "low" },
];

const threats = [
  { type: "Brute force attempt", source: "45.32.18.99", count: 47, blocked: true },
  { type: "SQL injection", source: "203.0.113.5", count: 12, blocked: true },
  { type: "Rate limit exceeded", source: "198.51.100.8", count: 234, blocked: true },
];

const riskColor: Record<string, string> = {
  low: "bg-primary/15 text-primary",
  medium: "bg-accent/15 text-accent",
  high: "bg-destructive/15 text-destructive",
};

const AdminSecurity = () => {
  const [whitelist, setWhitelist] = useState(["192.168.1.0/24", "10.0.0.0/16"]);
  const [blacklist, setBlacklist] = useState(["45.32.18.99", "203.0.113.5"]);
  const [newIp, setNewIp] = useState("");
  const [twoFA, setTwoFA] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  const [captcha, setCaptcha] = useState(true);
  const [hibp, setHibp] = useState(false);

  const addToList = (list: "white" | "black") => {
    if (!newIp) return;
    if (list === "white") setWhitelist((p) => [...p, newIp]);
    else setBlacklist((p) => [...p, newIp]);
    setNewIp("");
    toast.success(`Added to ${list}list`);
  };

  return (
    <AdminLayout title="Security">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Security Center</h1>
        <p className="text-sm text-muted-foreground">Monitor threats, manage access, and review audit logs</p>
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

      <Card className="glass">
        <Tabs defaultValue="overview" className="p-4 lg:p-6">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="overview"><Shield className="w-4 h-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="access"><Lock className="w-4 h-4 mr-2" />Access</TabsTrigger>
            <TabsTrigger value="audit"><FileWarning className="w-4 h-4 mr-2" />Audit</TabsTrigger>
            <TabsTrigger value="threats"><AlertTriangle className="w-4 h-4 mr-2" />Threats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-foreground mb-4">Security Posture</h3>
              <div className="space-y-4">
                {[
                  { label: "Password Policy", value: 95 },
                  { label: "Network Protection", value: 88 },
                  { label: "Data Encryption", value: 100 },
                  { label: "Access Control", value: 85 },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-foreground">{m.label}</span>
                      <span className="text-muted-foreground">{m.value}%</span>
                    </div>
                    <Progress value={m.value} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-bold text-foreground mb-4">Security Toggles</h3>
              <div className="space-y-3">
                {[
                  { label: "Require 2FA for admins", desc: "Mandatory two-factor authentication", v: twoFA, set: setTwoFA, icon: Fingerprint },
                  { label: "Auto-logout idle sessions", desc: "Log out after 30 min of inactivity", v: autoLogout, set: setAutoLogout, icon: Lock },
                  { label: "CAPTCHA on login", desc: "Bot protection on auth forms", v: captcha, set: setCaptcha, icon: Shield },
                  { label: "Leaked password check", desc: "Block known compromised passwords", v: hibp, set: setHibp, icon: KeyRound },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.label}</p>
                          <p className="text-xs text-muted-foreground">{t.desc}</p>
                        </div>
                      </div>
                      <Switch checked={t.v} onCheckedChange={t.set} />
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="mt-6 space-y-4">
            <Card className="p-5">
              <div className="flex gap-2 mb-4">
                <Input placeholder="192.168.1.0/24 or single IP" value={newIp} onChange={(e) => setNewIp(e.target.value)} />
                <Button variant="outline" onClick={() => addToList("white")} className="gap-1"><Plus className="w-3 h-3" />Whitelist</Button>
                <Button variant="outline" onClick={() => addToList("black")} className="gap-1 text-destructive border-destructive/30"><Ban className="w-3 h-3" />Blacklist</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />Whitelist
                  </h4>
                  <div className="space-y-2">
                    {whitelist.map((ip) => (
                      <div key={ip} className="flex items-center justify-between p-2 rounded-md bg-primary/5 border border-primary/20">
                        <span className="text-sm font-mono text-foreground">{ip}</span>
                        <Button size="sm" variant="ghost" onClick={() => setWhitelist((p) => p.filter((i) => i !== ip))}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <Ban className="w-4 h-4 text-destructive" />Blacklist
                  </h4>
                  <div className="space-y-2">
                    {blacklist.map((ip) => (
                      <div key={ip} className="flex items-center justify-between p-2 rounded-md bg-destructive/5 border border-destructive/20">
                        <span className="text-sm font-mono text-foreground">{ip}</span>
                        <Button size="sm" variant="ghost" onClick={() => setBlacklist((p) => p.filter((i) => i !== ip))}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-3 text-xs text-muted-foreground font-medium">Action</th>
                    <th className="text-left p-3 text-xs text-muted-foreground font-medium">User</th>
                    <th className="text-left p-3 text-xs text-muted-foreground font-medium">IP Address</th>
                    <th className="text-left p-3 text-xs text-muted-foreground font-medium">Risk</th>
                    <th className="text-left p-3 text-xs text-muted-foreground font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((e) => (
                    <tr key={e.id} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-3 text-sm text-foreground">{e.action}</td>
                      <td className="p-3 text-sm text-muted-foreground">{e.user}</td>
                      <td className="p-3 text-sm font-mono text-muted-foreground">{e.ip}</td>
                      <td className="p-3">
                        <Badge className={`${riskColor[e.risk]} border-0 capitalize`}>{e.risk}</Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{e.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="threats" className="mt-6 space-y-3">
            {threats.map((t, i) => (
              <motion.div key={t.type} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/15 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.type}</p>
                      <p className="text-xs text-muted-foreground font-mono">{t.source} • {t.count} attempts</p>
                    </div>
                  </div>
                  <Badge className="bg-primary/15 text-primary border-0 gap-1">
                    <CheckCircle2 className="w-3 h-3" />Blocked
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </AdminLayout>
  );
};

export default AdminSecurity;
