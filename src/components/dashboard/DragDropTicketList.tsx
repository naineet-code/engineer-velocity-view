
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, GripVertical, ArrowRight } from "lucide-react";
import { InlineEditableField } from "./InlineEditableField";

interface DragDropTicket {
  id: string;
  title: string;
  effortRemaining: number;
  eta: string;
  projectedEndDate: Date;
  isRisk: boolean;
  isBlocked: boolean;
  rank: number;
}

interface DragDropTicketListProps {
  tickets: DragDropTicket[];
  developerName: string;
  onTicketReorder: (ticketId: string, newRank: number) => void;
  onTicketReassign: (ticketId: string, newDeveloper: string) => void;
  onEtaUpdate: (ticketId: string, newEta: string) => void;
  onBlockerResolve: (ticketId: string) => void;
  availableDevelopers: string[];
}

export const DragDropTicketList = ({
  tickets,
  developerName,
  onTicketReorder,
  onTicketReassign,
  onEtaUpdate,
  onBlockerResolve,
  availableDevelopers
}: DragDropTicketListProps) => {
  const [draggedTicket, setDraggedTicket] = useState<string | null>(null);
  const [showReassignFor, setShowReassignFor] = useState<string | null>(null);

  const handleDragStart = (ticketId: string) => {
    setDraggedTicket(ticketId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetTicketId: string) => {
    e.preventDefault();
    if (draggedTicket && draggedTicket !== targetTicketId) {
      const targetTicket = tickets.find(t => t.id === targetTicketId);
      if (targetTicket) {
        onTicketReorder(draggedTicket, targetTicket.rank);
      }
    }
    setDraggedTicket(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{developerName} - Interactive Queue</h3>
          <Badge variant="secondary">Phase 2 Planning</Badge>
        </div>
        
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`p-3 border rounded-lg cursor-move transition-all ${
                draggedTicket === ticket.id ? 'opacity-50 scale-95' : ''
              } ${ticket.isRisk ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}
              draggable
              onDragStart={() => handleDragStart(ticket.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, ticket.id)}
            >
              <div className="flex items-center space-x-3">
                <GripVertical size={16} className="text-gray-400" />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm text-gray-600">{ticket.id}</span>
                      <span className="font-medium">{ticket.title}</span>
                      {ticket.isBlocked && <AlertCircle size={14} className="text-amber-500" />}
                    </div>
                    <Badge variant="outline">#{ticket.rank}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">ETA:</span>
                      <InlineEditableField
                        value={ticket.eta}
                        onSave={(newEta) => onEtaUpdate(ticket.id, newEta)}
                        type="date"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Projected:</span>
                      <span className={ticket.isRisk ? 'text-red-600 font-medium' : ''}>
                        {formatDate(ticket.projectedEndDate)}
                      </span>
                    </div>
                    
                    <Badge variant="secondary">{ticket.effortRemaining}d</Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {ticket.isBlocked && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onBlockerResolve(ticket.id)}
                      className="text-green-600 hover:bg-green-50"
                    >
                      Resolve Block
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowReassignFor(showReassignFor === ticket.id ? null : ticket.id)}
                  >
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
              
              {showReassignFor === ticket.id && (
                <div className="mt-3 p-3 bg-gray-50 rounded border-t">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Reassign to:</span>
                    {availableDevelopers.filter(dev => dev !== developerName).map(dev => (
                      <Button
                        key={dev}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onTicketReassign(ticket.id, dev);
                          setShowReassignFor(null);
                        }}
                      >
                        {dev}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
