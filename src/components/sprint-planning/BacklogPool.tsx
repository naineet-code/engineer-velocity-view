
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', ticketId);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Backlog Pool</span>
          <Badge variant="secondary">{tickets.length}</Badge>
        </CardTitle>
        
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterType === 'all' ? 'All Types' : filterType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onFilterChange('all')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('bug')}>
                  Bugs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('story')}>
                  Stories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('task')}>
                  Tasks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eta-ready"
                checked={showEtaReady}
                onCheckedChange={onShowEtaReadyChange}
              />
              <label htmlFor="eta-ready" className="text-sm text-gray-600">
                ETA Ready Only
              </label>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No tickets match your filters</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  draggable={!disabled}
                  onDragStart={(e) => handleDragStart(e, ticket.id)}
                  className={`p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-move ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-2">{ticket.title}</h3>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`} />
                        <Badge variant="outline" className={getTypeColor(ticket.type)}>
                          {ticket.type}
                        </Badge>
                        <Badge variant="secondary">{ticket.effort}d</Badge>
                      </div>
                      
                      {ticket.eta && (
                        <p className="text-xs text-gray-500">ETA: {ticket.eta}</p>
                      )}
                      
                      {ticket.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {ticket.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
