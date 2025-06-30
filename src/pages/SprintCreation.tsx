
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Rocket, 
  RefreshCw, 
  Download,
  Search,
  Filter,
  AlertTriangle,
  Users,
  Clock,
  Target
} from 'lucide-react';
import { BacklogPool } from '@/components/sprint-planning/BacklogPool';
import { DeveloperQueues } from '@/components/sprint-planning/DeveloperQueues';
import { SprintSummary } from '@/components/sprint-planning/SprintSummary';
import { BandwidthChart } from '@/components/sprint-planning/BandwidthChart';
import { CSVUpload } from '@/components/shared/CSVUpload';
import { useData } from '@/contexts/DataContext';
import { KPICalculator } from '@/utils/kpiCalculations';

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
  const [sprintDuration, setSprintDuration] = useState(10);
  const [sprintMode, setSprintMode] = useState<'draft' | 'finalized'>('draft');
  const [backlogTickets, setBacklogTickets] = useState<PlanningTicket[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'bug' | 'story' | 'task'>('all');
  const [showEtaReady, setShowEtaReady] = useState(false);

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
    console.log('Saving sprint draft...');
    // Implementation for saving draft
  };

  const handleFinalize = () => {
    setSprintMode('finalized');
    console.log('Finalizing sprint...');
    // Implementation for finalizing sprint
  };

  const handleExport = () => {
    console.log('Exporting sprint summary...');
    // Implementation for exporting summary
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint Planning</h1>
            <p className="text-gray-600 mt-1">Create and manage sprint assignments with drag-and-drop planning</p>
          </div>
          
          <div className="flex items-center space-x-4">
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
              onTicketAssign={handleTicketAssign}
              disabled={sprintMode === 'finalized'}
            />
          </div>

          {/* Center Panel: Developer Queues */}
          <div className="col-span-6">
            <DeveloperQueues
              developers={developers}
              onTicketUnassign={handleTicketUnassign}
              onTicketReorder={handleTicketReorder}
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
  );
};

export default SprintCreation;
