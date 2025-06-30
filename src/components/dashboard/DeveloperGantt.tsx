
import { mockDashboardData } from "@/data/mockData";
import { AlertCircle } from "lucide-react";

export const DeveloperGantt = () => {
  const { developers } = mockDashboardData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-500';
      case 'on-track': return 'bg-green-500';
      case 'not-started': return 'bg-gray-400';
      case 'blocked': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-600';
      case 'on-track': return 'text-green-600';
      case 'not-started': return 'text-gray-600';
      case 'blocked': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {developers.map((dev) => (
        <div key={dev.name} className="border-b border-gray-100 pb-4 last:border-b-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{dev.name}</h3>
            <span className="text-sm text-gray-500">
              {dev.tickets.filter(t => t.status === 'overdue').length} at risk
            </span>
          </div>
          
          <div className="space-y-2">
            {dev.tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-500 font-mono">{ticket.id}</div>
                
                <div className="flex-1 relative">
                  <div className="flex items-center space-x-2">
                    <div className={`h-6 rounded px-3 flex items-center space-x-2 ${getStatusColor(ticket.status)} text-white text-sm min-w-0`}>
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
                
                <div className={`text-xs font-medium ${getStatusText(ticket.status)}`}>
                  {ticket.status === 'overdue' ? `${ticket.overdueDays}d over` : 
                   ticket.status === 'blocked' ? `${ticket.blockedDays}d blocked` : 
                   ticket.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Legend */}
      <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Overdue</span>
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
  );
};
