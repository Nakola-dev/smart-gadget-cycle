import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MessageSquare, Star, ThumbsUp, ThumbsDown, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeIn = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

const stats = [
  { label: "Total Feedback", value: "1,284", change: "+14.2%", up: true },
  { label: "Avg Rating", value: "4.6/5", change: "+0.2", up: true },
  { label: "Response Rate", value: "89%", change: "+5%", up: true },
  { label: "NPS Score", value: "72", change: "+8", up: true },
];

const feedback = [
  { id: 1, user: "Sarah Johnson", type: "feature", rating: 5, message: "Love the new swap feature! Makes trading gadgets so much easier. Would be great to add a chat option.", date: "2h ago", responded: true },
  { id: 2, user: "Mike Chen", type: "bug", rating: 2, message: "The submit gadget page crashes when I upload more than 3 images at once. Using Chrome on Mac.", date: "5h ago", responded: false },
  { id: 3, user: "Emily Davis", type: "praise", rating: 5, message: "Best e-waste platform I've used! The environmental impact tracker is really motivating.", date: "8h ago", responded: true },
  { id: 4, user: "James Wilson", type: "complaint", rating: 1, message: "My payout has been pending for over a week. Support hasn't responded to my ticket.", date: "12h ago", responded: false },
  { id: 5, user: "Ana Garcia", type: "feature", rating: 4, message: "Would love to see a mobile app version. The website works fine on mobile but a native app would be better.", date: "1d ago", responded: true },
  { id: 6, user: "David Kim", type: "praise", rating: 5, message: "Incredible initiative! Recycled 15 devices through the platform already. Keep up the amazing work!", date: "1d ago", responded: false },
];

const typeColors: Record<string, string> = {
  feature: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  bug: "bg-red-500/10 text-red-500 border-red-500/20",
  praise: "bg-green-500/10 text-green-500 border-green-500/20",
  complaint: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} className={`h-3 w-3 ${s <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

const AdminFeedback = () => (
  <AdminLayout title="Feedback" breadcrumbs={[{ label: "Support" }, { label: "Feedback" }]}>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Feedback</h1>
        <p className="text-sm text-muted-foreground">Review and respond to user feedback</p>
      </div>
      <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-1" />Filter</Button>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <motion.div key={s.label} {...fadeIn(i)}>
          <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <span className={`text-xs flex items-center gap-0.5 text-green-500`}>
              <ArrowUpRight className="h-3 w-3" />{s.change}
            </span>
          </Card>
        </motion.div>
      ))}
    </div>

    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unresponded">Needs Response</TabsTrigger>
        <TabsTrigger value="feature">Features</TabsTrigger>
        <TabsTrigger value="bug">Bugs</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-3">
        {feedback.map((f, i) => (
          <motion.div key={f.id} {...fadeIn(i)}>
            <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{f.user}</span>
                    <Badge className={`text-xs ${typeColors[f.type]}`}>{f.type}</Badge>
                    {f.responded && <Badge variant="outline" className="text-xs">Responded</Badge>}
                  </div>
                  <RatingStars rating={f.rating} />
                  <p className="text-sm text-muted-foreground mt-2">{f.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{f.date}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm"><ThumbsUp className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm"><MessageSquare className="h-3 w-3" /></Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </TabsContent>

      <TabsContent value="unresponded" className="space-y-3">
        {feedback.filter(f => !f.responded).map((f, i) => (
          <motion.div key={f.id} {...fadeIn(i)}>
            <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm border-l-2 border-l-primary">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{f.user}</span>
                <Badge className={`text-xs ${typeColors[f.type]}`}>{f.type}</Badge>
              </div>
              <RatingStars rating={f.rating} />
              <p className="text-sm text-muted-foreground mt-2">{f.message}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">Respond</Button>
                <Button size="sm">Acknowledge</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </TabsContent>

      <TabsContent value="feature" className="space-y-3">
        {feedback.filter(f => f.type === "feature").map((f, i) => (
          <motion.div key={f.id} {...fadeIn(i)}>
            <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
              <span className="text-sm font-medium text-foreground">{f.user}</span>
              <RatingStars rating={f.rating} />
              <p className="text-sm text-muted-foreground mt-2">{f.message}</p>
            </Card>
          </motion.div>
        ))}
      </TabsContent>

      <TabsContent value="bug" className="space-y-3">
        {feedback.filter(f => f.type === "bug").map((f, i) => (
          <motion.div key={f.id} {...fadeIn(i)}>
            <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm border-l-2 border-l-red-500">
              <span className="text-sm font-medium text-foreground">{f.user}</span>
              <RatingStars rating={f.rating} />
              <p className="text-sm text-muted-foreground mt-2">{f.message}</p>
            </Card>
          </motion.div>
        ))}
      </TabsContent>
    </Tabs>
  </AdminLayout>
);

export default AdminFeedback;
