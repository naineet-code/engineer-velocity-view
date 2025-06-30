
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { AlertTriangle, Clock, Target, Users, TrendingUp, Calendar, Download } from "lucide-react";
import { CSVUpload } from "@/components/shared/CSVUpload";
import { StandupSummaryExporter } from "@/components/shared/StandupSummaryExporter";
import { DeveloperGantt } from "@/components/dashboard/DeveloperGantt";
import { useData } from "@/contexts/DataContext";
import { KPICalculator } from "@/utils/kpiCalculations";
import { useNavigate } from "react-router-dom";

interface GanttDeveloper {
  name: string;
  tickets: Array<{
    id: string;
    title: string;
    status: string;
    etaDate: Date;
    effortDays: number;
    isBlocked: boolean;
    isRisk: boolean;
    rank: number;
    owner: string;
    blockedDays?: number;
    blockedBy?: string;
    effortRemaining?: number;
    projectedCompletion?: string;
    etaPosition?: number;
    overdueDays?: number;
  }>;
}

const TeamPulse = () => {
  const { tickets } = useData();
  const navigate = useNavigate();
  const [showOnlyBlocked, setShowOnlyBlocked] = useState(false);
  const [showOnlyRisk, setShowOnlyRisk] = useState(false);

  const calculator = useMemo(() => new KPICalculator(tickets), [tickets]);

  // KPI Calculations
  const kpis = useMemo(() => {
    return [
      {
        title: "Total Blocked",
        value: calculator.getTotalBlockedTickets(),
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50"
      },
      {
        title: "Avg Days Blocked",
        value: calculator.getAverageDaysBlocked(),
        icon: Clock,
        color: "text-amber-600",
        bgColor: "bg-amber-50"
      },
      {
        title: "ETA Risk Tickets",
        value: calculator.getETARiskTickets().length,
        icon: Target,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      {
        title: "Developers with Risk",
        value: calculator.getDevelopersWithRisk(),
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      {
        title: "Closed Yesterday",
        value: calculator.getTicketsClosedYesterday(),
        icon: TrendingUp,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        title: "Closed Last 7 Days",
        value: calculator.getTicketsClosedLast7Days(),
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      }
    ];
  }, [calculator]);

  // Time Distribution Chart Data
  const timeDistribution = useMemo(() => {
    const distribution = calculator.getTimeDistribution();
    return [
      { name: "Development", value: Math.round(distribution.Development), color: "#22c55e" },
      { name: "Blocked", value: Math.round(distribution.Blocked), color: "#ef4444" },
      { name: "Review", value: Math.round(distribution.Review), color: "#f59e0b" },
      { name: "Release", value: Math.round(distribution.Release), color: "#3b82f6" }
    ];
  }, [calculator]);

  // Blockers by Source Chart Data
  const blockersBySource = useMemo(() => {
    const blockers = calculator.getBlockersBySource();
    return Object.entries(blockers).map(([source, count]) => ({
      name: source,
      value: count,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
  }, [calculator]);

  // Developer Data for Gantt
  const developerData = useMemo(() => {
    const devMap = new Map<string, GanttDeveloper>();
    const riskTickets = calculator.getETARiskTickets();
    
    tickets.forEach(ticket => {
      if (!devMap.has(ticket.developer)) {
        devMap.set(ticket.developer, {
          name: ticket.developer,
          tickets: []
        });
      }
      
      const isRisk = riskTickets.some(rt => rt.ticket_id === ticket.ticket_id);
      const isBlocked = ['Clarification', 'Business QC', 'Release Plan'].includes(ticket.status);
      
      devMap.get(ticket.developer)!.tickets.push({
        id: ticket.ticket_id,
        title: ticket.title,
        status: ticket.status,
        etaDate: new Date(ticket.ETA),
        effortDays: ticket.effort_points,
        isBlocked,
        isRisk,
        rank: ticket.rank,
        owner: ticket.developer,
        blockedBy: ticket.blocked_by,
        effortRemaining: ticket.effort_points
      });
    });

    return Array.from(devMap.values());
  }, [tickets, calculator]);

  // Filter tickets based on toggles
  const filteredTickets = useMemo(() => {
    let filtered = tickets;
    
    if (showOnlyBlocked) {
      filtered = filtered.filter(ticket => 
        ['Clarification', 'Business QC', 'Release Plan'].includes(ticket.status)
      );
    }
    
    if (showOnlyRisk) {
      const riskTickets = calculator.getETARiskTickets();
      filtered = filtered.filter(ticket => 
        riskTickets.some(rt => rt.ticket_id === ticket.ticket_id)
      );
    }
    
    return filtered;
  }, [tickets, showOnlyBlocked, showOnlyRisk, calculator]);

  const handleTicketClick = (ticketId: string) => {
    navigate(`/ticket-view/${ticketId}`);
  };

  const handleDeveloperClick = (developerName: string) => {
    navigate(`/developer-view/${developerName}`);
  };

  const chartConfig: ChartConfig = {
    development: { label: "Development", color: "#22c55e" },
    blocked: { label: "Blocked", color: "#ef4444" },
    review: { label: "Review", color: "#f59e0b" },
    release: { label: "Release", color: "#3b82f6" }
  };

  if (tickets.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Team Pulse Dashboard</h1>
          <CSVUpload />
          <p className="text-gray-600 mt-4">Upload your CSV file to see team metrics and insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Pulse Dashboard</h1>
        <div className="flex gap-4">
          <StandupSummaryExporter />
          <Button onClick={() => navigate('/sprint-planning')}>
            Create Sprint
          </Button>
        </div>
      </div>

      <CSVUpload />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className={`${kpi.bgColor} border-0`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={showOnlyBlocked}
              onCheckedChange={setShowOnlyBlocked}
            />
            <span>Show Only Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={showOnlyRisk}
              onCheckedChange={setShowOnlyRisk}
            />
            <span>Show Only ETA Risk</span>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={timeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${Math.round(percent)}%`}
                >
                  {timeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blockers by Source</CardTitle>
          </CardHeader>
          <CardContent>
            {blockersBySource.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <BarChart data={blockersBySource}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-gray-500 text-center py-4">No blockers found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Developer Gantt */}
      <DeveloperGantt 
        developers={developerData} 
        onTicketClick={handleTicketClick}
      />

      {/* Filtered Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tickets ({filteredTickets.length})
            {showOnlyBlocked && <Badge variant="destructive" className="ml-2">Blocked Only</Badge>}
            {showOnlyRisk && <Badge variant="destructive" className="ml-2">Risk Only</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Ticket</th>
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Developer</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">ETA</th>
                  <th className="text-left p-2">Effort</th>
                  <th className="text-left p-2">Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.ticket_id} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleTicketClick(ticket.ticket_id)}
                  >
                    <td className="p-2 font-mono text-sm">{ticket.ticket_id}</td>
                    <td className="p-2">{ticket.title}</td>
                    <td className="p-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeveloperClick(ticket.developer);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {ticket.developer}
                      </button>
                    </td>
                    <td className="p-2">
                      <Badge variant={
                        ['Clarification', 'Business QC', 'Release Plan'].includes(ticket.status) 
                          ? 'destructive' 
                          : ticket.status === 'Closed' 
                            ? 'default' 
                            : 'secondary'
                      }>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="p-2">{ticket.ETA}</td>
                    <td className="p-2">{ticket.effort_points}d</td>
                    <td className="p-2">
                      <Badge variant={
                        ticket.priority === 'high' || ticket.priority === 'critical' 
                          ? 'destructive' 
                          : 'outline'
                      }>
                        {ticket.priority}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPulse;
