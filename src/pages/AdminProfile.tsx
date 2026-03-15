import { useState, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Users, Camera, Shield, Bell, Key, Palette, UsersRound,
  Mail, Phone, MapPin, Globe, Github, Twitter, Linkedin,
  Lock, Eye, EyeOff, Smartphone, Monitor, LogOut, Clock,
  Check, X, Copy, RefreshCw, Sun, Moon, Minus, Plus,
  Trophy, Flame, Star, Zap, Award, Target, Heart,
  Volume2, VolumeX, MessageSquare, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Activity data for streak calendar
const generateActivityData = () => {
  const data: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split("T")[0],
      count: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
    });
  }
  return data;
};

const ACTIVITY_DATA = generateActivityData();

const BADGES = [
  { icon: Trophy, label: "Top Contributor", color: "text-yellow-400", earned: true },
  { icon: Flame, label: "30 Day Streak", color: "text-orange-400", earned: true },
  { icon: Star, label: "1K Reviews", color: "text-primary", earned: true },
  { icon: Zap, label: "Speed Demon", color: "text-blue-400", earned: true },
  { icon: Award, label: "Pioneer", color: "text-purple-400", earned: false },
  { icon: Target, label: "Perfectionist", color: "text-pink-400", earned: false },
  { icon: Heart, label: "Community Hero", color: "text-red-400", earned: false },
];

const SESSIONS = [
  { device: "MacBook Pro", location: "Lagos, Nigeria", ip: "192.168.1.1", time: "Active now", current: true },
  { device: "iPhone 15", location: "Lagos, Nigeria", ip: "192.168.1.2", time: "2 hours ago", current: false },
  { device: "Windows PC", location: "Abuja, Nigeria", ip: "10.0.0.5", time: "3 days ago", current: false },
];

const LOGIN_HISTORY = [
  { time: "Today, 9:15 AM", device: "Chrome on Mac", ip: "192.168.1.1", status: "success" },
  { time: "Yesterday, 6:32 PM", device: "Safari on iPhone", ip: "192.168.1.2", status: "success" },
  { time: "Mar 12, 2:11 PM", device: "Firefox on Windows", ip: "10.0.0.5", status: "success" },
  { time: "Mar 10, 11:45 AM", device: "Unknown Browser", ip: "203.0.113.42", status: "failed" },
  { time: "Mar 8, 8:20 AM", device: "Chrome on Mac", ip: "192.168.1.1", status: "success" },
];

const TEAM_MEMBERS = [
  { name: "Adewale Johnson", email: "adewale@tripleG.com", role: "Admin", status: "online", avatar: "AJ" },
  { name: "Chioma Okafor", email: "chioma@tripleG.com", role: "Moderator", status: "away", avatar: "CO" },
  { name: "Emeka Nwosu", email: "emeka@tripleG.com", role: "Editor", status: "online", avatar: "EN" },
  { name: "Fatima Bello", email: "fatima@tripleG.com", role: "Support", status: "offline", avatar: "FB" },
  { name: "Gabriel Eze", email: "gabriel@tripleG.com", role: "User", status: "online", avatar: "GE" },
];

const API_KEYS = [
  { name: "Production Key", key: "sk_live_abc123...xyz789", created: "Jan 15, 2026", lastUsed: "2 min ago", requests: "12,450" },
  { name: "Development Key", key: "sk_test_def456...uvw012", created: "Feb 1, 2026", lastUsed: "1 hour ago", requests: "3,220" },
  { name: "Staging Key", key: "sk_stg_ghi789...rst345", created: "Mar 1, 2026", lastUsed: "3 days ago", requests: "890" },
];

// Profile Completion
const PROFILE_FIELDS = [
  { label: "Avatar", done: true },
  { label: "Bio", done: true },
  { label: "Phone", done: false },
  { label: "Social Links", done: true },
  { label: "2FA Enabled", done: false },
  { label: "API Key", done: true },
  { label: "Language", done: true },
  { label: "Notification Prefs", done: false },
];

