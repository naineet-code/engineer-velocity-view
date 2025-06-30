
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Search, Filter } from 'lucide-react';
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
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
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
          <p className="text-sm text-gray-500 text-center py-4">No tickets found</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              draggable={!disabled}
              onClick={() => !disabled && onTicketAssign(ticket.id, 'unassigned')}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">{ticket.id}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ticket.title}</p>
                </div>
                <div className="ml-2 flex flex-col items-end space-y-1">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <span className="text-xs text-gray-500">{ticket.effort}d</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
