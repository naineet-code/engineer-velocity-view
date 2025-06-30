
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, User, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { KPICalculator } from "@/utils/kpiCalculations";
import { CSVUpload } from "@/components/shared/CSVUpload";
import { StandupSummaryExporter } from "@/components/shared/StandupSummaryExporter";
import { DeveloperGantt } from "@/components/dashboard/DeveloperGantt";
import { AgendaPanel } from "@/components/dashboard/AgendaPanel";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Index = () => {
  const navigate = useNavigate();
  const { tickets } = useData();
  const [agendaTickets, setAgendaTickets] = useState<any[]>([]);
  const [showOnlyBlocked, setShowOnlyBlocked] = useState(false);
  const [showOnlyRisk, setShowOnlyRisk] = useState(false);

  if (tickets.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Pulse Dashboard</h1>
          <p className="text-gray-600">Upload your CSV data to get started with Aura</p>
        </div>
        <CSVUpload />
      </div>
    );
  }

  const calculator = new KPICalculator(tickets);
  const riskTickets = calculator.getETARiskTickets();
  const blockersBySource = calculator.getBlockersBySource();

  // Prepare chart data
  const blockerChartData = Object.entries(blockersBySource).map(([source, count]) => ({
    name: source,
    value: count,
    color: source === 'Success Team' ? '#ef4444' : source === 'Client' ? '#f59e0b' : '#3b82f6'
  }));

  const timeDistribution = calculator.getTimeDistribution();
  const timeChartData = Object.entries(timeDistribution).map(([status, time]) => ({
    status,
    time: Math.round(time)
  }));

  // Group tickets by developer for Gantt
  const developerGroups = tickets.reduce((groups: any, ticket) => {
    if (!groups[ticket.developer]) {
      groups[ticket.developer] = {
        name: ticket.developer,
        tickets: []
      };
    }
    groups[ticket.developer].tickets.push({
      id: ticket.ticket_id,
      title: ticket.title,
      status: ticket.status,
      etaDate: new Date(ticket.ETA),
      effortDays: ticket.effort_points,
      isBlocked: ['Clarification', 'Business QC', 'Release Plan'].includes(ticket.status),
      isRisk: riskTickets.some(risk => risk.ticket_id === ticket.ticket_id),
      rank: ticket.rank,
      owner: ticket.developer,
      effortRemaining: ticket.effort_points,
      projectedCompletion: ticket.ETA,
      blockedBy: ticket.blocked_by,
      daysBlocked: ticket.blocked_by ? 1 : 0
    });
    return groups;
  }, {});

  const developers = Object.values(developerGroups);

  const handleTicketClick = (ticketId: string) => {
    navigate(`/ticket-view/${ticketId}`);
  };

  const handleAddToAgenda = (ticket: any) => {
    if (!agendaTickets.find(t => t.id === ticket.id)) {
      setAgendaTickets([...agendaTickets, ticket]);
    }
  };

  const handleRemoveFromAgenda = (ticketId: string) => {
    setAgendaTickets(agendaTickets.filter(t => t.id !== ticketId));
  };

  const handleExportAgenda = () => {
    let summary = '📋 **Stand-up Agenda Items**\n\n';
    agendaTickets.forEach(ticket => {
      summary += `• ${ticket.id}: ${ticket.title} (${ticket.owner})\n`;
      if (ticket.isRisk) summary += '  ⚠️ ETA Risk\n';
      if (ticket.daysBlocked > 0) summary += `  🔴 Blocked ${ticket.daysBlocked}d by ${ticket.blockedBy}\n`;
      summary += '\n';
    });

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenda-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Pulse Dashboard</h1>
          <p className="text-gray-600">Real-time engineering workflow insights</p>
        </div>
        <div className="flex gap-2">
          <StandupSummaryExporter />
          <Button onClick={() => navigate('/sprint-planning')} className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Create Sprint
          </Button>
        </div>
      </div>

      <CSVUpload />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked Tickets</p>
                <p className="text-2xl font-bold text-red-600">{calculator.getTotalBlockedTickets()}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Days Blocked</p>
                <p className="text-2xl font-bold text-amber-600">{calculator.getAverageDaysBlocked()}d</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ETA Risk</p>
                <p className="text-2xl font-bold text-red-600">{riskTickets.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Devs with Risk</p>
                <p className="text-2xl font-bold text-orange-600">{calculator.getDevelopersWithRisk()}</p>
              </div>
              <User className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed Yesterday</p>
                <p className="text-2xl font-bold text-green-600">{calculator.getTicketsClosedYesterday()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed (7d)</p>
                <p className="text-2xl font-bold text-green-600">{calculator.getTicketsClosedLast7Days()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toggles */}
      <div className="flex gap-4">
        <Button
          variant={showOnlyBlocked ? "default" : "outline"}
          onClick={() => setShowOnlyBlocked(!showOnlyBlocked)}
          className="rounded-2xl"
        >
          Show Only Blocked
        </Button>
        <Button
          variant={showOnlyRisk ? "default" : "outline"}
          onClick={() => setShowOnlyRisk(!showOnlyRisk)}
          className="rounded-2xl"
        >
          Show Only ETA Risk
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Time Distribution by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Bar dataKey="time" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Blockers by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={blockerChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {blockerChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Developer Gantt */}
      <DeveloperGantt 
        developers={developers} 
        onTicketClick={handleTicketClick}
      />

      {/* AI Insights */}
      <Card className="rounded-2xl bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">AI Insights</h3>
              <div className="space-y-2">
                {calculator.getTotalBlockedTickets() > 0 && (
                  <p className="text-sm text-blue-800">
                    🔴 {calculator.getTotalBlockedTickets()} tickets currently blocked - consider escalation
                  </p>
                )}
                {riskTickets.length > 0 && (
                  <p className="text-sm text-blue-800">
                    ⚠️ {riskTickets.length} tickets at ETA risk - review capacity planning
                  </p>
                )}
                {calculator.getTicketsClosedLast7Days() > 0 && (
                  <p className="text-sm text-blue-800">
                    ✅ Good velocity: {calculator.getTicketsClosedLast7Days()} tickets completed this week
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agenda Panel */}
      {agendaTickets.length > 0 && (
        <AgendaPanel
          tickets={agendaTickets}
          onRemoveFromAgenda={handleRemoveFromAgenda}
          onExportAgenda={handleExportAgenda}
        />
      )}
    </div>
  );
};

export default Index;
