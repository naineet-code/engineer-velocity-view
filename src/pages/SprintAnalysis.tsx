
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { Download, TrendingUp, AlertTriangle, Clock, Target, Users, Calendar } from "lucide-react";
import { AIRecommendationsPanel } from "@/components/dashboard/AIRecommendationsPanel";
import { CSVUpload } from "@/components/shared/CSVUpload";
import { useData } from "@/contexts/DataContext";
import { KPICalculator } from "@/utils/kpiCalculations";
import { useNavigate } from "react-router-dom";

const SprintAnalysis = () => {
  const { tickets } = useData();
  const navigate = useNavigate();
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
        dropped: 0, // Would need sprint metadata to calculate properly
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
    { name: "No AC", value: 40, color: "#ff6b6b" },
    { name: "Client Pullback", value: 30, color: "#4ecdc4" },
    { name: "Deprioritized", value: 20, color: "#45b7d1" },
    { name: "Blocked Too Long", value: 10, color: "#96ceb4" }
  ];

  // ETA vs Actual scatter plot data
  const etaVsActual = useMemo(() => {
    const riskTickets = calculator.getETARiskTickets();
    return tickets.slice(0, 10).map(ticket => {
      const isRisk = riskTickets.some(rt => rt.ticket_id === ticket.ticket_id);
      return {
        estimated: ticket.effort_points,
        actual: ticket.effort_points + (isRisk ? 2 : 0), // Mock actual vs estimated
        name: ticket.ticket_id,
        status: ticket.status === 'Closed' ? 'completed' : isRisk ? 'missed' : 'ontrack'
      };
    });
  }, [tickets, calculator]);

  // Cycle time breakdown
  const cycleTimeData = useMemo(() => {
    const distribution = calculator.getTimeDistribution();
    return [
      { stage: "Development", days: Math.round(distribution.Development * 10) / 10 },
      { stage: "Blocked", days: Math.round(distribution.Blocked * 10) / 10 },
      { stage: "Review", days: Math.round(distribution.Review * 10) / 10 },
      { stage: "Release", days: Math.round(distribution.Release * 10) / 10 }
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
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Sprint Analysis</h1>
          <CSVUpload />
          <p className="text-gray-600 mt-4">Upload your CSV file to see sprint analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sprint Analysis</h1>
        <div className="flex gap-2">
          <Button
            variant={compareMode ? "default" : "outline"}
            onClick={() => setCompareMode(!compareMode)}
          >
            Compare Sprints
          </Button>
          <Button onClick={generateRetrospectiveReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <AIRecommendationsPanel sprintData={sprintData} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sprintData.kpis.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Dropped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{sprintData.kpis.dropped}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{sprintData.kpis.blocked}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              ETA Missed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{sprintData.kpis.etaMissed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              Avg Cycle Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{sprintData.kpis.avgCycleTime}d</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cycle Time Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cycle Time Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={cycleTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="days" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Drop Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Dropped Ticket Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={dropReasons}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {dropReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ETA vs Actual Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>ETA vs Actual Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ScatterChart data={etaVsActual} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis dataKey="estimated" name="Estimated" />
              <YAxis dataKey="actual" name="Actual" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="actual" fill="#8884d8" />
            </ScatterChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SprintAnalysis;
