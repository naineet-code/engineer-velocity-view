
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import Index from "./pages/Index";
import SprintAnalysis from "./pages/SprintAnalysis";
import DeveloperView from "./pages/DeveloperView";
import TicketView from "./pages/TicketView";
import Upload from "./pages/Upload";
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
          <div className="min-h-screen bg-gray-50 w-full">
            <Sidebar />
            <Header />
            <main className="ml-64 mt-16 p-8 bg-gray-50 min-h-screen">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/sprint-analysis" element={<SprintAnalysis />} />
                  <Route path="/developer-view" element={<DeveloperView />} />
                  <Route path="/developer-view/:developerName" element={<DeveloperView />} />
                  <Route path="/ticket-view" element={<TicketView />} />
                  <Route path="/ticket-view/:ticketId" element={<TicketView />} />
                  <Route path="/sprint-planning" element={<SprintCreation />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
