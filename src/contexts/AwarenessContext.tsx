import { createContext, useContext, useState, ReactNode } from "react";

export interface ContentItem {
  id: string;
  type: "article" | "video" | "infographic";
  title: string;
  category: string;
  description: string;
  content?: string;
  author: string;
  date: string;
  thumbnail: string;
  videoUrl?: string;
  views: number;
  featured?: boolean;
}

interface AwarenessContextType {
  content: ContentItem[];
  addContent: (item: Omit<ContentItem, "id" | "views">) => void;
  updateContent: (id: string, item: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  incrementViews: (id: string) => void;
}

const AwarenessContext = createContext<AwarenessContextType | undefined>(undefined);

const mockContent: ContentItem[] = [
  {
    id: "1",
    type: "article",
    title: "Understanding E-Waste: A Beginner's Guide",
    category: "Sustainability 101",
    description: "Learn what e-waste is, why it matters, and how you can make a difference in your community.",
    content: "Electronic waste, or e-waste, refers to discarded electrical or electronic devices. This includes computers, smartphones, televisions, and more. With technology advancing rapidly, e-waste has become one of the fastest-growing waste streams globally.\n\nThe problem is multifaceted: e-waste contains toxic materials like lead, mercury, and cadmium that can harm the environment and human health when improperly disposed of. Yet, these devices also contain valuable materials like gold, silver, and rare earth elements that can be recovered and reused.\n\nProper e-waste management involves collecting, sorting, and processing electronic devices to recover valuable materials while safely disposing of hazardous components. This circular approach not only protects the environment but also conserves natural resources.",
    author: "Dr. Sarah Johnson",
    date: "2024-10-15",
    thumbnail: "/placeholder.svg",
    views: 1250,
    featured: true,
  },
  {
    id: "2",
    type: "video",
    title: "How to Prepare Your Device for Recycling",
    category: "Recycle Tips",
    description: "Step-by-step video guide on safely preparing your electronics for the recycling process.",
    author: "Green Tech Team",
    date: "2024-10-12",
    thumbnail: "/placeholder.svg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    views: 890,
    featured: true,
  },
  {
    id: "3",
    type: "article",
    title: "The Hidden Environmental Cost of Electronics",
    category: "Tech & Environment",
    description: "Exploring the carbon footprint and environmental impact of manufacturing and disposing electronic devices.",
    content: "Every electronic device we use has an environmental story that begins long before it reaches our hands. The production of a single smartphone requires mining rare earth elements from multiple continents, intensive manufacturing processes, and global shipping networks.\n\nThe environmental cost includes:\n- Mining operations that disrupt ecosystems and consume vast amounts of water\n- Manufacturing processes that require significant energy, often from fossil fuels\n- Transportation emissions from global supply chains\n- End-of-life disposal challenges when devices are discarded\n\nBy understanding these impacts, we can make more informed decisions about when to upgrade our devices, how to extend their lifespan, and the importance of proper recycling when they reach end-of-life.",
    author: "Michael Chen",
    date: "2024-10-10",
    thumbnail: "/placeholder.svg",
    views: 2100,
  },
  {
    id: "4",
    type: "infographic",
    title: "E-Waste by the Numbers: 2024 Global Statistics",
    category: "Tech & Environment",
    description: "Visual breakdown of global e-waste generation, recycling rates, and projections for the future.",
    author: "Data Visualization Team",
    date: "2024-10-08",
    thumbnail: "/placeholder.svg",
    views: 1580,
  },
  {
    id: "5",
    type: "article",
    title: "Safe Disposal: What Not to Throw in Regular Trash",
    category: "Safe Disposal",
    description: "Essential guide on identifying electronics that require special disposal and where to take them.",
    content: "Many electronic items contain hazardous materials that should never end up in regular landfills. Here's what you need to know:\n\nNEVER throw these in regular trash:\n- Batteries (all types)\n- CRT monitors and TVs\n- Fluorescent bulbs\n- Computers and laptops\n- Mobile phones\n- Printers and copiers\n\nThese items contain materials like mercury, lead, and lithium that can contaminate soil and water if not properly handled. Instead, use designated e-waste collection points, manufacturer take-back programs, or certified recycling facilities.\n\nMany retailers now offer free recycling for small electronics, and communities often host e-waste collection events. Check your local municipality's website for options in your area.",
    author: "Emma Rodriguez",
    date: "2024-10-05",
    thumbnail: "/placeholder.svg",
    views: 1890,
    featured: true,
  },
  {
    id: "6",
    type: "video",
    title: "Inside an E-Waste Recycling Facility",
    category: "Recycle Tips",
    description: "Take a virtual tour of a state-of-the-art e-waste recycling facility and see how devices are processed.",
    author: "EcoTech Media",
    date: "2024-10-03",
    thumbnail: "/placeholder.svg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    views: 3200,
  },
  {
    id: "7",
    type: "article",
    title: "Extending Device Lifespan: Simple Maintenance Tips",
    category: "Reusing Components",
    description: "Practical advice on maintaining your electronics to extend their useful life and delay replacement.",
    content: "The most sustainable device is the one you already own. Here are proven strategies to extend your electronics' lifespan:\n\n1. Keep it clean: Dust and debris can cause overheating and component failure\n2. Manage battery health: Avoid extreme temperatures and frequent full discharges\n3. Update software regularly: Security patches and performance improvements\n4. Use protective cases: Physical damage is a leading cause of premature replacement\n5. Upgrade components when possible: RAM and storage upgrades can breathe new life into older devices\n\nBy maintaining your devices properly, you can often double their useful life, saving money and reducing environmental impact.",
    author: "Tech Maintenance Experts",
    date: "2024-10-01",
    thumbnail: "/placeholder.svg",
    views: 1650,
  },
  {
    id: "8",
    type: "article",
    title: "The Circular Economy: Rethinking Electronics",
    category: "Sustainability 101",
    description: "Understanding how circular economy principles can transform the electronics industry.",
    content: "The traditional linear model of 'take-make-dispose' is unsustainable for electronics. The circular economy offers an alternative:\n\nKey principles:\n- Design for longevity and repairability\n- Maximize reuse and refurbishment\n- Recover and recycle materials\n- Minimize waste at every stage\n\nCompanies are beginning to embrace these principles through modular design, repair programs, and take-back schemes. As consumers, we can support this transition by choosing repairable devices, participating in trade-in programs, and properly recycling at end-of-life.",
    author: "Dr. Patricia Williams",
    date: "2024-09-28",
    thumbnail: "/placeholder.svg",
    views: 980,
  },
];

export const AwarenessProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ContentItem[]>(mockContent);

  const addContent = (item: Omit<ContentItem, "id" | "views">) => {
    const newItem: ContentItem = {
      ...item,
      id: Date.now().toString(),
      views: 0,
    };
    setContent((prev) => [newItem, ...prev]);
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    setContent((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteContent = (id: string) => {
    setContent((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementViews = (id: string) => {
    setContent((prev) => prev.map((item) => (item.id === id ? { ...item, views: item.views + 1 } : item)));
  };

  return (
    <AwarenessContext.Provider value={{ content, addContent, updateContent, deleteContent, incrementViews }}>
      {children}
    </AwarenessContext.Provider>
  );
};

export const useAwareness = () => {
  const context = useContext(AwarenessContext);
  if (!context) {
    throw new Error("useAwareness must be used within AwarenessProvider");
  }
  return context;
};
