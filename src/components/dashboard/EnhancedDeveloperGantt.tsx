
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { AlertCircle, Clock } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  effortDays: number;
  status: string;
  etaPosition: number;
  isBlocked: boolean;
  overdueDays: number;
  blockedDays: number;
  eta: string;
  projectedCompletion: string;
  isRisk: boolean;
  startDate: Date;
  endDate: Date;
}

interface Developer {
  name: string;
  tickets: Ticket[];
}

interface EnhancedDeveloperGanttProps {
  developers: Developer[];
  onTicketClick: (ticketId: string) => void;
}

export const EnhancedDeveloperGantt = ({ developers, onTicketClick }: EnhancedDeveloperGanttProps) => {
  const getStatusColor = (ticket: Ticket) => {
    if (ticket.isRisk) return 'bg-red-500';
    if (ticket.status === 'blocked') return 'bg-amber-500';
    if (ticket.status === 'not-started') return 'bg-gray-400';
    return 'bg-green-500';
  };

  const getStatusText = (ticket: Ticket) => {
    if (ticket.isRisk) return 'text-red-600';
    if (ticket.status === 'blocked') return 'text-amber-600';
    if (ticket.status === 'not-started') return 'text-gray-600';
    return 'text-green-600';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TooltipProvider>
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {developers.map((dev) => (
              <div key={dev.name} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{dev.name}</h3>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-xs">
                      {dev.tickets.filter(t => t.isRisk).length} at risk
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {dev.tickets.filter(t => t.isBlocked).length} blocked
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dev.tickets.map((ticket) => (
                    <Tooltip key={ticket.id}>
                      <TooltipTrigger asChild>
                        <div 
                          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          onClick={() => onTicketClick(ticket.id)}
                        >
                          <div className="w-16 text-xs text-gray-500 font-mono">{ticket.id}</div>
                          
                          <div className="flex-1 relative">
                            <div className="flex items-center space-x-2">
                              <div className={`h-6 rounded px-3 flex items-center space-x-2 ${getStatusColor(ticket)} text-white text-sm min-w-0`}>
                                <span className="truncate">{ticket.title}</span>
                                {ticket.isBlocked && (
                                  <AlertCircle size={14} className="flex-shrink-0" />
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{ticket.effortDays}d</span>
                            </div>
                            
                            {/* ETA marker */}
                            <div className="absolute top-0 h-6 w-px bg-red-400" style={{ left: `${ticket.etaPosition}%` }}>
                              <div className="absolute -top-1 left-0 w-2 h-2 bg-red-400 rounded-full transform -translate-x-1/2"></div>
                            </div>
                          </div>
                          
                          <div className={`text-xs font-medium ${getStatusText(ticket)} flex items-center space-x-1`}>
                            {ticket.isRisk && <Clock size={12} />}
                            <span>
                              {ticket.isRisk ? `${ticket.overdueDays}d over` : 
                               ticket.isBlocked ? `${ticket.blockedDays}d blocked` : 
                               'on track'}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <div className="font-semibold">{ticket.title}</div>
                          <div className="text-sm space-y-1">
                            <div>ETA: {formatDate(ticket.eta)}</div>
                            <div>Projected: {formatDate(ticket.projectedCompletion)}</div>
                            <div>Effort: {ticket.effortDays} days</div>
                            {ticket.isBlocked && (
                              <div className="text-amber-600">Blocked for {ticket.blockedDays} days</div>
                            )}
                            {ticket.isRisk && (
                              <div className="text-red-600">⚠️ Will miss ETA by {ticket.overdueDays} days</div>
                            )}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Legend */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>ETA Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>On Track</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded"></div>
                <span>Blocked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded"></div>
                <span>Not Started</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-px h-3 bg-red-400"></div>
                <span>ETA Deadline</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
