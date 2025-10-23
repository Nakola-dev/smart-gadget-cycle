import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Laptop, Smartphone, Tablet, Headphones, Award, Search, Filter, Coins, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface SwapItem {
  id: number;
  name: string;
  category: string;
  icon: typeof Laptop;
  points: number;
  cash: number;
  description: string;
  available: boolean;
  image: string;
  condition: "Refurbished" | "Like New" | "Good";
}

interface Transaction {
  id: number;
  itemName: string;
  pointsUsed: number;
  cashUsed: number;
  date: string;
  status: "Completed" | "Pending";
}

const swapItems: SwapItem[] = [
  {
    id: 1,
    name: "Refurbished MacBook Air",
    category: "Laptop",
    icon: Laptop,
    points: 5000,
    cash: 450,
    description: "2020 model, 8GB RAM, 256GB SSD, excellent condition",
    available: true,
    image: "/placeholder.svg",
    condition: "Refurbished",
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    category: "Smartphone",
    icon: Smartphone,
    points: 3500,
    cash: 320,
    description: "Unlocked, good condition, includes charger",
    available: true,
    image: "/placeholder.svg",
    condition: "Good",
  },
  {
    id: 3,
    name: "iPad 9th Gen",
    category: "Tablet",
    icon: Tablet,
    points: 4200,
    cash: 380,
    description: "64GB, Wi-Fi, like new condition",
    available: false,
    image: "/placeholder.svg",
    condition: "Like New",
  },
  {
    id: 4,
    name: "Sony WH-1000XM4",
    category: "Headphones",
    icon: Headphones,
    points: 1800,
    cash: 165,
    description: "Noise-cancelling, excellent condition",
    available: true,
    image: "/placeholder.svg",
    condition: "Refurbished",
  },
  {
    id: 5,
    name: "Refurbished Dell XPS 13",
    category: "Laptop",
    icon: Laptop,
    points: 5500,
    cash: 495,
    description: "2021 model, 16GB RAM, 512GB SSD",
    available: true,
    image: "/placeholder.svg",
    condition: "Like New",
  },
  {
    id: 6,
    name: "iPhone 11",
    category: "Smartphone",
    icon: Smartphone,
    points: 2800,
    cash: 255,
    description: "64GB, good condition, battery health 85%",
    available: true,
    image: "/placeholder.svg",
    condition: "Good",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 1,
    itemName: "Sony WH-1000XM4",
    pointsUsed: 1800,
    cashUsed: 0,
    date: "2024-10-15",
    status: "Completed",
  },
  {
    id: 2,
    itemName: "iPhone 11",
    pointsUsed: 0,
    cashUsed: 255,
    date: "2024-10-10",
    status: "Completed",
  },
];

const Swap = () => {
  const [userPoints, setUserPoints] = useState(1470);
  const [pointsSpent] = useState(4600);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<SwapItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"points" | "cash">("points");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (item: SwapItem) => {
    setSelectedItem(item);
    setPaymentMethod("points");
    setIsDialogOpen(true);
  };

  const handleConfirmSwap = () => {
    if (!selectedItem) return;

    if (paymentMethod === "points") {
      if (userPoints >= selectedItem.points) {
        setUserPoints((prev) => prev - selectedItem.points);
        toast.success(`Successfully claimed ${selectedItem.name} for ${selectedItem.points} points!`);
      } else {
        toast.error(`You need ${selectedItem.points - userPoints} more points to claim this item`);
        setIsDialogOpen(false);
        return;
      }
    } else {
      toast.success(`Successfully purchased ${selectedItem.name} for $${selectedItem.cash}!`);
    }

    setIsDialogOpen(false);
  };

  const filteredItems = swapItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(swapItems.map((item) => item.category)))];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-3">
              ♻️ Swap & Exchange Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trade your earned points or cash for refurbished gadgets and parts
            </p>
          </motion.div>

          {/* User Points Summary - Sticky */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="sticky top-20 z-40 mb-8"
          >
            <Card className="p-6 shadow-primary bg-gradient-hero border-none">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Available Points</p>
                      <motion.p
                        key={userPoints}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold text-white"
                      >
                        {userPoints.toLocaleString()}
                      </motion.p>
                    </div>
                  </div>

                  <div className="w-px h-12 bg-white/20" />

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Coins className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Points Spent</p>
                      <p className="text-3xl font-bold text-white">{pointsSpent.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="w-px h-12 bg-white/20" />

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Total Earned</p>
                      <p className="text-3xl font-bold text-white">{(userPoints + pointsSpent).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6 shadow-card">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for gadgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Items Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Available Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const canAfford = userPoints >= item.points;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="h-full"
                  >
                    <Card className="p-6 shadow-card hover:shadow-primary transition-all h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {item.available ? (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Available</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted">
                              Out of Stock
                            </Badge>
                          )}
                          <Badge variant="secondary">{item.condition}</Badge>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-grow">{item.description}</p>

                      <div className="pt-4 border-t border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Reward Points</p>
                            <p className="text-xl font-bold text-primary">{item.points}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">or Cash</p>
                            <p className="text-xl font-bold text-primary">${item.cash}</p>
                          </div>
                        </div>
                        <Button
                          disabled={!item.available}
                          onClick={() => handleOpenDialog(item)}
                          className="w-full bg-gradient-primary hover:opacity-90"
                        >
                          {!item.available ? "Out of Stock" : "Swap Now"}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
            <Card className="p-6 shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Item</th>
                      <th className="text-left py-3 px-4 font-semibold">Points Used</th>
                      <th className="text-left py-3 px-4 font-semibold">Cash Used</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">{transaction.itemName}</td>
                        <td className="py-3 px-4">{transaction.pointsUsed > 0 ? transaction.pointsUsed.toLocaleString() : "-"}</td>
                        <td className="py-3 px-4">{transaction.cashUsed > 0 ? `$${transaction.cashUsed}` : "-"}</td>
                        <td className="py-3 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <Badge variant={transaction.status === "Completed" ? "default" : "secondary"}>
                            {transaction.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Swap Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Swap</DialogTitle>
            <DialogDescription>Choose your payment method and confirm your exchange.</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                {(() => {
                  const Icon = selectedItem.icon;
                  return <Icon className="w-10 h-10 text-primary" />;
                })()}
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedItem.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={paymentMethod === "points" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("points")}
                    className="h-auto py-4 flex flex-col gap-1"
                  >
                    <span className="text-xs">Reward Points</span>
                    <span className="text-lg font-bold">{selectedItem.points}</span>
                  </Button>
                  <Button
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("cash")}
                    className="h-auto py-4 flex flex-col gap-1"
                  >
                    <span className="text-xs">Cash</span>
                    <span className="text-lg font-bold">${selectedItem.cash}</span>
                  </Button>
                </div>
              </div>

              {paymentMethod === "points" && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Current Balance:</span>
                    <span className="font-semibold">{userPoints.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Required:</span>
                    <span className="font-semibold">{selectedItem.points.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-primary/20">
                    <span className="text-sm font-semibold">Remaining:</span>
                    <span className="font-bold text-primary">
                      {(userPoints - selectedItem.points).toLocaleString()} pts
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSwap} className="bg-gradient-primary hover:opacity-90">
              Confirm Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Swap;
