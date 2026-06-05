import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Plus, Search, Edit, Trash2, Eye, TrendingUp, Clock,
  CheckCircle2, FileEdit, Archive, Calendar, Tag,
} from "lucide-react";
import { useAwareness, ContentItem } from "@/contexts/AwarenessContext";
import { toast } from "sonner";

const CATEGORIES = [
  "Sustainability 101", "Recycle Tips", "Tech & Environment",
  "Safe Disposal", "Reusing Components",
];

const stats = [
  { label: "Published", value: "48", icon: CheckCircle2, color: "text-primary" },
  { label: "Drafts", value: "12", icon: FileEdit, color: "text-accent" },
  { label: "Total Views", value: "24.5K", icon: Eye, color: "text-primary" },
  { label: "Engagement", value: "78%", icon: TrendingUp, color: "text-primary" },
];

const AdminArticles = () => {
  const { content, addContent, updateContent, deleteContent } = useAwareness();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", category: CATEGORIES[0], description: "", content: "",
    author: "", type: "article" as ContentItem["type"], thumbnail: "/placeholder.svg",
  });

  const filtered = content.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || c.category === filterCat;
    return matchSearch && matchCat;
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      title: "", category: CATEGORIES[0], description: "", content: "",
      author: "", type: "article", thumbnail: "/placeholder.svg",
    });
    setOpen(true);
  };

  const openEdit = (item: ContentItem) => {
    setEditing(item);
    setForm({
      title: item.title, category: item.category, description: item.description,
      content: item.content || "", author: item.author, type: item.type,
      thumbnail: item.thumbnail,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.title || !form.author) {
      toast.error("Title and author are required");
      return;
    }
    if (editing) {
      updateContent(editing.id, form);
      toast.success("Article updated");
    } else {
      addContent({ ...form, date: new Date().toISOString().split("T")[0] });
      toast.success("Article created");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    deleteContent(id);
    toast.success("Article deleted");
  };

  return (
    <AdminLayout title="Articles">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Articles & Content</h1>
          <p className="text-sm text-muted-foreground">Manage awareness articles, videos, and infographics</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> New Article
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
                  <Icon className={`w-5 h-5 ${s.color}`} />
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
            <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="infographics">Infographics</TabsTrigger>
          </TabsList>

          {["all", "articles", "videos", "infographics"].map((tab) => {
            const items = tab === "all"
              ? filtered
              : filtered.filter((c) => c.type === tab.slice(0, -1));
            return (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Card className="p-4 glass-hover h-full flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <Badge variant="outline" className="text-[10px] uppercase">{item.type}</Badge>
                            {item.featured && (
                              <Badge className="bg-accent/20 text-accent border-0 text-[10px]">Featured</Badge>
                            )}
                          </div>
                          <h4 className="font-bold text-foreground mb-2 line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3 mt-auto">
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{item.category}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.views.toLocaleString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => openEdit(item)}>
                              <Edit className="w-3 h-3" />Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => remove(item.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {items.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No content found</p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>

      {/* Editor dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Article" : "New Article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                <Select value={form.type} onValueChange={(v: ContentItem["type"]) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="infographic">Infographic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Author</label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Content</label>
              <Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
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

export default AdminArticles;
