
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { AlertCircle, Clock, TrendingUp, Calendar } from "lucide-react";
import { simulationEngine } from "@/utils/ganttSimulation";

interface LiveGanttChartProps {
  developers: any[];
  onTicketClick: (ticketId: string) => void;
  filters: {
    showFilter: 'all' | 'blocked' | 'eta-risk';
    selectedDeveloper: string;
    selectedBlockerSource: string;
  };
}

export const LiveGanttChart = ({ developers, onTicketClick, filters }: LiveGanttChartProps) => {
  const [simulatedData, setSimulatedData] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  // Real-time simulation whenever data or filters change
  const processedDevelopers = useMemo(() => {
    console.log('🔄 Running real-time Gantt simulation...');
    
    let filteredDevelopers = developers;
    
    // Apply developer filter
    if (filters.selectedDeveloper !== 'all') {
      filteredDevelopers = developers.filter(dev => dev.name === filters.selectedDeveloper);
    }
    
    // Simulate each developer's queue
    const simulated = filteredDevelopers.map(dev => {
      const simulatedDev = simulationEngine.simulateDeveloperQueue(dev);
      
      // Apply ticket-level filters
      let filteredTickets = simulatedDev.tickets;
      
      if (filters.showFilter === 'blocked') {
        filteredTickets = filteredTickets.filter(t => t.isBlocked);
      } else if (filters.showFilter === 'eta-risk') {
        filteredTickets = filteredTickets.filter(t => t.isRisk);
      }
      
      if (filters.selectedBlockerSource !== 'all') {
        filteredTickets = filteredTickets.filter(t => t.blockedBy === filters.selectedBlockerSource);
      }
      
      return {
        ...simulatedDev,
        tickets: filteredTickets
      };
    });
    
    // Generate insights
    const newInsights = simulationEngine.generateInsights(simulated);
    setInsights(newInsights);
    
    return simulated;
  }, [developers, filters]);

  const getBarColor = (ticket: any) => {
    if (ticket.isRisk) return 'bg-red-500';
    if (ticket.isBlocked) return 'bg-amber-500';
    if (ticket.status === 'not-started' || ticket.status === 'Not Started') return 'bg-gray-400';
    return 'bg-green-500';
  };

  const getBarWidth = (ticket: any) => {
    // Base width on effort remaining, min 60px for visibility
    const baseWidth = Math.max(60, ticket.effortRemaining * 15);
    return `${Math.min(baseWidth, 200)}px`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEtaPosition = (ticket: any) => {
    // Calculate ETA marker position based on projected timeline
    const daysDiff = Math.abs(ticket.projectedEndDate - ticket.etaDate) / (1000 * 60 * 60 * 24);
    return ticket.projectedEndDate > ticket.etaDate ? 85 : 70; // Position marker
  };

  return (
    <TooltipProvider>
      <Card className="shadow-sm">
        <CardContent className="p-6">
          {/* AI Insights Strip */}
          {insights.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp size={16} className="text-blue-600" />
                <span className="font-semibold text-blue-800">Live Insights</span>
              </div>
              <div className="space-y-1">
                {insights.map((insight, index) => (
                  <div key={index} className="text-sm text-blue-700">• {insight}</div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {processedDevelopers.map((dev) => (
              <div key={dev.name} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className={`font-semibold ${dev.hasQueueOverflow ? 'text-red-600' : 'text-gray-900'}`}>
                      {dev.name}
                      {dev.hasQueueOverflow && <span className="ml-1 text-red-500">⚠️</span>}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {dev.totalEffortDays}d queued
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-xs">
                      {dev.riskTicketCount} at risk
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {dev.tickets.filter(t => t.isBlocked).length} blocked
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dev.tickets.map((ticket: any) => (
                    <Tooltip key={ticket.id}>
                      <TooltipTrigger asChild>
                        <div 
                          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                          onClick={() => onTicketClick(ticket.id)}
                        >
                          <div className="w-16 text-xs text-gray-500 font-mono">{ticket.id}</div>
                          
                          <div className="flex-1 relative">
                            <div className="flex items-center space-x-2">
                              <div 
                                className={`h-6 rounded px-3 flex items-center space-x-2 ${getBarColor(ticket)} text-white text-sm min-w-0 transition-all duration-200`}
                                style={{ width: getBarWidth(ticket) }}
                              >
                                <span className="truncate">{ticket.title}</span>
                                {ticket.isBlocked && (
                                  <AlertCircle size={14} className="flex-shrink-0" />
                                )}
                                {ticket.isRisk && (
                                  <Clock size={14} className="flex-shrink-0" />
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{ticket.effortRemaining}d</span>
                            </div>
                            
                            {/* ETA marker with dynamic positioning */}
                            <div 
                              className="absolute top-0 h-6 w-px bg-red-400 animate-pulse" 
                              style={{ left: `${getEtaPosition(ticket)}%` }}
                            >
                              <div className="absolute -top-1 left-0 w-2 h-2 bg-red-400 rounded-full transform -translate-x-1/2"></div>
                            </div>
                          </div>
                          
                          <div className="text-xs space-y-1 min-w-24">
                            <div className="flex items-center space-x-1">
                              <Calendar size={12} className="text-gray-400" />
                              <span className="text-gray-600">
                                {formatDate(ticket.projectedEndDate)}
                              </span>
                            </div>
                            {ticket.isRisk && (
                              <div className="text-red-600 font-medium">
                                ETA Risk
                              </div>
                            )}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <div className="font-semibold">{ticket.title}</div>
                          <div className="text-sm space-y-1">
                            <div>ETA: {formatDate(ticket.etaDate)}</div>
                            <div>Projected: {formatDate(ticket.projectedEndDate)}</div>
                            <div>Effort Remaining: {ticket.effortRemaining} days</div>
                            <div>Start: {formatDate(ticket.projectedStartDate)}</div>
                            {ticket.isBlocked && (
                              <div className="text-amber-600">
                                🚫 Blocked for {ticket.daysBlocked} days
                                {ticket.blockedBy && ` by ${ticket.blockedBy}`}
                              </div>
                            )}
                            {ticket.isRisk && (
                              <div className="text-red-600">
                                ⚠️ Will miss ETA by {Math.ceil((ticket.projectedEndDate - ticket.etaDate) / (1000 * 60 * 60 * 24))} days
                              </div>
                            )}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Enhanced Legend */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
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
                  <div className="w-px h-3 bg-red-400 animate-pulse"></div>
                  <span>ETA Deadline</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                🔄 Live simulation • Updates automatically
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
