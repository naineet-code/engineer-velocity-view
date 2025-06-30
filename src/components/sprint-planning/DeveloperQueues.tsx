
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, GripVertical, X } from 'lucide-react';
import { Developer, PlanningTicket } from '@/pages/SprintCreation';

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
  const handleDrop = (e: React.DragEvent, developerId: string) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    // This would need to be handled by parent component
    console.log(`Dropping ticket ${ticketId} to developer ${developerId}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const getStatusColor = (ticket: PlanningTicket) => {
    if (ticket.isRisk) return 'text-red-600 bg-red-100';
    return 'text-green-600 bg-green-100';
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Developer Queues</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 p-4">
            {developers.map((developer) => {
              const totalEffort = developer.assignedTickets.reduce((sum, ticket) => sum + ticket.effort, 0);
              const isOverloaded = totalEffort > developer.availableEffort;
              const utilization = Math.round((totalEffort / developer.availableEffort) * 100);
              
              return (
                <div key={developer.id} className="space-y-3">
                  {/* Developer Header */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{developer.name}</h3>
                      <p className="text-sm text-gray-600">
                        {totalEffort}d / {developer.availableEffort}d
                        <span className={`ml-2 ${isOverloaded ? 'text-red-600' : 'text-green-600'}`}>
                          ({utilization}%)
                        </span>
                      </p>
                    </div>
                    {isOverloaded && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  
                  {/* Drop Zone */}
                  <div
                    onDrop={(e) => handleDrop(e, developer.id)}
                    onDragOver={handleDragOver}
                    className={`min-h-32 border-2 border-dashed border-gray-300 rounded-lg p-2 ${
                      disabled ? 'bg-gray-100' : 'hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {developer.assignedTickets.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-gray-500">
                        <p className="text-sm">Drop tickets here</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {developer.assignedTickets.map((ticket, index) => (
                          <div
                            key={ticket.id}
                            className={`p-3 bg-white border rounded-lg shadow-sm ${
                              ticket.isRisk ? 'border-red-200' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  {!disabled && (
                                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                                  )}
                                  <span className="text-sm font-medium">{index + 1}.</span>
                                </div>
                                
                                <h4 className="font-medium text-sm mb-2">{ticket.title}</h4>
                                
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant="outline" className={getStatusColor(ticket)}>
                                    {ticket.isRisk ? 'ETA Risk' : 'On Track'}
                                  </Badge>
                                  <Badge variant="secondary">{ticket.effort}d</Badge>
                                </div>
                                
                                {ticket.projectedStart && ticket.projectedEnd && (
                                  <p className="text-xs text-gray-500">
                                    {formatDate(ticket.projectedStart)} → {formatDate(ticket.projectedEnd)}
                                  </p>
                                )}
                                
                                {ticket.eta && (
                                  <p className="text-xs text-gray-500">
                                    ETA: {ticket.eta}
                                  </p>
                                )}
                              </div>
                              
                              {!disabled && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onTicketUnassign(ticket.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
