
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Flag
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlanningTicket } from '@/pages/SprintCreation';

interface BacklogPoolProps {
  tickets: PlanningTicket[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: 'all' | 'bug' | 'story' | 'task';
  onFilterChange: (type: 'all' | 'bug' | 'story' | 'task') => void;
  showEtaReady: boolean;
  onShowEtaReadyChange: (show: boolean) => void;
  onTicketAssign: (ticketId: string, developerId: string) => void;
  disabled: boolean;
}

export const BacklogPool: React.FC<BacklogPoolProps> = ({
  tickets,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  showEtaReady,
  onShowEtaReadyChange,
  onTicketAssign,
  disabled
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-gray-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800';
      case 'story': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Backlog Pool</CardTitle>
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              disabled={disabled}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={onFilterChange} disabled={disabled}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bug">Bugs</SelectItem>
                <SelectItem value="story">Stories</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="eta-ready"
                checked={showEtaReady}
                onCheckedChange={onShowEtaReadyChange}
                disabled={disabled}
              />
              <label htmlFor="eta-ready" className="text-sm">ETA Ready Only</label>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No tickets match your filters</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-3 border rounded-lg hover:shadow-sm transition-shadow ${
                  disabled ? 'opacity-50' : 'cursor-move'
                }`}
                draggable={!disabled}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', ticket.id);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-600">{ticket.id}</span>
                    <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                      {ticket.priority}
                    </Badge>
                    <Badge className={getTypeColor(ticket.type)} variant="outline">
                      {ticket.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{ticket.effort}d</span>
                  </div>
                </div>

                <h4 className="font-medium text-sm mb-2 line-clamp-2">{ticket.title}</h4>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {ticket.eta && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{ticket.eta}</span>
                      </div>
                    )}
                    {ticket.tags && ticket.tags.length > 0 && (
                      <div className="flex gap-1">
                        {ticket.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {ticket.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{ticket.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {!disabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        // Simple assignment to first available developer for demo
                        // In real app, this would open a developer selector
                        onTicketAssign(ticket.id, 'sarah');
                      }}
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
