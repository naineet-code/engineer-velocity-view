import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Rocket, 
  RefreshCw, 
  Download,
  AlertTriangle,
  Users,
  Clock,
  Target,
  RotateCcw
} from 'lucide-react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { BacklogPool } from '@/components/sprint-planning/BacklogPool';
import { DeveloperQueues } from '@/components/sprint-planning/DeveloperQueues';
import { SprintSummary } from '@/components/sprint-planning/SprintSummary';
import { BandwidthChart } from '@/components/sprint-planning/BandwidthChart';
import { CSVUpload } from '@/components/shared/CSVUpload';
import { useData } from '@/contexts/DataContext';
import { KPICalculator } from '@/utils/kpiCalculations';
import { useToast } from '@/hooks/use-toast';

export interface PlanningTicket {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: number;
  eta?: string;
  tags: string[];
  type: 'bug' | 'story' | 'task';
  assignedTo?: string;
  rank?: number;
  projectedStart?: Date;
  projectedEnd?: Date;
  isRisk?: boolean;
}

export interface Developer {
  id: string;
  name: string;
  availableEffort: number;
  assignedTickets: PlanningTicket[];
}

const SprintCreation = () => {
  const { tickets } = useData();
  const { toast } = useToast();
  const [sprintDuration, setSprintDuration] = useState(10);
  const [sprintMode, setSprintMode] = useState<'draft' | 'finalized'>('draft');
  const [backlogTickets, setBacklogTickets] = useState<PlanningTicket[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'bug' | 'story' | 'task'>('all');
  const [showEtaReady, setShowEtaReady] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedTicket, setDraggedTicket] = useState<PlanningTicket | null>(null);
  const [undoStack, setUndoStack] = useState<{backlog: PlanningTicket[], devs: Developer[]}[]>([]);

  const calculator = useMemo(() => new KPICalculator(tickets), [tickets]);

  // Initialize data from CSV
  useEffect(() => {
    if (tickets.length === 0) return;

    // Convert CSV tickets to planning format
    const planningTickets: PlanningTicket[] = tickets
      .filter(ticket => ticket.status !== 'Closed')
      .map(ticket => ({
        id: ticket.ticket_id,
        title: ticket.title,
        priority: (ticket.priority as 'low' | 'medium' | 'high' | 'critical') || 'medium',
        effort: ticket.effort_points || 1,
        eta: ticket.ETA,
        tags: [],
        type: 'story' as const, // Default to story since CSV doesn't have type
      }));

    // Get unique developers from tickets
    const uniqueDevs = [...new Set(tickets.map(t => t.developer))];
    const planningDevelopers: Developer[] = uniqueDevs.map(devName => ({
      id: devName.toLowerCase().replace(/\s+/g, '-'),
      name: devName,
      availableEffort: 8, // 8 days per sprint
      assignedTickets: []
    }));

    setBacklogTickets(planningTickets);
    setDevelopers(planningDevelopers);
  }, [tickets]);

  const saveUndoState = () => {
    setUndoStack(prev => [...prev.slice(-9), { 
      backlog: [...backlogTickets], 
      devs: developers.map(dev => ({
        ...dev,
        assignedTickets: [...dev.assignedTickets]
      }))
    }]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    const lastState = undoStack[undoStack.length - 1];
    setBacklogTickets(lastState.backlog);
    setDevelopers(lastState.devs);
    setUndoStack(prev => prev.slice(0, -1));
    
    toast({
      title: "Undone",
      description: "Last change has been reverted",
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const ticket = active.data.current?.ticket;
    if (ticket) {
      setDraggedTicket(ticket);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedTicket(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    saveUndoState();

    // Handle drag from backlog to developer
    if (activeData.source === 'backlog' && overData.type === 'developer') {
      const ticket = activeData.ticket;
      const developerId = overData.developerId;
      
      // Remove from backlog
      setBacklogTickets(prev => prev.filter(t => t.id !== ticket.id));
      
      // Add to developer queue
      setDevelopers(prev => prev.map(dev => {
        if (dev.id === developerId) {
          const newTicket = {
            ...ticket,
            assignedTo: developerId,
            rank: dev.assignedTickets.length + 1
          };
          return {
            ...dev,
            assignedTickets: [...dev.assignedTickets, newTicket]
          };
        }
        return dev;
      }));

      toast({
        title: "Ticket Assigned",
        description: `${ticket.id} assigned to ${developers.find(d => d.id === developerId)?.name}`,
      });
    }
    
    // Handle reordering within developer queue
    else if (activeData.source === 'developer' && overData.type === 'developer') {
      const sourceDeveloperId = activeData.developerId;
      const targetDeveloperId = overData.developerId;
      const ticket = activeData.ticket;

      if (sourceDeveloperId === targetDeveloperId) {
        // Reordering within same developer
        const activeIndex = active.id as string;
        const overIndex = over.id as string;
        
        setDevelopers(prev => prev.map(dev => {
          if (dev.id === sourceDeveloperId) {
            const oldIndex = dev.assignedTickets.findIndex(t => 
              `${dev.id}-${t.id}` === activeIndex
            );
            const newIndex = dev.assignedTickets.findIndex(t => 
              `${dev.id}-${t.id}` === overIndex
            );
            
            if (oldIndex !== -1 && newIndex !== -1) {
              const newTickets = arrayMove(dev.assignedTickets, oldIndex, newIndex);
              return {
                ...dev,
                assignedTickets: newTickets.map((ticket, index) => ({
                  ...ticket,
                  rank: index + 1
                }))
              };
            }
          }
          return dev;
        }));
      } else {
        // Moving between developers
        setDevelopers(prev => prev.map(dev => {
          if (dev.id === sourceDeveloperId) {
            return {
              ...dev,
              assignedTickets: dev.assignedTickets.filter(t => t.id !== ticket.id)
            };
          } else if (dev.id === targetDeveloperId) {
            const newTicket = {
              ...ticket,
              assignedTo: targetDeveloperId,
              rank: dev.assignedTickets.length + 1
            };
            return {
              ...dev,
              assignedTickets: [...dev.assignedTickets, newTicket]
            };
          }
          return dev;
        }));

        toast({
          title: "Ticket Reassigned",
          description: `${ticket.id} moved to ${developers.find(d => d.id === targetDeveloperId)?.name}`,
        });
      }
    }

    // Trigger recalculation
    setTimeout(recalculateProjections, 100);
  };

  const handleTicketAssign = (ticketId: string, developerId: string) => {
    setBacklogTickets(prev => prev.filter(t => t.id !== ticketId));
    setDevelopers(prev => prev.map(dev => {
      if (dev.id === developerId) {
        const ticket = backlogTickets.find(t => t.id === ticketId);
        if (ticket) {
          return {
            ...dev,
            assignedTickets: [...dev.assignedTickets, { ...ticket, assignedTo: developerId }]
          };
        }
      }
      return dev;
    }));
    recalculateProjections();
  };

  const handleTicketUnassign = (ticketId: string) => {
    let unassignedTicket: PlanningTicket | null = null;
    
    setDevelopers(prev => prev.map(dev => {
      const ticketIndex = dev.assignedTickets.findIndex(t => t.id === ticketId);
      if (ticketIndex >= 0) {
        unassignedTicket = dev.assignedTickets[ticketIndex];
        return {
          ...dev,
          assignedTickets: dev.assignedTickets.filter(t => t.id !== ticketId)
        };
      }
      return dev;
    }));

    if (unassignedTicket) {
      setBacklogTickets(prev => [...prev, { ...unassignedTicket, assignedTo: undefined, rank: undefined }]);
    }
    recalculateProjections();
  };

  const handleTicketReorder = (developerId: string, fromIndex: number, toIndex: number) => {
    setDevelopers(prev => prev.map(dev => {
      if (dev.id === developerId) {
        const newTickets = [...dev.assignedTickets];
        const [removed] = newTickets.splice(fromIndex, 1);
        newTickets.splice(toIndex, 0, removed);
        
        // Update ranks
        return {
          ...dev,
          assignedTickets: newTickets.map((ticket, index) => ({
            ...ticket,
            rank: index + 1
          }))
        };
      }
      return dev;
    }));
    recalculateProjections();
  };

  const recalculateProjections = () => {
    const riskTickets = calculator.getETARiskTickets();
    
    setDevelopers(prev => prev.map(dev => {
      let currentDate = new Date();
      const updatedTickets = dev.assignedTickets.map(ticket => {
        const projectedStart = new Date(currentDate);
        const projectedEnd = addWorkingDays(currentDate, ticket.effort);
        currentDate = addWorkingDays(currentDate, ticket.effort);
        
        const etaDate = ticket.eta ? new Date(ticket.eta) : null;
        const isRisk = etaDate ? projectedEnd > etaDate : 
          riskTickets.some(rt => rt.ticket_id === ticket.id);

        return {
          ...ticket,
          projectedStart,
          projectedEnd,
          isRisk
        };
      });

      return { ...dev, assignedTickets: updatedTickets };
    }));
  };

  const addWorkingDays = (startDate: Date, days: number): Date => {
    const result = new Date(startDate);
    let addedDays = 0;
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++;
      }
    }
    
    return result;
  };

  const filteredBacklogTickets = backlogTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || ticket.type === filterType;
    const matchesEta = !showEtaReady || ticket.eta;
    
    return matchesSearch && matchesType && matchesEta;
  });

  const sprintStats = {
    totalTickets: developers.reduce((sum, dev) => sum + dev.assignedTickets.length, 0),
    totalEffort: developers.reduce((sum, dev) => 
      sum + dev.assignedTickets.reduce((devSum, ticket) => devSum + ticket.effort, 0), 0
    ),
    overloadedDevs: developers.filter(dev => 
      dev.assignedTickets.reduce((sum, ticket) => sum + ticket.effort, 0) > dev.availableEffort
    ).length,
    riskyTickets: developers.reduce((sum, dev) => 
      sum + dev.assignedTickets.filter(ticket => ticket.isRisk).length, 0
    )
  };

  const handleSaveDraft = () => {
    const draftData = {
      backlogTickets,
      developers,
      sprintDuration,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('sprint-draft', JSON.stringify(draftData));
    
    toast({
      title: "Draft Saved",
      description: "Sprint planning draft saved to browser storage",
    });
  };

  const handleFinalize = () => {
    setSprintMode('finalized');
    console.log('Finalizing sprint...');
    // Implementation for finalizing sprint
  };

  const handleExport = () => {
    const exportData = {
      sprintDuration,
      totalTickets: sprintStats.totalTickets,
      totalEffort: sprintStats.totalEffort,
      healthScore: Math.max(0, 100 - ((sprintStats.riskyTickets + sprintStats.overloadedDevs) / Math.max(1, sprintStats.totalTickets)) * 100),
      developers: developers.map(dev => ({
        name: dev.name,
        utilization: Math.round((dev.assignedTickets.reduce((sum, t) => sum + t.effort, 0) / dev.availableEffort) * 100),
        tickets: dev.assignedTickets.map(t => ({
          id: t.id,
          title: t.title,
          effort: t.effort,
          rank: t.rank,
          isRisk: t.isRisk
        }))
      })),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-plan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Sprint Exported",
      description: "Sprint plan exported successfully",
    });
  };

  if (tickets.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Sprint Planning</h1>
          <CSVUpload />
          <p className="text-gray-600 mt-4">Upload your CSV file to start sprint planning.</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Sprint Planning
              </h1>
              <p className="text-gray-600 mt-1">Create and manage sprint assignments with drag-and-drop planning</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {undoStack.length > 0 && (
                <Button
                  onClick={handleUndo}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Undo</span>
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sprint Duration:</span>
                <Input
                  type="number"
                  value={sprintDuration}
                  onChange={(e) => setSprintDuration(Number(e.target.value))}
                  className="w-20"
                  disabled={sprintMode === 'finalized'}
                />
                <span className="text-sm text-gray-600">days</span>
              </div>
              
              <Badge variant={sprintMode === 'draft' ? 'secondary' : 'default'}>
                {sprintMode === 'draft' ? 'Draft Mode' : 'Finalized'}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Tickets</p>
                    <p className="text-2xl font-bold">{sprintStats.totalTickets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Effort</p>
                    <p className="text-2xl font-bold">{sprintStats.totalEffort}d</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Overloaded</p>
                    <p className="text-2xl font-bold text-orange-600">{sprintStats.overloadedDevs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">ETA Risks</p>
                    <p className="text-2xl font-bold text-red-600">{sprintStats.riskyTickets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Three Column Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel: Backlog Pool */}
            <div className="col-span-3">
              <BacklogPool
                tickets={filteredBacklogTickets}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterType={filterType}
                onFilterChange={setFilterType}
                showEtaReady={showEtaReady}
                onShowEtaReadyChange={setShowEtaReady}
                disabled={sprintMode === 'finalized'}
              />
            </div>

            {/* Center Panel: Developer Queues */}
            <div className="col-span-6">
              <DeveloperQueues
                developers={developers}
                onTicketUnassign={handleTicketUnassign}
                disabled={sprintMode === 'finalized'}
              />
            </div>

            {/* Right Panel: Sprint Summary */}
            <div className="col-span-3 space-y-4">
              <SprintSummary
                sprintStats={sprintStats}
                sprintDuration={sprintDuration}
                onRecalculate={recalculateProjections}
                onSaveDraft={handleSaveDraft}
                onFinalize={handleFinalize}
                onExport={handleExport}
                disabled={sprintMode === 'finalized'}
              />
              
              <BandwidthChart developers={developers} />
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {draggedTicket && (
          <div className="ticket-card ticket-card-dragging">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-900">{draggedTicket.id}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{draggedTicket.title}</p>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded ml-2">
                {draggedTicket.effort}d
              </span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default SprintCreation;
