
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  status: string;
  etaDate: Date;
  effortDays: number;
  isBlocked: boolean;
  isRisk: boolean;
  rank: number;
  owner: string;
  blockedDays?: number;
  blockedBy?: string;
  effortRemaining?: number;
  projectedCompletion?: string;
  etaPosition?: number;
  overdueDays?: number;
}

interface Developer {
  name: string;
  tickets: Ticket[];
}

interface DeveloperGanttProps {
  developers: Developer[];
  onTicketClick?: (ticketId: string) => void;
}

export const DeveloperGantt = ({ developers, onTicketClick }: DeveloperGanttProps) => {
  const getStatusColor = (ticket: Ticket) => {
    if (ticket.isRisk) return "bg-red-500 text-white";
    if (ticket.isBlocked) return "bg-amber-500 text-white";
    if (ticket.status === "not-started") return "bg-gray-400 text-white";
    return "bg-green-500 text-white";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getBarWidth = (effortDays: number) => {
    return Math.max(effortDays * 20, 60); // Minimum 60px width
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Queue Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {developers.map((dev) => (
            <div key={dev.name} className="space-y-2">
              <h3 className="font-semibold text-gray-900">{dev.name}</h3>
              <div className="space-y-2">
                {dev.tickets.length === 0 ? (
                  <div className="text-gray-500 text-sm italic">No tickets assigned</div>
                ) : (
                  dev.tickets.map((ticket) => (
                    <div 
                      key={ticket.id}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => onTicketClick?.(ticket.id)}
                    >
                      <div className="w-20 text-xs text-gray-500 font-mono">{ticket.id}</div>
                      
                      <div className="flex-1 relative">
                        <div 
                          className={`h-6 rounded px-3 flex items-center space-x-2 ${getStatusColor(ticket)} text-sm`}
                          style={{ width: `${getBarWidth(ticket.effortDays)}px` }}
                        >
                          <span className="truncate">{ticket.title}</span>
                          {ticket.isBlocked && <Clock size={14} />}
                          {ticket.isRisk && <AlertTriangle size={14} />}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 min-w-20">
                        <div>ETA: {formatDate(ticket.etaDate)}</div>
                        {ticket.effortRemaining && (
                          <div>{ticket.effortRemaining}d remaining</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center space-x-6 mt-6 pt-4 border-t text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>On Track</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span>Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>ETA Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Not Started</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
