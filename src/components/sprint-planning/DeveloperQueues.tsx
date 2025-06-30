
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, Clock, AlertTriangle, X, GripVertical } from 'lucide-react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Developer } from '@/pages/SprintCreation';

interface DeveloperQueuesProps {
  developers: Developer[];
  onTicketUnassign: (ticketId: string) => void;
  disabled: boolean;
}

const SortableTicket: React.FC<{
  ticket: any;
  developerId: string;
  onUnassign: (ticketId: string) => void;
  disabled: boolean;
}> = ({ ticket, developerId, onUnassign, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${developerId}-${ticket.id}`,
    disabled,
    data: {
      type: 'ticket',
      ticket,
      source: 'developer',
      developerId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ticket-card ${isDragging ? 'ticket-card-dragging' : ''} ${
        ticket.isRisk ? 'border-red-200 bg-red-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-2 flex-1">
          {!disabled && (
            <div {...attributes} {...listeners} className="drag-handle mt-1">
              <GripVertical className="h-3 w-3" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-gray-600">#{ticket.rank}</span>
              <span className="text-xs font-medium text-gray-900 truncate">{ticket.id}</span>
              {ticket.isRisk && <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />}
            </div>
            <p className="text-xs text-gray-600 truncate">{ticket.title}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                {ticket.effort}d
              </span>
              {ticket.projectedEnd && (
                <span className="text-xs text-gray-500">
                  → {new Date(ticket.projectedEnd).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {!disabled && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUnassign(ticket.id)}
            className="ml-2 h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

const DroppableDeveloperQueue: React.FC<{
  developer: Developer;
  onTicketUnassign: (ticketId: string) => void;
  disabled: boolean;
}> = ({ developer, onTicketUnassign, disabled }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `developer-${developer.id}`,
    data: {
      type: 'developer',
      developerId: developer.id
    }
  });

  const getUtilization = (developer: Developer) => {
    const assignedEffort = developer.assignedTickets.reduce((sum, ticket) => sum + ticket.effort, 0);
    return Math.round((assignedEffort / developer.availableEffort) * 100);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'text-red-600';
    if (utilization > 80) return 'text-orange-600';
    return 'text-green-600';
  };

  const utilization = getUtilization(developer);
  const assignedEffort = developer.assignedTickets.reduce((sum, ticket) => sum + ticket.effort, 0);
  const ticketIds = developer.assignedTickets.map(ticket => `${developer.id}-${ticket.id}`);

  return (
    <Card className={`modern-card ${isOver ? 'animated-border' : ''}`}>
      <CardHeader className="modern-card-header pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
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
      
      <CardContent 
        ref={setNodeRef}
        className={`space-y-2 max-h-64 overflow-y-auto ${
          isOver ? 'drop-zone-active' : 'drop-zone'
        } ${developer.assignedTickets.length === 0 ? 'min-h-[100px]' : ''}`}
      >
        {developer.assignedTickets.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-500">Drop tickets here</p>
          </div>
        ) : (
          <SortableContext items={ticketIds} strategy={verticalListSortingStrategy}>
            {developer.assignedTickets.map((ticket) => (
              <SortableTicket
                key={ticket.id}
                ticket={ticket}
                developerId={developer.id}
                onUnassign={onTicketUnassign}
                disabled={disabled}
              />
            ))}
          </SortableContext>
        )}
      </CardContent>
    </Card>
  );
};

export const DeveloperQueues: React.FC<DeveloperQueuesProps> = ({
  developers,
  onTicketUnassign,
  disabled
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Developer Queues</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {developers.map((developer) => (
          <DroppableDeveloperQueue
            key={developer.id}
            developer={developer}
            onTicketUnassign={onTicketUnassign}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
