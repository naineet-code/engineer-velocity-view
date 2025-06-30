
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropTicketList } from "./DragDropTicketList";
import { Settings, Zap, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Phase2PlanningPanelProps {
  developers: any[];
  onTicketReorder: (ticketId: string, newRank: number) => void;
  onTicketReassign: (ticketId: string, newDeveloper: string) => void;
  onEtaUpdate: (ticketId: string, newEta: string) => void;
  onBlockerResolve: (ticketId: string) => void;
  onSimulationUpdate: () => void;
}

export const Phase2PlanningPanel = ({
  developers,
  onTicketReorder,
  onTicketReassign,
  onEtaUpdate,
  onBlockerResolve,
  onSimulationUpdate
}: Phase2PlanningPanelProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const availableDevelopers = developers.map(dev => dev.name);
  
  const handleAction = (action: string, ticketId: string, value?: any) => {
    switch (action) {
      case 'reorder':
        onTicketReorder(ticketId, value);
        break;
      case 'reassign':
        onTicketReassign(ticketId, value);
        break;
      case 'eta-update':
        onEtaUpdate(ticketId, value);
        break;
      case 'resolve-blocker':
        onBlockerResolve(ticketId);
        break;
    }
    
    // Trigger simulation update
    onSimulationUpdate();
    
    toast({
      title: "Planning Update",
      description: `Ticket ${ticketId} updated - simulation refreshed`,
    });
  };

  if (!isExpanded) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings size={16} className="text-blue-600" />
              <span className="font-semibold">Phase 2 Planning</span>
              <Badge variant="secondary">Interactive</Badge>
            </div>
            <Button
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap size={14} className="mr-1" />
              Open
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Drag tickets, edit ETAs, reassign work
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed inset-4 shadow-xl z-30 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-blue-600" />
            <span>Interactive Sprint Planning</span>
            <Badge variant="secondary">Phase 2</Badge>
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => setIsExpanded(false)}
          >
            Close
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="overflow-auto max-h-[calc(100vh-200px)]">
        <Tabs defaultValue={developers[0]?.name} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-4">
            {developers.slice(0, 4).map((dev) => (
              <TabsTrigger key={dev.name} value={dev.name}>
                {dev.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {developers.map((dev) => (
            <TabsContent key={dev.name} value={dev.name}>
              <DragDropTicketList
                tickets={dev.tickets}
                developerName={dev.name}
                onTicketReorder={(ticketId, newRank) => handleAction('reorder', ticketId, newRank)}
                onTicketReassign={(ticketId, newDev) => handleAction('reassign', ticketId, newDev)}
                onEtaUpdate={(ticketId, newEta) => handleAction('eta-update', ticketId, newEta)}
                onBlockerResolve={(ticketId) => handleAction('resolve-blocker', ticketId)}
                availableDevelopers={availableDevelopers}
              />
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center space-x-2 mb-2">
            <Zap size={16} className="text-blue-600" />
            <span className="font-semibold text-blue-800">Planning Actions Available</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Drag tickets to reorder in developer queues</li>
            <li>• Click ETA dates to edit inline</li>
            <li>• Use arrow button to reassign tickets</li>
            <li>• Click "Resolve Block" to unblock tickets</li>
            <li>• All changes trigger live simulation updates</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
