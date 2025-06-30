
import { useState, useCallback } from "react";
import { FilterToolbar } from "@/components/dashboard/FilterToolbar";
import { DynamicKPICards } from "@/components/dashboard/DynamicKPICards";
import { EnhancedDeveloperGantt } from "@/components/dashboard/EnhancedDeveloperGantt";
import { InteractiveRiskCharts } from "@/components/dashboard/InteractiveRiskCharts";
import { EnhancedActiveTicketsTable } from "@/components/dashboard/EnhancedActiveTicketsTable";
import { InsightStrip } from "@/components/dashboard/InsightStrip";
import { AgendaPanel } from "@/components/dashboard/AgendaPanel";
import { mockDashboardData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [showFilter, setShowFilter] = useState<'all' | 'blocked' | 'eta-risk'>('all');
  const [selectedDeveloper, setSelectedDeveloper] = useState('all');
  const [selectedBlockerSource, setSelectedBlockerSource] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [agendaTickets, setAgendaTickets] = useState<string[]>([]);

  // Derive data from mockData
  const developers = mockDashboardData.developers.map(dev => dev.name);
  const blockerSources = mockDashboardData.blockersBySource.map(b => b.name);

  // Filter tickets based on current filters
  const filteredTickets = mockDashboardData.activeTickets.filter(ticket => {
    if (showFilter === 'blocked' && ticket.daysBlocked === 0) return false;
    if (showFilter === 'eta-risk' && !ticket.isRisk) return false;
    if (selectedDeveloper !== 'all' && ticket.owner !== selectedDeveloper) return false;
    if (selectedBlockerSource !== 'all' && ticket.blockedBy !== selectedBlockerSource) return false;
    return true;
  });

  // Filter developers based on current filters
  const filteredDevelopers = mockDashboardData.developers.filter(dev => {
    if (selectedDeveloper !== 'all' && dev.name !== selectedDeveloper) return false;
    return true;
  }).map(dev => ({
    ...dev,
    tickets: dev.tickets.filter(ticket => {
      if (showFilter === 'blocked' && !ticket.isBlocked) return false;
      if (showFilter === 'eta-risk' && ticket.status !== 'overdue') return false;
      return true;
    })
  }));

  // Calculate dynamic KPIs
  const kpiData = {
    blockedTickets: mockDashboardData.activeTickets.filter(t => t.daysBlocked > 0).length,
    avgDaysBlocked: mockDashboardData.activeTickets
      .filter(t => t.daysBlocked > 0)
      .reduce((sum, t) => sum + t.daysBlocked, 0) / 
      Math.max(mockDashboardData.activeTickets.filter(t => t.daysBlocked > 0).length, 1),
    etaRiskTickets: mockDashboardData.activeTickets.filter(t => t.isRisk).length,
    devsWithRisk: new Set(mockDashboardData.activeTickets.filter(t => t.isRisk).map(t => t.owner)).size,
    ticketsClosed7d: mockDashboardData.kpis.ticketsClosed7d,
    blockedBreakdown: mockDashboardData.activeTickets
      .filter(t => t.blockedBy)
      .reduce((acc: { [key: string]: number }, t) => {
        acc[t.blockedBy!] = (acc[t.blockedBy!] || 0) + 1;
        return acc;
      }, {})
  };

  const handleRefresh = useCallback(() => {
    setLastRefresh(new Date());
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated with latest information.",
    });
  }, [toast]);

  const handleTicketClick = useCallback((ticketId: string) => {
    toast({
      title: "Ticket Details",
      description: `Opening details for ${ticketId}`,
    });
  }, [toast]);

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
      title: "Filter Applied",
      description: `Showing tickets for ${developer}`,
    });
  }, [toast]);

  const handleBlockerSourceClick = useCallback((source: string) => {
    setSelectedBlockerSource(source);
    toast({
      title: "Filter Applied", 
      description: `Showing tickets blocked by ${source}`,
    });
  }, [toast]);

  const handleExportAgenda = useCallback(() => {
    const agendaData = mockDashboardData.activeTickets
      .filter(t => agendaTickets.includes(t.id))
      .map(t => `• ${t.id}: ${t.title} (${t.owner})${t.isRisk ? ' ⚠️' : ''}${t.daysBlocked > 0 ? ' 🚫' : ''}`)
      .join('\n');
    
    navigator.clipboard.writeText(`Stand-up Agenda Items:\n${agendaData}`);
    toast({
      title: "Agenda Copied",
      description: "Stand-up agenda has been copied to clipboard",
    });
  }, [agendaTickets, toast]);

  const agendaTicketData = mockDashboardData.activeTickets
    .filter(t => agendaTickets.includes(t.id))
    .map(t => ({
      id: t.id,
      title: t.title,
      owner: t.owner,
      isRisk: t.isRisk,
      daysBlocked: t.daysBlocked,
      eta: t.eta
    }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Pulse Dashboard</h1>
          <p className="text-gray-600">Daily Engineering Stand-up • Live Status</p>
        </div>

        {/* Filter Toolbar */}
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

        {/* Dynamic KPI Cards */}
        <DynamicKPICards kpiData={kpiData} />

        {/* Enhanced Developer Gantt Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Developer Workload Gantt</h2>
          <EnhancedDeveloperGantt 
            developers={filteredDevelopers}
            onTicketClick={handleTicketClick}
          />
        </div>

        {/* Interactive Risk Analysis Charts */}
        <InteractiveRiskCharts 
          riskByDeveloper={mockDashboardData.riskByDeveloper}
          blockersBySource={mockDashboardData.blockersBySource}
          onDeveloperClick={handleDeveloperClick}
          onBlockerSourceClick={handleBlockerSourceClick}
        />

        {/* Enhanced Active Tickets Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Active Risk & Blocked Tickets 
            <span className="text-sm font-normal ml-2">({filteredTickets.length} shown)</span>
          </h2>
          <EnhancedActiveTicketsTable 
            tickets={filteredTickets.map(t => ({ ...t, addedToAgenda: agendaTickets.includes(t.id) }))}
            onTicketClick={handleTicketClick}
            onToggleAgenda={handleToggleAgenda}
          />
        </div>

        {/* AI Insights */}
        <InsightStrip />

        {/* Agenda Panel */}
        <AgendaPanel
          tickets={agendaTicketData}
          onRemoveFromAgenda={handleToggleAgenda}
          onExportAgenda={handleExportAgenda}
        />
      </div>
    </div>
  );
};

export default Index;
