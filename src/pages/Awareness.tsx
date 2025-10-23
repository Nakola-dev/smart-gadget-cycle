import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  BookOpen,
  Recycle,
  Cpu,
  Lightbulb,
  TrendingUp,
  Video,
  FileText,
  Image as ImageIcon,
  Play,
  Share2,
  ArrowLeft,
  Plus,
  Users,
  Eye,
  FileCheck,
  Edit,
  Trash2,
} from "lucide-react";
import { AwarenessProvider, useAwareness, ContentItem } from "@/contexts/AwarenessContext";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const categories = [
  { name: "All", icon: BookOpen, emoji: "📚" },
  { name: "Recycle Tips", icon: Recycle, emoji: "♻️" },
  { name: "Safe Disposal", icon: Cpu, emoji: "⚙️" },
  { name: "Reusing Components", icon: Lightbulb, emoji: "🔋" },
  { name: "Sustainability 101", icon: TrendingUp, emoji: "🧠" },
  { name: "Tech & Environment", icon: TrendingUp, emoji: "📈" },
];

const AwarenessContent = () => {
  const { content, addContent, updateContent, deleteContent, incrementViews } = useAwareness();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "popularity">("date");
  const [selectedArticle, setSelectedArticle] = useState<ContentItem | null>(null);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isAdmin = localStorage.getItem("userRole") === "admin";

  // Form state for admin
  const [formData, setFormData] = useState({
    type: "article" as ContentItem["type"],
    title: "",
    category: "Recycle Tips",
    description: "",
    content: "",
    author: "",
    thumbnail: "/placeholder.svg",
    videoUrl: "",
    featured: false,
  });

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenArticle = (item: ContentItem) => {
    setSelectedArticle(item);
    incrementViews(item.id);
    if (item.type === "video") {
      setIsVideoDialogOpen(true);
    } else {
      setIsArticleDialogOpen(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleSubmitContent = () => {
    if (!formData.title || !formData.description || !formData.author) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEditMode && editingItem) {
      updateContent(editingItem.id, {
        ...formData,
        date: editingItem.date, // Keep original date
      });
      toast.success("Content updated successfully!");
    } else {
      addContent({
        ...formData,
        date: new Date().toISOString().split("T")[0],
      });
      toast.success("Content added successfully!");
    }

    setIsAdminDialogOpen(false);
    resetForm();
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setIsEditMode(true);
    setFormData({
      type: item.type,
      title: item.title,
      category: item.category,
      description: item.description,
      content: item.content || "",
      author: item.author,
      thumbnail: item.thumbnail,
      videoUrl: item.videoUrl || "",
      featured: item.featured || false,
    });
    setIsAdminDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this content?")) {
      deleteContent(id);
      toast.success("Content deleted successfully!");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "article",
      title: "",
      category: "Recycle Tips",
      description: "",
      content: "",
      author: "",
      thumbnail: "/placeholder.svg",
      videoUrl: "",
      featured: false,
    });
    setIsEditMode(false);
    setEditingItem(null);
  };

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let filtered = content.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      filtered.sort((a, b) => b.views - a.views);
    }

    return filtered;
  }, [content, searchQuery, selectedCategory, sortBy]);

  const featuredVideos = content.filter((item) => item.type === "video" && item.featured);

  // Stats
  const totalArticles = content.length;
  const totalViews = content.reduce((sum, item) => sum + item.views, 0);
  const categoryStats = categories
    .filter((cat) => cat.name !== "All")
    .map((cat) => ({
      name: cat.name.split(" ")[0],
      views: content.filter((item) => item.category === cat.name).reduce((sum, item) => sum + item.views, 0),
    }));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl font-bold mb-6"
            >
              Learn. Act. Recycle.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl text-muted-foreground mb-12"
            >
              Empowering you to make responsible e-waste decisions through knowledge
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button size="lg" onClick={scrollToContent} className="bg-gradient-primary hover:opacity-90 text-lg px-8">
                Browse Learning Hub
              </Button>
              {isAdmin && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAdminDialogOpen(true);
                  }}
                  className="text-lg px-8"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Content
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16" ref={contentRef}>
        <div className="max-w-7xl mx-auto">
          {/* Admin Stats Dashboard */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Content Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 shadow-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Articles</p>
                      <p className="text-3xl font-bold">{totalArticles}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 shadow-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 shadow-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Users Educated</p>
                      <p className="text-3xl font-bold">4,200+</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6 shadow-card">
                <h3 className="text-lg font-bold mb-4">Views by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          )}

          {/* Category Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.name
                      ? "bg-gradient-primary text-white shadow-primary"
                      : "bg-card hover:bg-muted border border-border"
                  }`}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="p-6 shadow-card">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles, videos, or guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={(value: "date" | "popularity") => setSortBy(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="popularity">Sort by Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>

          {/* Featured Videos Section */}
          {featuredVideos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Featured Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card
                      className="overflow-hidden shadow-card hover:shadow-primary transition-all cursor-pointer"
                      onClick={() => handleOpenArticle(video)}
                    >
                      <div className="relative">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-primary ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Content Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {selectedCategory === "All" ? "All Content" : selectedCategory}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Card className="overflow-hidden shadow-card hover:shadow-primary transition-all h-full flex flex-col">
                    <div className="relative">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className="bg-background/90 backdrop-blur-sm">
                          {item.type === "article" && <FileText className="w-3 h-3 mr-1" />}
                          {item.type === "video" && <Video className="w-3 h-3 mr-1" />}
                          {item.type === "infographic" && <ImageIcon className="w-3 h-3 mr-1" />}
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <Badge variant="secondary" className="w-fit mb-3">
                        {item.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-grow">{item.description}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{item.author}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {item.views}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleOpenArticle(item)} className="flex-1 bg-gradient-primary hover:opacity-90">
                          Read More
                        </Button>
                        {isAdmin && (
                          <>
                            <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-12 bg-gradient-hero shadow-primary">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-8">Our Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                  <div>
                    <p className="text-5xl font-bold mb-2">4,200+</p>
                    <p className="text-white/90 text-lg">Users Educated</p>
                  </div>
                  <div>
                    <p className="text-5xl font-bold mb-2">3.8</p>
                    <p className="text-white/90 text-lg">Tons CO₂ Saved</p>
                  </div>
                  <div>
                    <p className="text-5xl font-bold mb-2">{totalArticles}</p>
                    <p className="text-white/90 text-lg">Guides Published</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Article Detail Dialog */}
      <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedArticle && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{selectedArticle.category}</Badge>
                  <Badge>
                    {selectedArticle.type === "article" && <FileText className="w-3 h-3 mr-1" />}
                    {selectedArticle.type === "infographic" && <ImageIcon className="w-3 h-3 mr-1" />}
                    {selectedArticle.type}
                  </Badge>
                </div>
                <DialogTitle className="text-3xl">{selectedArticle.title}</DialogTitle>
                <DialogDescription className="text-base">
                  By {selectedArticle.author} • {new Date(selectedArticle.date).toLocaleDateString()} • {selectedArticle.views}{" "}
                  views
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6">
                <img
                  src={selectedArticle.thumbnail}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="prose prose-lg max-w-none">
                  {selectedArticle.content?.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  <Button onClick={handleShare} variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Article
                  </Button>
                  <Button onClick={() => setIsArticleDialogOpen(false)} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Hub
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedArticle && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedArticle.title}</DialogTitle>
                <DialogDescription>
                  By {selectedArticle.author} • {new Date(selectedArticle.date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <iframe
                    src={selectedArticle.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-muted-foreground mb-4">{selectedArticle.description}</p>
                <div className="flex gap-3">
                  <Button onClick={handleShare} variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Video
                  </Button>
                  <Button onClick={() => setIsVideoDialogOpen(false)} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Hub
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin CRUD Dialog */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Content" : "Add New Content"}</DialogTitle>
            <DialogDescription>Fill in the details to {isEditMode ? "update" : "create"} educational content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content Type</label>
              <Select value={formData.type} onValueChange={(value: ContentItem["type"]) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="infographic">Infographic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat.name !== "All")
                    .map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description *</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Author *</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
              />
            </div>
            {formData.type === "article" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article content (use double line breaks for paragraphs)"
                  className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background"
                />
              </div>
            )}
            {formData.type === "video" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Video URL (YouTube Embed)</label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Thumbnail URL</label>
              <Input
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="/placeholder.svg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured Content
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={() => setIsAdminDialogOpen(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmitContent} className="flex-1 bg-gradient-primary hover:opacity-90">
              {isEditMode ? "Update" : "Create"} Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

const Awareness = () => {
  return (
    <AwarenessProvider>
      <AwarenessContent />
    </AwarenessProvider>
  );
};

export default Awareness;
