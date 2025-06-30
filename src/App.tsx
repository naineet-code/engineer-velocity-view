
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { Navigation } from "@/components/layout/Navigation";
import Index from "./pages/Index";
import SprintAnalysis from "./pages/SprintAnalysis";
import DeveloperView from "./pages/DeveloperView";
import TicketView from "./pages/TicketView";
import NotFound from "./pages/NotFound";
import SprintCreation from "./pages/SprintCreation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sprint-analysis" element={<SprintAnalysis />} />
              <Route path="/developer-view" element={<DeveloperView />} />
              <Route path="/developer-view/:developerName" element={<DeveloperView />} />
              <Route path="/ticket-view" element={<TicketView />} />
              <Route path="/ticket-view/:ticketId" element={<TicketView />} />
              <Route path="/sprint-planning" element={<SprintCreation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
