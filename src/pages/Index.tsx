import { useState, useCallback, useMemo } from "react";
import { FilterToolbar } from "@/components/dashboard/FilterToolbar";
import { DynamicKPICards } from "@/components/dashboard/DynamicKPICards";
import { LiveGanttChart } from "@/components/dashboard/LiveGanttChart";
import { InteractiveRiskCharts } from "@/components/dashboard/InteractiveRiskCharts";
import { EnhancedActiveTicketsTable } from "@/components/dashboard/EnhancedActiveTicketsTable";
import { InsightStrip } from "@/components/dashboard/InsightStrip";
import { AgendaPanel } from "@/components/dashboard/AgendaPanel";
import { Phase2PlanningPanel } from "@/components/dashboard/Phase2PlanningPanel";
import { mockDashboardData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { simulationEngine } from "@/utils/ganttSimulation";

const Index = () => {
  const { toast } = useToast();
  const [showFilter, setShowFilter] = useState<'all' | 'blocked' | 'eta-risk'>('all');
  const [selectedDeveloper, setSelectedDeveloper] = useState('all');
  const [selectedBlockerSource, setSelectedBlockerSource] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [agendaTickets, setAgendaTickets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today');
  const [showPhase2Panel, setShowPhase2Panel] = useState(false);

  // Real-time computed data using simulation engine
  const simulatedData = useMemo(() => {
    console.log('🚀 Running real-time dashboard simulation...');
    
    const simulatedDevelopers = mockDashboardData.developers.map(dev => 
      simulationEngine.simulateDeveloperQueue(dev)
    );
    
    const allSimulatedTickets = simulatedDevelopers.flatMap(dev => dev.tickets);
    
    return {
      developers: simulatedDevelopers,
      tickets: allSimulatedTickets,
      insights: simulationEngine.generateInsights(simulatedDevelopers)
    };
  }, [mockDashboardData, lastRefresh]);

  // Derive data from simulation
  const developers = mockDashboardData.developers.map(dev => dev.name);
  const blockerSources = mockDashboardData.blockersBySource.map(b => b.name);

  // Enhanced filtering with simulation data
  const filteredTickets = useMemo(() => {
    let tickets = [...simulatedData.tickets];
    
    if (showFilter === 'blocked') tickets = tickets.filter(t => t.isBlocked);
    if (showFilter === 'eta-risk') tickets = tickets.filter(t => t.isRisk);
    if (selectedDeveloper !== 'all') tickets = tickets.filter(t => t.owner === selectedDeveloper);
    if (selectedBlockerSource !== 'all') tickets = tickets.filter(t => t.blockedBy === selectedBlockerSource);
    
    return tickets;
  }, [simulatedData.tickets, showFilter, selectedDeveloper, selectedBlockerSource]);

  // Enhanced KPI calculation with simulation data
  const kpiData = useMemo(() => {
    const blockedTickets = simulatedData.tickets.filter(t => t.isBlocked).length;
    const avgDaysBlocked = simulatedData.tickets
      .filter(t => t.isBlocked)
      .reduce((sum, t) => sum + t.daysBlocked, 0) / Math.max(blockedTickets, 1);
    
    const etaRiskTickets = simulatedData.tickets.filter(t => t.isRisk).length;
    const devsWithRisk = new Set(simulatedData.tickets.filter(t => t.isRisk).map(t => t.owner)).size;
    
    const blockedBreakdown = simulatedData.tickets
      .filter(t => t.blockedBy)
      .reduce((acc: { [key: string]: number }, t) => {
        acc[t.blockedBy!] = (acc[t.blockedBy!] || 0) + 1;
        return acc;
      }, {});

    return {
      blockedTickets,
      avgDaysBlocked: Math.round(avgDaysBlocked * 10) / 10,
      etaRiskTickets,
      devsWithRisk,
      ticketsClosed7d: mockDashboardData.kpis.ticketsClosed7d,
      blockedBreakdown
    };
  }, [simulatedData]);

  // Phase 2 Planning Handlers
  const handleTicketReorder = useCallback((ticketId: string, newRank: number) => {
    console.log(`Reordering ticket ${ticketId} to rank ${newRank}`);
    // In real implementation, this would update the backend
    setLastRefresh(new Date()); // Trigger simulation refresh
    toast({
      title: "Ticket Reordered",
      description: `${ticketId} moved to rank #${newRank}`,
    });
  }, [toast]);

  const handleTicketReassign = useCallback((ticketId: string, newDeveloper: string) => {
    console.log(`Reassigning ticket ${ticketId} to ${newDeveloper}`);
    // In real implementation, this would update the backend
    setLastRefresh(new Date()); // Trigger simulation refresh
    toast({
      title: "Ticket Reassigned",
      description: `${ticketId} assigned to ${newDeveloper}`,
    });
  }, [toast]);

  const handleEtaUpdate = useCallback((ticketId: string, newEta: string) => {
    console.log(`Updating ETA for ticket ${ticketId} to ${newEta}`);
    // In real implementation, this would update the backend
    setLastRefresh(new Date()); // Trigger simulation refresh
    toast({
      title: "ETA Updated",
      description: `${ticketId} ETA set to ${newEta}`,
    });
  }, [toast]);

  const handleBlockerResolve = useCallback((ticketId: string) => {
    console.log(`Resolving blocker for ticket ${ticketId}`);
    // In real implementation, this would update the backend
    setLastRefresh(new Date()); // Trigger simulation refresh
    toast({
      title: "Blocker Resolved",
      description: `${ticketId} unblocked successfully`,
    });
  }, [toast]);

  const handleSimulationUpdate = useCallback(() => {
    setLastRefresh(new Date());
  }, []);

  const handleRefresh = useCallback(() => {
    setLastRefresh(new Date());
    toast({
      title: "Live Data Refreshed",
      description: "Dashboard simulation updated with latest projections.",
    });
  }, [toast]);

  const handleTicketClick = useCallback((ticketId: string) => {
    const ticket = simulatedData.tickets.find(t => t.id === ticketId);
    toast({
      title: "Ticket Details",
      description: ticket ? 
        `${ticket.title} - ETA: ${ticket.etaDate.toLocaleDateString()} | Projected: ${ticket.projectedEndDate.toLocaleDateString()}` :
        `Opening details for ${ticketId}`,
    });
  }, [simulatedData.tickets, toast]);

  const handleToggleAgenda = useCallback((ticketId: string) => {
    setAgendaTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  }, []);

  const handleDeveloperClick = useCallback((developer: string) => {
    setSelectedDeveloper(developer);
    toast({
      title: "Live Filter Applied",
      description: `Showing simulated queue for ${developer}`,
    });
  }, [toast]);

  const handleBlockerSourceClick = useCallback((source: string) => {
    setSelectedBlockerSource(source);
    toast({
      title: "Live Filter Applied", 
      description: `Showing tickets blocked by ${source}`,
    });
  }, [toast]);

  const handleExportAgenda = useCallback(() => {
    const agendaData = simulatedData.tickets
      .filter(t => agendaTickets.includes(t.id))
      .map(t => `• ${t.id}: ${t.title} (${t.owner})${t.isRisk ? ' ⚠️' : ''}${t.isBlocked ? ' 🚫' : ''}`)
      .join('\n');
    
    const insightsData = simulatedData.insights.map(insight => `📊 ${insight}`).join('\n');
    
    const fullAgenda = `Stand-up Agenda Items:\n${agendaData}\n\nKey Insights:\n${insightsData}`;
    
    navigator.clipboard.writeText(fullAgenda);
    toast({
      title: "Live Agenda Copied",
      description: "Stand-up agenda with live insights copied to clipboard",
    });
  }, [agendaTickets, simulatedData, toast]);

  // Create current filter object
  const currentFilters = {
    showFilter,
    selectedDeveloper,
    selectedBlockerSource
  };

  const agendaTicketData = simulatedData.tickets
    .filter(t => agendaTickets.includes(t.id))
    .map(t => ({
      id: t.id,
      title: t.title,
      owner: t.owner,
      isRisk: t.isRisk,
      daysBlocked: t.daysBlocked,
      eta: t.etaDate.toISOString().split('T')[0]
    }));

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Team Pulse Dashboard 
                <span className="text-lg font-normal text-green-600 ml-2">🔴 LIVE</span>
              </h1>
              <p className="text-gray-600">
                Real-time Engineering Stand-up • Live Queue Simulation • Auto-updating Insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPhase2Panel(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>🚀 Phase 2 Planning</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Toolbar */}
        <FilterToolbar
          showFilter={showFilter}
          onShowFilterChange={setShowFilter}
          selectedDeveloper={selectedDeveloper}
          onDeveloperChange={setSelectedDeveloper}
          selectedBlockerSource={selectedBlockerSource}
          onBlockerSourceChange={setSelectedBlockerSource}
          developers={developers}
          blockerSources={blockerSources}
          onRefresh={handleRefresh}
          lastRefresh={lastRefresh}
        />

        {/* Live KPI Cards */}
        <DynamicKPICards kpiData={kpiData} />

        {/* Live Gantt Chart with Simulation */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Live Developer Queue Simulation
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time projection</span>
            </div>
          </div>
          <LiveGanttChart 
            developers={mockDashboardData.developers}
            onTicketClick={handleTicketClick}
            filters={currentFilters}
          />
        </div>

        {/* Interactive Risk Analysis Charts */}
        <InteractiveRiskCharts 
          riskByDeveloper={mockDashboardData.riskByDeveloper}
          blockersBySource={mockDashboardData.blockersBySource}
          onDeveloperClick={handleDeveloperClick}
          onBlockerSourceClick={handleBlockerSourceClick}
        />

        {/* Enhanced Active Tickets Table with Live Data */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Live Risk & Blocked Tickets 
            <span className="text-sm font-normal ml-2">({filteredTickets.length} projected)</span>
          </h2>
          <EnhancedActiveTicketsTable 
            tickets={mockDashboardData.activeTickets.map(t => ({ 
              ...t, 
              addedToAgenda: agendaTickets.includes(t.id) 
            }))}
            onTicketClick={handleTicketClick}
            onToggleAgenda={handleToggleAgenda}
          />
        </div>

        {/* Live AI Insights */}
        <InsightStrip />

        {/* Enhanced Agenda Panel */}
        <AgendaPanel
          tickets={agendaTicketData}
          onRemoveFromAgenda={handleToggleAgenda}
          onExportAgenda={handleExportAgenda}
        />

        {/* Phase 2 Interactive Planning Panel */}
        {showPhase2Panel && (
          <Phase2PlanningPanel
            developers={simulatedData.developers}
            onTicketReorder={handleTicketReorder}
            onTicketReassign={handleTicketReassign}
            onEtaUpdate={handleEtaUpdate}
            onBlockerResolve={handleBlockerResolve}
            onSimulationUpdate={handleSimulationUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
