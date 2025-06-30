
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Clock, 
  Calendar,
  AlertTriangle,
  X,
  GripVertical
} from 'lucide-react';
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
  const handleDrop = (e: React.DragEvent, developerId: string) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    // This would be handled by the parent component's onTicketAssign
    console.log(`Assigning ticket ${ticketId} to ${developerId}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-gray-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Developer Queues</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {developers.map((developer) => {
          const totalEffort = developer.assignedTickets.reduce((sum, ticket) => sum + ticket.effort, 0);
          const isOverloaded = totalEffort > developer.availableEffort;
          const utilization = (totalEffort / developer.availableEffort) * 100;

          return (
            <Card key={developer.id} className="h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    {developer.name}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {totalEffort}d / {developer.availableEffort}d
                    </div>
                    <div className={`text-xs ${isOverloaded ? 'text-red-600' : 'text-gray-500'}`}>
                      {Math.round(utilization)}% capacity
                    </div>
                  </div>
                </div>
                
                {isOverloaded && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700">
                      Overloaded by {totalEffort - developer.availableEffort} days
                    </span>
                  </div>
                )}
              </CardHeader>

              <CardContent
                className="min-h-32 space-y-2"
                onDrop={(e) => handleDrop(e, developer.id)}
                onDragOver={handleDragOver}
              >
                {developer.assignedTickets.length === 0 ? (
                  <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                    Drop tickets here
                  </div>
                ) : (
                  developer.assignedTickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className={`p-3 border rounded-lg ${
                        ticket.isRisk ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      } ${disabled ? 'opacity-50' : ''}`}
                      draggable={!disabled}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', JSON.stringify({
                          ticketId: ticket.id,
                          fromDeveloper: developer.id,
                          fromIndex: index
                        }));
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {!disabled && (
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                          )}
                          <span className="font-mono text-sm text-gray-600">
                            #{ticket.rank || index + 1}
                          </span>
                          <span className="font-mono text-sm">{ticket.id}</span>
                          <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{ticket.effort}d</span>
                          </div>
                          {!disabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => onTicketUnassign(ticket.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <h4 className="font-medium text-sm mb-2 line-clamp-2">{ticket.title}</h4>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          {ticket.eta && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{ticket.eta}</span>
                            </div>
                          )}
                          {ticket.projectedEnd && (
                            <div className="flex items-center gap-1">
                              <span>→ {ticket.projectedEnd.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {ticket.isRisk && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span>ETA Risk</span>
                          </div>
                        )}
                      </div>
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
