import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Plus, Search, Edit, Trash2, Package, TrendingUp,
  CheckCircle2, Clock, XCircle, Award, ArrowUpDown, Star,
} from "lucide-react";
import { toast } from "sonner";

interface SwapItem {
  id: string;
  name: string;
  category: string;
  points: number;
  stock: number;
  status: "available" | "low" | "out" | "draft";
  condition: "new" | "refurbished" | "used";
  description: string;
  image: string;
  rating: number;
  swaps: number;
  date: string;
}

const initialItems: SwapItem[] = [
  { id: "1", name: "Refurbished MacBook Air", category: "Laptops", points: 8500, stock: 4, status: "available", condition: "refurbished", description: "M1 chip, 8GB RAM, 256GB SSD. Fully tested.", image: "/placeholder.svg", rating: 4.8, swaps: 23, date: "2025-01-10" },
  { id: "2", name: "Wireless Eco Mouse", category: "Accessories", points: 450, stock: 2, status: "low", condition: "new", description: "Made from recycled plastics.", image: "/placeholder.svg", rating: 4.5, swaps: 87, date: "2025-01-08" },
  { id: "3", name: "iPhone 12 Pro (Refurb)", category: "Phones", points: 6200, stock: 0, status: "out", condition: "refurbished", description: "128GB, Pacific Blue. Battery health 92%.", image: "/placeholder.svg", rating: 4.7, swaps: 41, date: "2025-01-05" },
  { id: "4", name: "USB-C Hub", category: "Accessories", points: 800, stock: 15, status: "available", condition: "new", description: "7-in-1 hub with HDMI, USB 3.0, SD card reader.", image: "/placeholder.svg", rating: 4.6, swaps: 134, date: "2025-01-03" },
  { id: "5", name: "Mechanical Keyboard", category: "Accessories", points: 2400, stock: 0, status: "draft", condition: "new", description: "RGB backlit, hot-swappable switches.", image: "/placeholder.svg", rating: 0, swaps: 0, date: "2025-01-12" },
];

const CATEGORIES = ["Laptops", "Phones", "Accessories", "Tablets", "Components"];

const statusConfig = {
  available: { label: "Available", color: "bg-primary/15 text-primary", icon: CheckCircle2 },
  low: { label: "Low Stock", color: "bg-accent/15 text-accent", icon: Clock },
  out: { label: "Out of Stock", color: "bg-destructive/15 text-destructive", icon: XCircle },
  draft: { label: "Draft", color: "bg-muted/40 text-muted-foreground", icon: Edit },
};

const stats = [
  { label: "Listings", value: "124", icon: ShoppingBag },
  { label: "Total Swaps", value: "2,840", icon: ArrowUpDown },
  { label: "Avg Rating", value: "4.7", icon: Star },
  { label: "Points Issued", value: "98K", icon: Award },
];

const AdminSwaps = () => {
  const [items, setItems] = useState<SwapItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [editing, setEditing] = useState<SwapItem | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", category: CATEGORIES[0], points: 0, stock: 0,
    status: "available" as SwapItem["status"], condition: "new" as SwapItem["condition"],
    description: "", image: "/placeholder.svg",
  });

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || i.category === filterCat;
    return matchSearch && matchCat;
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "", category: CATEGORIES[0], points: 0, stock: 0,
      status: "available", condition: "new", description: "", image: "/placeholder.svg",
    });
    setOpen(true);
  };

  const openEdit = (item: SwapItem) => {
    setEditing(item);
    setForm({
      name: item.name, category: item.category, points: item.points, stock: item.stock,
      status: item.status, condition: item.condition, description: item.description, image: item.image,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
    if (editing) {
      setItems((prev) => prev.map((i) => (i.id === editing.id ? { ...i, ...form } : i)));
      toast.success("Item updated");
    } else {
      const newItem: SwapItem = {
        ...form,
        id: Date.now().toString(),
        rating: 0,
        swaps: 0,
        date: new Date().toISOString().split("T")[0],
      };
      setItems((prev) => [newItem, ...prev]);
      toast.success("Item created");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item deleted");
  };

  return (
    <AdminLayout title="Swaps">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Swap Listings</h1>
          <p className="text-sm text-muted-foreground">Manage refurbished gadgets and reward items</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5 glass-hover">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4 glass mb-4">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="glass">
        <Tabs defaultValue="all" className="p-4 lg:p-6">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="low">Low Stock</TabsTrigger>
            <TabsTrigger value="out">Out</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>

          {(["all", "available", "low", "out", "draft"] as const).map((tab) => {
            const list = tab === "all" ? filtered : filtered.filter((i) => i.status === tab);
            return (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Item</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Category</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Points</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Stock</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Status</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Swaps</th>
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {list.map((item) => {
                          const sc = statusConfig[item.status];
                          const SIcon = sc.icon;
                          return (
                            <motion.tr
                              key={item.id}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                            >
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center shrink-0">
                                    <Package className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                                    <p className="text-[11px] text-muted-foreground capitalize">{item.condition}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-sm text-muted-foreground">{item.category}</td>
                              <td className="p-3 text-sm font-medium text-foreground">{item.points.toLocaleString()}</td>
                              <td className="p-3 text-sm text-foreground">{item.stock}</td>
                              <td className="p-3">
                                <Badge className={`${sc.color} border-0 gap-1`}>
                                  <SIcon className="w-3 h-3" />{sc.label}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="text-sm text-foreground">{item.swaps}</div>
                                {item.rating > 0 && (
                                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Star className="w-3 h-3 fill-accent text-accent" />{item.rating}
                                  </div>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex gap-1">
                                  <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => remove(item.id)}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
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
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No items found</p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Listing" : "New Listing"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Condition</label>
                <Select value={form.condition} onValueChange={(v: SwapItem["condition"]) => setForm({ ...form, condition: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Points</label>
                <Input type="number" value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Stock</label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                <Select value={form.status} onValueChange={(v: SwapItem["status"]) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-gradient-primary text-primary-foreground">
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSwaps;
