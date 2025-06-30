
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { Download, TrendingUp, AlertTriangle, Clock, Target, Users, Calendar } from "lucide-react";
import { AIRecommendationsPanel } from "@/components/dashboard/AIRecommendationsPanel";

const SprintAnalysis = () => {
  const [compareMode, setCompareMode] = useState(false);

  // Mock data
  const sprintData = {
    kpis: {
      completed: 12,
      dropped: 3,
      blocked: 2,
      etaMissed: 4,
      avgCycleTime: 5.2
    },
    etaAnalysis: {
      missed: 4,
      total: 15
    },
    blockedTimeAnalysis: {
      totalBlockedDays: 12,
      ticketsBlocked: 3
    },
    highEffortTickets: [
      { id: "TICKET-123", effort: 8 },
      { id: "TICKET-456", effort: 12 }
    ]
  };

  const dropReasons = [
    { name: "No AC", value: 40, color: "#ff6b6b" },
    { name: "Client Pullback", value: 30, color: "#4ecdc4" },
    { name: "Deprioritized", value: 20, color: "#45b7d1" },
    { name: "Blocked Too Long", value: 10, color: "#96ceb4" }
  ];

  const etaVsActual = [
    { estimated: 3, actual: 4, name: "TICKET-001", status: "completed" },
    { estimated: 5, actual: 8, name: "TICKET-002", status: "missed" },
    { estimated: 2, actual: 2, name: "TICKET-003", status: "ontrack" },
    { estimated: 4, actual: 3, name: "TICKET-004", status: "completed" },
    { estimated: 6, actual: 10, name: "TICKET-005", status: "missed" }
  ];

  const cycleTimeData = [
    { stage: "Clarification", days: 1.5 },
    { stage: "Dev", days: 3.2 },
    { stage: "Tech QC", days: 0.8 },
    { stage: "Business QC", days: 1.2 },
    { stage: "Blocked", days: 0.5 }
  ];

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
