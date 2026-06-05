import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AwarenessProvider } from "./contexts/AwarenessContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import AdminGadgets from "./pages/AdminGadgets";
import AdminTransactions from "./pages/AdminTransactions";
import AdminOrders from "./pages/AdminOrders";
import AdminTickets from "./pages/AdminTickets";
import AdminFeedback from "./pages/AdminFeedback";
import AdminArticles from "./pages/AdminArticles";
import AdminSwaps from "./pages/AdminSwaps";
import AdminPayouts from "./pages/AdminPayouts";
import AdminSecurity from "./pages/AdminSecurity";
import AdminTeam from "./pages/AdminTeam";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import SubmitGadget from "./pages/SubmitGadget";
import Swap from "./pages/Swap";
import Awareness from "./pages/Awareness";
import Map from "./pages/Map";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/gadgets" element={<AdminGadgets />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/admin/articles" element={<AdminArticles />} />
          <Route path="/admin/swaps" element={<AdminSwaps />} />
          <Route path="/admin/payouts" element={<AdminPayouts />} />
          <Route path="/admin/security" element={<AdminSecurity />} />
          <Route path="/admin/team" element={<AdminTeam />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/submit-gadget" element={<SubmitGadget />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/map" element={<Map />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
