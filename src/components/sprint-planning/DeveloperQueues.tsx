
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, Clock, AlertTriangle, X } from 'lucide-react';
import { Developer } from '@/pages/SprintCreation';

interface DeveloperQueuesProps {
  developers: Developer[];
  onTicketUnassign: (ticketId: string) => void;
  onTicketReorder: (developerId: string, fromIndex: number, toIndex: number) => void;
  disabled: boolean;
}

export const DeveloperQueues: React.FC<DeveloperQueuesProps> = ({
  developers,
  onTicketUnassign,
  onTicketReorder,
  disabled
}) => {
  const getUtilization = (developer: Developer) => {
    const assignedEffort = developer.assignedTickets.reduce((sum, ticket) => sum + ticket.effort, 0);
    return Math.round((assignedEffort / developer.availableEffort) * 100);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'text-red-600';
    if (utilization > 80) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Developer Queues</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {developers.map((developer) => {
          const utilization = getUtilization(developer);
          const assignedEffort = developer.assignedTickets.reduce((sum, ticket) => sum + ticket.effort, 0);
          
          return (
            <Card key={developer.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium text-gray-900">{developer.name}</CardTitle>
                      <p className="text-xs text-gray-500">{assignedEffort}d / {developer.availableEffort}d</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                    {utilization}%
                  </span>
                </div>
                
                <Progress 
                  value={Math.min(utilization, 100)} 
                  className="h-2"
                />
                
                {utilization > 100 && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-xs">Overloaded by {utilization - 100}%</span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {developer.assignedTickets.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No tickets assigned</p>
                ) : (
                  developer.assignedTickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className={`p-2 border rounded-lg flex items-center justify-between ${
                        ticket.isRisk ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-gray-600">#{ticket.rank}</span>
                          <span className="text-xs font-medium text-gray-900">{ticket.id}</span>
                          {ticket.isRisk && <AlertTriangle className="h-3 w-3 text-red-500" />}
                        </div>
                        <p className="text-xs text-gray-600 truncate">{ticket.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{ticket.effort}d</span>
                          {ticket.projectedEnd && (
                            <span className="text-xs text-gray-500">
                              → {new Date(ticket.projectedEnd).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {!disabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTicketUnassign(ticket.id)}
                          className="ml-2 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
