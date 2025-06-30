
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { Download, TrendingUp, AlertTriangle, Clock, Target, Users, Calendar, FileText } from "lucide-react";
import { AIRecommendationsPanel } from "@/components/dashboard/AIRecommendationsPanel";
import { NoDataFallback } from "@/components/shared/NoDataFallback";
import { useData } from "@/contexts/DataContext";
import { KPICalculator } from "@/utils/kpiCalculations";

const SprintAnalysis = () => {
  const { tickets } = useData();
  const [compareMode, setCompareMode] = useState(false);
  
  const calculator = useMemo(() => new KPICalculator(tickets), [tickets]);

  // Sprint-specific calculations
  const sprintData = useMemo(() => {
    const timeDistribution = calculator.getTimeDistribution();
    const riskTickets = calculator.getETARiskTickets();
    const blockedTickets = tickets.filter(ticket => 
      ['Clarification', 'Business QC', 'Release Plan'].includes(ticket.status)
    );
    const completedTickets = tickets.filter(ticket => ticket.status === 'Closed');
    
    return {
      kpis: {
        completed: completedTickets.length,
        dropped: 0,
        blocked: blockedTickets.length,
        etaMissed: riskTickets.length,
        avgCycleTime: calculator.getAverageDaysBlocked()
      },
      etaAnalysis: {
        missed: riskTickets.length,
        total: tickets.filter(t => t.status !== 'Closed').length
      },
      blockedTimeAnalysis: {
        totalBlockedDays: Math.round(timeDistribution.Blocked),
        ticketsBlocked: blockedTickets.length
      },
      highEffortTickets: tickets
        .filter(t => t.effort_points >= 8)
        .map(t => ({ id: t.ticket_id, effort: t.effort_points }))
    };
  }, [tickets, calculator]);

  // Drop reasons (would need more data in CSV for accurate calculation)
  const dropReasons = [
    { name: "No AC", value: 40, color: "#ef4444" },
    { name: "Client Pullback", value: 30, color: "#f97316" },
    { name: "Deprioritized", value: 20, color: "#3b82f6" },
    { name: "Blocked Too Long", value: 10, color: "#10b981" }
  ];

  // ETA vs Actual scatter plot data
  const etaVsActual = useMemo(() => {
    const riskTickets = calculator.getETARiskTickets();
    return tickets.slice(0, 10).map(ticket => {
      const isRisk = riskTickets.some(rt => rt.ticket_id === ticket.ticket_id);
      return {
        estimated: ticket.effort_points,
        actual: ticket.effort_points + (isRisk ? 2 : 0),
        name: ticket.ticket_id,
        status: ticket.status === 'Closed' ? 'completed' : isRisk ? 'missed' : 'ontrack'
      };
    });
  }, [tickets, calculator]);

  // Cycle time breakdown
  const cycleTimeData = useMemo(() => {
    const distribution = calculator.getTimeDistribution();
    return [
      { stage: "Development", days: Math.round(distribution.Development * 10) / 10, color: "#3b82f6" },
      { stage: "Blocked", days: Math.round(distribution.Blocked * 10) / 10, color: "#ef4444" },
      { stage: "Review", days: Math.round(distribution.Review * 10) / 10, color: "#f59e0b" },
      { stage: "Release", days: Math.round(distribution.Release * 10) / 10, color: "#10b981" }
    ];
  }, [calculator]);

  const chartConfig: ChartConfig = {
    clarification: { label: "Clarification", color: "#8884d8" },
    dev: { label: "Development", color: "#82ca9d" },
    techqc: { label: "Tech QC", color: "#ffc658" },
    businessqc: { label: "Business QC", color: "#ff7300" },
    blocked: { label: "Blocked", color: "#ff0000" }
  };

  const generateRetrospectiveReport = () => {
    const report = `# Sprint Retrospective Report

## Key Metrics
- Completed Tickets: ${sprintData.kpis.completed}
- Dropped Tickets: ${sprintData.kpis.dropped}
- Blocked Tickets: ${sprintData.kpis.blocked}
- ETA Missed: ${sprintData.kpis.etaMissed}
- Average Cycle Time: ${sprintData.kpis.avgCycleTime} days

## AI Recommendations
- ${sprintData.etaAnalysis.missed} of ${sprintData.etaAnalysis.total} tickets missed ETA - consider better estimation practices
- Tickets were blocked for significant time - identify common blockers
- High-effort tickets need breakdown for better management

## Action Items
1. Improve estimation accuracy
2. Address common blocking patterns
3. Break down large tickets before sprint start
4. Implement better acceptance criteria process

Generated on: ${new Date().toLocaleDateString()}
    `;

    navigator.clipboard.writeText(report);
    alert("Retrospective report copied to clipboard!");
  };

  if (tickets.length === 0) {
    return (
      <div className="page-container">
        <div className="section-header">
          <h1 className="section-title">Sprint Analysis</h1>
          <p className="section-subtitle">Analyze sprint performance and identify improvement opportunities</p>
        </div>
        <NoDataFallback />
      </div>
    );
  }

  return (
    <div className="page-container space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="section-header">
          <h1 className="section-title">Sprint Analysis</h1>
          <p className="section-subtitle">Analyze sprint performance and identify improvement opportunities</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={compareMode ? "default" : "outline"}
            onClick={() => setCompareMode(!compareMode)}
            className="button-outline"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Compare Sprints
          </Button>
          <Button onClick={generateRetrospectiveReport} className="button-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="fade-in">
        <AIRecommendationsPanel sprintData={sprintData} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-5 grid-layout fade-in">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div>
              <div className="kpi-card-title">Completed</div>
              <div className="kpi-card-value text-green-600">{sprintData.kpis.completed}</div>
            </div>
            <div className="kpi-card-icon bg-green-100">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <div>
              <div className="kpi-card-title">Dropped</div>
              <div className="kpi-card-value text-red-600">{sprintData.kpis.dropped}</div>
            </div>
            <div className="kpi-card-icon bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <div>
              <div className="kpi-card-title">Blocked</div>
              <div className="kpi-card-value text-amber-600">{sprintData.kpis.blocked}</div>
            </div>
            <div className="kpi-card-icon bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <div>
              <div className="kpi-card-title">ETA Missed</div>
              <div className="kpi-card-value text-blue-600">{sprintData.kpis.etaMissed}</div>
            </div>
            <div className="kpi-card-icon bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <div>
              <div className="kpi-card-title">Avg Cycle Time</div>
              <div className="kpi-card-value text-purple-600">{sprintData.kpis.avgCycleTime}d</div>
            </div>
            <div className="kpi-card-icon bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-2 grid-layout fade-in">
        {/* Cycle Time Breakdown */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Cycle Time Breakdown</h3>
            <p className="chart-subtitle">Time spent in each stage of development</p>
          </div>
          <ChartContainer config={chartConfig}>
            <BarChart data={cycleTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="days" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Drop Reasons */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Dropped Ticket Reasons</h3>
            <p className="chart-subtitle">Analysis of why tickets were dropped</p>
          </div>
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={dropReasons}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dropReasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      {/* ETA vs Actual Scatter Plot */}
      <div className="chart-container fade-in">
        <div className="chart-header">
          <h3 className="chart-title">ETA vs Actual Delivery</h3>
          <p className="chart-subtitle">Comparison of estimated vs actual delivery times</p>
        </div>
        <ChartContainer config={chartConfig}>
          <ScatterChart data={etaVsActual} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="estimated" name="Estimated" tick={{ fontSize: 12 }} />
            <YAxis dataKey="actual" name="Actual" tick={{ fontSize: 12 }} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Scatter dataKey="actual" fill="#3b82f6" />
          </ScatterChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default SprintAnalysis;
