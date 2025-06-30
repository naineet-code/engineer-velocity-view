
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Search, Filter, GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { PlanningTicket } from '@/pages/SprintCreation';

interface BacklogPoolProps {
  tickets: PlanningTicket[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: 'all' | 'bug' | 'story' | 'task';
  onFilterChange: (type: 'all' | 'bug' | 'story' | 'task') => void;
  showEtaReady: boolean;
  onShowEtaReadyChange: (show: boolean) => void;
  disabled: boolean;
}

const DraggableTicket: React.FC<{ ticket: PlanningTicket; disabled: boolean }> = ({ ticket, disabled }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `backlog-${ticket.id}`,
    disabled,
    data: {
      type: 'ticket',
      ticket,
      source: 'backlog'
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ticket-card ${isDragging ? 'ticket-card-dragging' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      {...attributes}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 flex-1">
          {!disabled && (
            <div {...listeners} className="drag-handle mt-1">
              <GripVertical className="h-4 w-4" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 truncate">{ticket.id}</h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ticket.title}</p>
          </div>
        </div>
        <div className="ml-2 flex flex-col items-end space-y-1 flex-shrink-0">
          <Badge className={getPriorityColor(ticket.priority)}>
            {ticket.priority}
          </Badge>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {ticket.effort}d
          </span>
        </div>
      </div>
    </div>
  );
};

export const BacklogPool: React.FC<BacklogPoolProps> = ({
  tickets,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  showEtaReady,
  onShowEtaReadyChange,
  disabled
}) => {
  return (
    <Card className="modern-card">
      <CardHeader className="modern-card-header pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Backlog Pool</CardTitle>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Select value={filterType} onValueChange={onFilterChange}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={showEtaReady}
                onCheckedChange={onShowEtaReadyChange}
              />
              <span className="text-sm text-gray-600">ETA Ready</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="drop-zone text-center">
            <p className="text-sm text-gray-500">No tickets found</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <DraggableTicket 
              key={ticket.id} 
              ticket={ticket} 
              disabled={disabled}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