const completionPercent = Math.round(
  (PROFILE_FIELDS.filter((f) => f.done).length / PROFILE_FIELDS.length) * 100
);

// Password strength calculator
function getPasswordStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const strengthColors = ["bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-primary", "bg-accent"];

const AdminProfile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");
  const [fontSize, setFontSize] = useState([14]);
  const [animations, setAnimations] = useState(true);
  const [customCSS, setCustomCSS] = useState("");
  const [accentColor, setAccentColor] = useState("#10B981");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pwStrength = getPasswordStrength(newPassword);

  return (
    <AdminLayout title="Profile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile Management</h1>
        <p className="text-sm text-muted-foreground">Manage your account, preferences, and security</p>
      </div>

      {/* Profile overview row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Avatar + Completion */}
        <Card className="p-6 glass col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <Avatar className="w-24 h-24 border-2 border-primary/30">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">AD</AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-foreground" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <h3 className="font-bold text-foreground text-lg">Admin User</h3>
            <p className="text-sm text-muted-foreground mb-4">admin@tripleG.com</p>

            <div className="w-full">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className="text-primary font-medium">{completionPercent}%</span>
              </div>
              <Progress value={completionPercent} className="h-2" />
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {PROFILE_FIELDS.map((f) => (
                  <span
                    key={f.label}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full",
                      f.done ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {f.done ? "✓" : "○"} {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Streak */}
        <Card className="p-6 glass col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" /> Activity Streak
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">365 day contribution history</p>
            </div>
            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
              <Flame className="w-3 h-3 mr-1" /> 32 day streak
            </Badge>
          </div>
          <div className="grid grid-cols-[repeat(52,1fr)] gap-[3px] overflow-hidden">
            {Array.from({ length: 52 }, (_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, dayIdx) => {
                  const idx = weekIdx * 7 + dayIdx;
                  const item = ACTIVITY_DATA[idx];
                  if (!item) return <div key={dayIdx} className="w-full aspect-square" />;
                  return (
                    <div
                      key={dayIdx}
                      title={`${item.date}: ${item.count} actions`}
                      className={cn(
                        "w-full aspect-square rounded-[2px] transition-colors",
                        item.count === 0 && "bg-muted/40",
                        item.count === 1 && "bg-primary/25",
                        item.count === 2 && "bg-primary/50",
                        item.count === 3 && "bg-primary/75",
                        item.count >= 4 && "bg-primary"
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Badges */}
      <Card className="p-6 glass mb-6">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" /> Achievement Badges
        </h3>
        <div className="flex flex-wrap gap-3">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.label}
                whileHover={{ scale: 1.08, y: -2 }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all",
                  badge.earned
                    ? "border-primary/30 bg-primary/5 glass-hover cursor-default"
                    : "border-border/30 bg-muted/20 opacity-40 grayscale"
                )}
              >
                <Icon className={cn("w-5 h-5", badge.earned ? badge.color : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", badge.earned ? "text-foreground" : "text-muted-foreground")}>
                  {badge.label}
                </span>
                {badge.earned && <Check className="w-3.5 h-3.5 text-primary ml-1" />}
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Main tabs */}
      <Card className="glass">
        <Tabs defaultValue="personal" className="p-4 lg:p-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-muted/30 h-auto gap-1 p-1">
            <TabsTrigger value="personal" className="text-xs gap-1"><User className="w-3.5 h-3.5" /> Personal</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs gap-1"><Bell className="w-3.5 h-3.5" /> Notifications</TabsTrigger>
            <TabsTrigger value="security" className="text-xs gap-1"><Shield className="w-3.5 h-3.5" /> Security</TabsTrigger>
            <TabsTrigger value="api" className="text-xs gap-1"><Key className="w-3.5 h-3.5" /> API Access</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs gap-1"><Palette className="w-3.5 h-3.5" /> Appearance</TabsTrigger>
            <TabsTrigger value="team" className="text-xs gap-1"><UsersRound className="w-3.5 h-3.5" /> Team</TabsTrigger>
            <TabsTrigger value="quick" className="text-xs gap-1"><Zap className="w-3.5 h-3.5" /> Quick</TabsTrigger>
          </TabsList>

          {/* PERSONAL INFO TAB */}
          <TabsContent value="personal" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Full Name</Label>
                <Input defaultValue="Admin User" className="bg-muted/30 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Display Name</Label>
                <Input defaultValue="admin" className="bg-muted/30 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</Label>
                <Input defaultValue="admin@tripleG.com" className="bg-muted/30 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</Label>
                <Input placeholder="+234..." className="bg-muted/30 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</Label>
                <Input defaultValue="Lagos, Nigeria" className="bg-muted/30 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs flex items-center gap-1.5"><Globe className="w-3 h-3" /> Language</Label>
                <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="yo">Yoruba</option>
                  <option value="ig">Igbo</option>
                  <option value="ha">Hausa</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Bio (Markdown supported)</Label>
              <Textarea
                defaultValue="Platform administrator and sustainability advocate. Managing the TripleG e-waste recycling ecosystem."
                className="bg-muted/30 border-border/50 min-h-[100px]"
              />
              <p className="text-[10px] text-muted-foreground">Supports **bold**, *italic*, and [links](url)</p>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs mb-3 block">Social Links</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input placeholder="github.com/username" className="bg-muted/30 border-border/50" />
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input placeholder="twitter.com/username" className="bg-muted/30 border-border/50" />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input placeholder="linkedin.com/in/username" className="bg-muted/30 border-border/50" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-gradient-primary text-primary-foreground">Save Changes</Button>
            </div>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Email Notifications</h4>
              <div className="space-y-3">
                {[
                  { label: "New user registrations", desc: "Get notified when new users sign up", on: true },
                  { label: "Gadget submissions", desc: "Alert when new gadgets are submitted for review", on: true },
                  { label: "Weekly digest", desc: "Summary of platform activity every Monday", on: false },
                  { label: "Payment notifications", desc: "Transaction confirmations and payout updates", on: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                    <div>
                      <p className="text-sm text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.on} />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Email Frequency</Label>
                <select className="w-full h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground">
                  <option>Instant</option>
                  <option>Hourly Digest</option>
                  <option>Daily Digest</option>
                  <option>Weekly Digest</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Push Notifications</h4>
              <div className="space-y-3">
                {[
                  { label: "Critical alerts", desc: "System outages and security events", on: true },
                  { label: "Chat messages", desc: "New messages from team members", on: true },
                  { label: "Task assignments", desc: "When you're assigned new tasks", on: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                    <div>
                      <p className="text-sm text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.on} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> Sound & In-App
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div>
                    <p className="text-sm text-foreground">Notification sounds</p>
                    <p className="text-xs text-muted-foreground">Play a sound for in-app notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Quiet Hours
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Start Time</Label>
                  <Input type="time" defaultValue="22:00" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">End Time</Label>
                  <Input type="time" defaultValue="07:00" className="bg-muted/30 border-border/50" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Emergency Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Emergency contact name" className="bg-muted/30 border-border/50" />
                <Input placeholder="Emergency phone number" className="bg-muted/30 border-border/50" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-gradient-primary text-primary-foreground">Save Preferences</Button>
            </div>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Current Password</Label>
                  <div className="relative">
                    <Input type="password" placeholder="••••••••" className="bg-muted/30 border-border/50" />
                  </div>
                </div>
                <div />
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="bg-muted/30 border-border/50 pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1.5 flex-1 rounded-full transition-colors",
                              i < pwStrength ? strengthColors[pwStrength - 1] : "bg-muted/40"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Strength: {strengthLabels[Math.max(0, pwStrength - 1)]}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Confirm Password</Label>
                  <Input type="password" placeholder="Confirm new password" className="bg-muted/30 border-border/50" />
                </div>
              </div>
              <Button className="bg-gradient-primary text-primary-foreground">Update Password</Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Two-Factor Authentication
              </h4>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground font-medium">2FA is not enabled</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">Enable 2FA</Button>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                <p className="text-sm text-foreground font-medium mb-2">Recovery Codes</p>
                <p className="text-xs text-muted-foreground mb-3">Store these codes safely. Each can be used once to access your account.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {["ABCD-1234", "EFGH-5678", "IJKL-9012", "MNOP-3456", "QRST-7890", "UVWX-1234", "YZAB-5678", "CDEF-9012"].map((code) => (
                    <code key={code} className="text-xs font-mono text-center py-1.5 px-2 rounded bg-muted/40 text-foreground border border-border/30">
                      {code}
                    </code>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs gap-1"><Copy className="w-3 h-3" /> Copy All</Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1"><RefreshCw className="w-3 h-3" /> Regenerate</Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Active Sessions
              </h4>
              <div className="space-y-2">
                {SESSIONS.map((s) => (
                  <div key={s.ip + s.time} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", s.current ? "bg-primary animate-pulse" : "bg-muted-foreground/40")} />
                      <div>
                        <p className="text-sm text-foreground">{s.device}</p>
                        <p className="text-xs text-muted-foreground">{s.location} • {s.ip} • {s.time}</p>
                      </div>
                    </div>
                    {s.current ? (
                      <Badge variant="outline" className="text-primary border-primary/30 text-xs">Current</Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10">
                        <LogOut className="w-3 h-3 mr-1" /> Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Login History</h4>
              <div className="space-y-1">
                {LOGIN_HISTORY.map((l, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      l.status === "success" ? "bg-primary/15" : "bg-destructive/15"
                    )}>
                      {l.status === "success" ? <Check className="w-3 h-3 text-primary" /> : <X className="w-3 h-3 text-destructive" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{l.device}</p>
                      <p className="text-xs text-muted-foreground">{l.time} • {l.ip}</p>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      l.status === "success" ? "border-primary/30 text-primary" : "border-destructive/30 text-destructive"
                    )}>
                      {l.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* API ACCESS TAB */}
          <TabsContent value="api" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">API Keys</h4>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground text-xs">Generate New Key</Button>
            </div>
            <div className="space-y-3">
              {API_KEYS.map((k) => (
                <div key={k.name} className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{k.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs gap-1"><Copy className="w-3 h-3" /> Copy</Button>
                      <Button size="sm" variant="outline" className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10">Revoke</Button>
                    </div>
                  </div>
                  <code className="text-xs font-mono text-muted-foreground">{k.key}</code>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Created: {k.created}</span>
                    <span>Last used: {k.lastUsed}</span>
                    <span>Requests: {k.requests}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">API Usage</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Requests Today", value: "1,245", limit: "10,000" },
                  { label: "Rate Limit", value: "100/min", limit: "Standard" },
                  { label: "Bandwidth", value: "2.4 GB", limit: "10 GB" },
                ].map((stat) => (
                  <Card key={stat.label} className="p-4 bg-muted/20 border-border/30">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">Limit: {stat.limit}</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* APPEARANCE TAB */}
          <TabsContent value="appearance" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Theme</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "light" as const, label: "Light", icon: Sun },
                  { value: "dark" as const, label: "Dark", icon: Moon },
                  { value: "system" as const, label: "System", icon: Monitor },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                        theme === t.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/30 bg-muted/20 text-muted-foreground hover:border-border/60"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Accent Color</h4>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border/30 cursor-pointer"
                />
                <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-32 bg-muted/30 border-border/50 font-mono text-sm" />
                <div className="flex gap-2">
                  {["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setAccentColor(c)}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                        accentColor === c ? "border-foreground scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Density</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "compact" as const, label: "Compact", desc: "More content, less spacing" },
                  { value: "comfortable" as const, label: "Comfortable", desc: "Default spacing" },
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDensity(d.value)}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-all",
                      density === d.value
                        ? "border-primary bg-primary/10"
                        : "border-border/30 bg-muted/20 hover:border-border/60"
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{d.label}</p>
                    <p className="text-xs text-muted-foreground">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center justify-between">
                Font Size
                <span className="text-xs text-muted-foreground font-normal">{fontSize[0]}px</span>
              </h4>
              <div className="flex items-center gap-3">
                <Minus className="w-4 h-4 text-muted-foreground" />
                <Slider value={fontSize} onValueChange={setFontSize} min={10} max={20} step={1} className="flex-1" />
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
              <div>
                <p className="text-sm text-foreground">Animations</p>
                <p className="text-xs text-muted-foreground">Enable motion and transitions</p>
              </div>
              <Switch checked={animations} onCheckedChange={setAnimations} />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Custom CSS (Advanced)</Label>
              <Textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder="/* Your custom styles here */"
                className="bg-muted/30 border-border/50 font-mono text-xs min-h-[80px]"
              />
            </div>

            <div className="flex justify-end">
              <Button className="bg-gradient-primary text-primary-foreground">Apply Theme</Button>
            </div>
          </TabsContent>

          {/* TEAM TAB */}
          <TabsContent value="team" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Team Members</h4>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground text-xs">Invite Member</Button>
            </div>
            <div className="space-y-2">
              {TEAM_MEMBERS.map((m) => (
                <div key={m.email} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">{m.avatar}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                        m.status === "online" && "bg-primary",
                        m.status === "away" && "bg-yellow-400",
                        m.status === "offline" && "bg-muted-foreground/40"
                      )} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      m.role === "Admin" && "border-primary/30 text-primary",
                      m.role === "Moderator" && "border-accent/30 text-accent",
                      m.role === "Editor" && "border-blue-400/30 text-blue-400",
                      m.role === "Support" && "border-yellow-400/30 text-yellow-400",
                      m.role === "User" && "border-muted-foreground/30 text-muted-foreground",
                    )}>
                      {m.role}
                    </Badge>
                    <Button size="sm" variant="outline" className="text-xs">Edit Role</Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Team Activity</h4>
              <div className="space-y-2">
                {[
                  { text: "Adewale approved 3 gadgets", time: "5 min ago" },
                  { text: "Chioma updated notification rules", time: "1 hour ago" },
                  { text: "Emeka published new article", time: "2 hours ago" },
                  { text: "Fatima resolved 5 tickets", time: "4 hours ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <p className="text-sm text-foreground flex-1">{activity.text}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* QUICK ACTIONS TAB */}
          <TabsContent value="quick" className="mt-6 space-y-6">
            <h4 className="text-sm font-semibold text-foreground">Quick Actions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: "Export User Data", icon: Users, desc: "Download CSV of all users" },
                { label: "Clear Cache", icon: RefreshCw, desc: "Purge system cache" },
                { label: "Send Broadcast", icon: MessageSquare, desc: "Message all users" },
                { label: "Generate Report", icon: Target, desc: "Create monthly report" },
                { label: "Backup Database", icon: Shield, desc: "Create instant backup" },
                { label: "View Audit Log", icon: Clock, desc: "Recent system events" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/30 hover:border-primary/30 transition-all text-left"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Performance Metrics</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Avg Response", value: "1.2s" },
                  { label: "Uptime", value: "99.97%" },
                  { label: "Tasks Done", value: "847" },
                  { label: "Satisfaction", value: "4.8/5" },
                ].map((m) => (
                  <Card key={m.label} className="p-4 bg-muted/20 border-border/30 text-center">
                    <p className="text-xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </AdminLayout>
  );
};

export default AdminProfile;
