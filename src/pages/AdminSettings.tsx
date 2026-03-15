import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Settings, ToggleLeft, Mail, Key, Shield, CreditCard, Bell,
  Globe, Clock, Palette, Upload, AlertTriangle, Power,
  Check, X, Copy, RefreshCw, Send, Eye, Webhook,
  Server, Database, Zap, Lock, Users, FileText, DollarSign,
  Percent, Calendar, BarChart3, ChevronRight, ExternalLink,
  Activity, Wifi, WifiOff, Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

// Feature Flags
const FEATURE_FLAGS = [
  { name: "New Dashboard UI", key: "dashboard_v2", enabled: true, rollout: 75, users: "3,925" },
  { name: "AI Recommendations", key: "ai_recs", enabled: true, rollout: 30, users: "1,570" },
  { name: "Dark Mode V2", key: "dark_mode_v2", enabled: false, rollout: 0, users: "0" },
  { name: "Swap Marketplace", key: "swap_market", enabled: true, rollout: 100, users: "5,234" },
  { name: "Social Login", key: "social_login", enabled: true, rollout: 50, users: "2,617" },
  { name: "Gamification", key: "gamification", enabled: false, rollout: 0, users: "0" },
];

const INTEGRATIONS = [
  { name: "Stripe", status: "connected", icon: CreditCard, lastSync: "2 min ago" },
  { name: "SendGrid", status: "connected", icon: Mail, lastSync: "5 min ago" },
  { name: "Google Analytics", status: "connected", icon: BarChart3, lastSync: "1 min ago" },
  { name: "Slack", status: "error", icon: MessageSquareIcon, lastSync: "Failed" },
  { name: "AWS S3", status: "connected", icon: Database, lastSync: "30 sec ago" },
  { name: "Twilio", status: "disconnected", icon: Phone, lastSync: "Never" },
];

function MessageSquareIcon({ className }: { className?: string }) {
  return <Mail className={className} />;
}

function Phone({ className }: { className?: string }) {
  return <Bell className={className} />;
}

const WEBHOOKS = [
  { url: "https://api.example.com/webhooks/orders", events: ["order.created", "order.updated"], active: true },
  { url: "https://hooks.slack.com/services/...", events: ["user.registered"], active: true },
  { url: "https://n8n.example.com/webhook/...", events: ["gadget.submitted"], active: false },
];

const EMAIL_TEMPLATES = [
  { name: "Welcome Email", subject: "Welcome to TripleG!", lastEdited: "2 days ago", sent: "1,245" },
  { name: "Password Reset", subject: "Reset your password", lastEdited: "1 week ago", sent: "432" },
  { name: "Order Confirmation", subject: "Your order is confirmed", lastEdited: "3 days ago", sent: "890" },
  { name: "Weekly Digest", subject: "Your weekly summary", lastEdited: "Today", sent: "5,234" },
];

const AUDIT_LOG = [
  { action: "Feature flag updated", user: "admin@tripleG.com", time: "2 min ago", detail: "ai_recs rollout → 30%" },
  { action: "API key generated", user: "admin@tripleG.com", time: "1 hour ago", detail: "Production key created" },
  { action: "Webhook added", user: "chioma@tripleG.com", time: "3 hours ago", detail: "Slack notification hook" },
  { action: "SMTP settings updated", user: "admin@tripleG.com", time: "1 day ago", detail: "Provider changed to SendGrid" },
  { action: "Maintenance mode toggled", user: "admin@tripleG.com", time: "2 days ago", detail: "Enabled for 2 hours" },
];

const AdminSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [flags, setFlags] = useState(FEATURE_FLAGS);

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled, rollout: !f.enabled ? 10 : 0 } : f))
    );
  };

  const updateRollout = (key: string, value: number) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, rollout: value } : f))
    );
  };

  return (
    <AdminLayout title="System Settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">System Configuration</h1>
        <p className="text-sm text-muted-foreground">Manage platform settings, integrations, and security</p>
      </div>

      <Card className="glass">
        <Tabs defaultValue="general" className="p-4 lg:p-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-muted/30 h-auto gap-1 p-1">
            <TabsTrigger value="general" className="text-xs gap-1"><Settings className="w-3.5 h-3.5" /> General</TabsTrigger>
            <TabsTrigger value="features" className="text-xs gap-1"><ToggleLeft className="w-3.5 h-3.5" /> Features</TabsTrigger>
            <TabsTrigger value="email" className="text-xs gap-1"><Mail className="w-3.5 h-3.5" /> Email</TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs gap-1"><Key className="w-3.5 h-3.5" /> Integrations</TabsTrigger>
            <TabsTrigger value="security" className="text-xs gap-1"><Shield className="w-3.5 h-3.5" /> Security</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs gap-1"><CreditCard className="w-3.5 h-3.5" /> Payments</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs gap-1"><Bell className="w-3.5 h-3.5" /> Notifications</TabsTrigger>
          </TabsList>

          {/* GENERAL TAB */}
          <TabsContent value="general" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Site Identity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Site Name</Label>
                  <Input defaultValue="TripleG E-Waste Platform" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Tagline</Label>
                  <Input defaultValue="Recycle. Earn. Sustain." className="bg-muted/30 border-border/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Logo</Label>
                  <div className="h-24 rounded-lg border-2 border-dashed border-border/50 bg-muted/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/30 transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload logo</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Favicon</Label>
                  <div className="h-24 rounded-lg border-2 border-dashed border-border/50 bg-muted/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/30 transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload favicon</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Brand Colors</Label>
                  <div className="h-24 rounded-lg border border-border/50 bg-muted/20 p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent" />
                      <span className="text-xs text-muted-foreground">Accent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary" />
                      <span className="text-xs text-muted-foreground">Secondary</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Timezone & Locale
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Timezone</Label>
                  <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                    <option>Africa/Lagos (WAT +01:00)</option>
                    <option>UTC (UTC +00:00)</option>
                    <option>America/New_York (EST -05:00)</option>
                    <option>Europe/London (GMT +00:00)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Date Format</Label>
                  <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Default Language</Label>
                  <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                    <option>English</option>
                    <option>French</option>
                    <option>Arabic</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" /> Maintenance Mode
              </h4>
              <div className="p-4 rounded-lg border border-border/30 bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground font-medium">
                    {maintenanceMode ? "Maintenance Mode Active" : "Maintenance Mode"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {maintenanceMode
                      ? "Site is currently in maintenance mode. Only admins can access."
                      : "Enable to show maintenance page to all non-admin users"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {maintenanceMode && (
                    <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/30">
                      <Power className="w-3 h-3 mr-1" /> Active
                    </Badge>
                  )}
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Environment</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { env: "Development", color: "bg-blue-500/15 text-blue-400 border-blue-500/30", active: false },
                  { env: "Staging", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30", active: false },
                  { env: "Production", color: "bg-primary/15 text-primary border-primary/30", active: true },
                ].map((e) => (
                  <div key={e.env} className={cn(
                    "p-3 rounded-lg border text-center",
                    e.active ? "border-primary/30 bg-primary/5" : "border-border/30 bg-muted/20"
                  )}>
                    <Badge className={e.color}>{e.env}</Badge>
                    {e.active && <p className="text-[10px] text-primary mt-1.5">Current</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-gradient-primary text-primary-foreground">Save Settings</Button>
            </div>
          </TabsContent>

          {/* FEATURES TAB */}
          <TabsContent value="features" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Feature Flags</h4>
                <p className="text-xs text-muted-foreground">Control feature visibility and gradual rollouts</p>
              </div>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground text-xs">Add Flag</Button>
            </div>

            <div className="space-y-3">
              {flags.map((flag) => (
                <motion.div
                  key={flag.key}
                  layout
                  className="p-4 rounded-lg bg-muted/20 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Switch checked={flag.enabled} onCheckedChange={() => toggleFlag(flag.key)} />
                      <div>
                        <p className="text-sm text-foreground font-medium">{flag.name}</p>
                        <code className="text-[10px] text-muted-foreground font-mono">{flag.key}</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        flag.enabled ? "border-primary/30 text-primary" : "border-muted-foreground/30 text-muted-foreground"
                      )}>
                        {flag.enabled ? "Active" : "Disabled"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{flag.users} users</span>
                    </div>
                  </div>
                  {flag.enabled && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Rollout: {flag.rollout}%</span>
                        <div className="flex gap-1">
                          {[10, 25, 50, 75, 100].map((v) => (
                            <button
                              key={v}
                              onClick={() => updateRollout(flag.key, v)}
                              className={cn(
                                "px-2 py-0.5 rounded text-[10px] transition-colors",
                                flag.rollout === v
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted/40 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {v}%
                            </button>
                          ))}
                        </div>
                      </div>
                      <Progress value={flag.rollout} className="h-1.5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" /> Emergency Kill Switches
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Disable Registrations", desc: "Stop new user signups", active: false },
                  { label: "Read-Only Mode", desc: "Prevent all write operations", active: false },
                  { label: "Disable Payments", desc: "Stop all payment processing", active: false },
                  { label: "Emergency Lockdown", desc: "Restrict to admin-only access", active: false },
                ].map((sw) => (
                  <div key={sw.label} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div>
                      <p className="text-sm text-foreground">{sw.label}</p>
                      <p className="text-xs text-muted-foreground">{sw.desc}</p>
                    </div>
                    <Switch defaultChecked={sw.active} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* EMAIL TAB */}
          <TabsContent value="email" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">SMTP Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">SMTP Host</Label>
                  <Input defaultValue="smtp.sendgrid.net" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Port</Label>
                  <Input defaultValue="587" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Username</Label>
                  <Input defaultValue="apikey" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Password</Label>
                  <Input type="password" defaultValue="••••••••••" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">From Email</Label>
                  <Input defaultValue="noreply@tripleg.com" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">From Name</Label>
                  <Input defaultValue="TripleG Platform" className="bg-muted/30 border-border/50" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-xs gap-1"><Send className="w-3 h-3" /> Send Test Email</Button>
                <Button className="bg-gradient-primary text-primary-foreground text-xs">Save SMTP</Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Email Templates</h4>
                <Button size="sm" variant="outline" className="text-xs">Create Template</Button>
              </div>
              <div className="space-y-2">
                {EMAIL_TEMPLATES.map((t) => (
                  <div key={t.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="text-sm text-foreground font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">Subject: {t.subject}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{t.sent} sent</span>
                      <span className="text-xs text-muted-foreground">{t.lastEdited}</span>
                      <Button size="sm" variant="outline" className="text-xs gap-1"><Eye className="w-3 h-3" /> Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* INTEGRATIONS TAB */}
          <TabsContent value="integrations" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Connected Services</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTEGRATIONS.map((int) => {
                  const Icon = int.icon;
                  return (
                    <div key={int.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          int.status === "connected" && "bg-primary/10",
                          int.status === "error" && "bg-destructive/10",
                          int.status === "disconnected" && "bg-muted/40"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            int.status === "connected" && "text-primary",
                            int.status === "error" && "text-destructive",
                            int.status === "disconnected" && "text-muted-foreground"
                          )} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{int.name}</p>
                          <p className="text-xs text-muted-foreground">Last sync: {int.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          int.status === "connected" && "bg-primary",
                          int.status === "error" && "bg-destructive animate-pulse",
                          int.status === "disconnected" && "bg-muted-foreground/40"
                        )} />
                        <Button size="sm" variant="outline" className="text-xs">
                          {int.status === "disconnected" ? "Connect" : "Configure"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Webhook className="w-4 h-4" /> Webhooks
                </h4>
                <Button size="sm" className="bg-gradient-primary text-primary-foreground text-xs">Add Webhook</Button>
              </div>
              <div className="space-y-2">
                {WEBHOOKS.map((wh, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-xs font-mono text-foreground truncate max-w-[300px]">{wh.url}</code>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={wh.active} />
                        <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {wh.events.map((ev) => (
                        <Badge key={ev} variant="outline" className="text-[10px] border-border/30">{ev}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">API Rate Limiting</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Default Rate", value: "100 req/min", usage: 45 },
                  { label: "Burst Rate", value: "500 req/min", usage: 12 },
                  { label: "Daily Limit", value: "50,000 req", usage: 67 },
                ].map((rl) => (
                  <Card key={rl.label} className="p-4 bg-muted/20 border-border/30">
                    <p className="text-xs text-muted-foreground">{rl.label}</p>
                    <p className="text-lg font-bold text-foreground mb-2">{rl.value}</p>
                    <Progress value={rl.usage} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">{rl.usage}% used</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Password Policy</h4>
              <div className="space-y-3">
                {[
                  { label: "Minimum length", value: "8 characters", adjustable: true },
                  { label: "Require uppercase", value: "At least 1 uppercase letter", toggle: true, on: true },
                  { label: "Require numbers", value: "At least 1 number", toggle: true, on: true },
                  { label: "Require special chars", value: "At least 1 special character", toggle: true, on: false },
                  { label: "Password expiry", value: "90 days", adjustable: true },
                ].map((p) => (
                  <div key={p.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                    <div>
                      <p className="text-sm text-foreground">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.value}</p>
                    </div>
                    {p.toggle !== undefined ? (
                      <Switch defaultChecked={p.on} />
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">2FA Enforcement</h4>
              <div className="space-y-3">
                {[
                  { label: "Require 2FA for admins", desc: "All admin accounts must enable 2FA", on: true },
                  { label: "Require 2FA for all users", desc: "Force all users to set up 2FA", on: false },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                    <div>
                      <p className="text-sm text-foreground">{rule.label}</p>
                      <p className="text-xs text-muted-foreground">{rule.desc}</p>
                    </div>
                    <Switch defaultChecked={rule.on} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Timer className="w-4 h-4" /> Session Configuration
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Session Timeout</Label>
                  <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>24 hours</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Max Concurrent Sessions</Label>
                  <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                    <option>3</option>
                    <option>5</option>
                    <option>10</option>
                    <option>Unlimited</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">IP Whitelist</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input placeholder="Enter IP address (e.g., 192.168.1.0/24)" className="bg-muted/30 border-border/50" />
                  <Button variant="outline" className="shrink-0">Add IP</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["192.168.1.0/24", "10.0.0.0/8", "203.0.113.0/24"].map((ip) => (
                    <Badge key={ip} variant="outline" className="text-xs gap-1 border-border/30">
                      {ip} <X className="w-3 h-3 cursor-pointer hover:text-destructive" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Audit Log</h4>
              <div className="space-y-1">
                {AUDIT_LOG.map((log, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.detail} — {log.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* PAYMENTS TAB */}
          <TabsContent value="payments" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Payment Gateway</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Gateway Provider</Label>
                  <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                    <option>Stripe</option>
                    <option>Paystack</option>
                    <option>Flutterwave</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">API Key</Label>
                  <Input type="password" defaultValue="••••••••••" className="bg-muted/30 border-border/50" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Fee Structure
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Platform Fee", value: "2.5%", desc: "Applied to all transactions" },
                  { label: "Processing Fee", value: "1.4% + ₦100", desc: "Payment gateway charges" },
                  { label: "Payout Fee", value: "₦50", desc: "Per payout transfer" },
                ].map((fee) => (
                  <Card key={fee.label} className="p-4 bg-muted/20 border-border/30">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">{fee.label}</p>
                      <Button size="sm" variant="ghost" className="h-6 text-xs text-primary">Edit</Button>
                    </div>
                    <p className="text-lg font-bold text-foreground">{fee.value}</p>
                    <p className="text-[10px] text-muted-foreground">{fee.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Currency Management</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: "NGN", name: "Nigerian Naira", active: true },
                  { code: "USD", name: "US Dollar", active: true },
                  { code: "GBP", name: "British Pound", active: false },
                  { code: "EUR", name: "Euro", active: false },
                  { code: "GHS", name: "Ghanaian Cedi", active: false },
                ].map((cur) => (
                  <div key={cur.code} className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer",
                    cur.active
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border/30 bg-muted/20 text-muted-foreground hover:border-border/60"
                  )}>
                    <span className="font-mono text-sm font-bold">{cur.code}</span>
                    <span className="text-xs">{cur.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Payout Schedule
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Payout Frequency</Label>
                  <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                    <option>Weekly (Fridays)</option>
                    <option>Bi-weekly</option>
                    <option>Monthly (1st)</option>
                    <option>On demand</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Minimum Payout</Label>
                  <Input defaultValue="₦5,000" className="bg-muted/30 border-border/50" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-gradient-primary text-primary-foreground">Save Payment Settings</Button>
            </div>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Push Notification Templates</h4>
              <div className="space-y-2">
                {[
                  { name: "Welcome Push", trigger: "User registration", status: "active" },
                  { name: "Gadget Approved", trigger: "Gadget review approved", status: "active" },
                  { name: "Points Earned", trigger: "Points credited", status: "active" },
                  { name: "Swap Available", trigger: "Matching swap found", status: "draft" },
                ].map((tmpl) => (
                  <div key={tmpl.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                    <div>
                      <p className="text-sm text-foreground font-medium">{tmpl.name}</p>
                      <p className="text-xs text-muted-foreground">Trigger: {tmpl.trigger}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        tmpl.status === "active" ? "border-primary/30 text-primary" : "border-muted-foreground/30 text-muted-foreground"
                      )}>
                        {tmpl.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Alert Thresholds</h4>
              <div className="space-y-3">
                {[
                  { label: "Server CPU > 90%", desc: "Alert when CPU usage exceeds threshold", on: true },
                  { label: "Error rate > 5%", desc: "Alert when error rate spikes", on: true },
                  { label: "Low storage < 10%", desc: "Alert when storage runs low", on: true },
                  { label: "Failed logins > 10", desc: "Alert on excessive failed login attempts", on: false },
                ].map((alert) => (
                  <div key={alert.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                    <div>
                      <p className="text-sm text-foreground">{alert.label}</p>
                      <p className="text-xs text-muted-foreground">{alert.desc}</p>
                    </div>
                    <Switch defaultChecked={alert.on} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">SMS Gateway</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Provider</Label>
                  <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                    <option>Twilio</option>
                    <option>Africa's Talking</option>
                    <option>Termii</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">API Key</Label>
                  <Input type="password" defaultValue="••••••••••" className="bg-muted/30 border-border/50" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-gradient-primary text-primary-foreground">Save Notification Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
