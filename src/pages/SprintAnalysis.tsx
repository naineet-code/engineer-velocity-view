import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, AlertTriangle, Users, MessageSquare, Brain } from "lucide-react";
import AIRecommendationsPanel from "@/components/dashboard/AIRecommendationsPanel";

interface Ticket {
  id: string;
  title: string;
  dev: string;
  effortDays: number;
  duration: number;
  timeBlocked: number;
  etaMissed: number;
  status: string;
  clarifications: number;
  dropReason: string;
}

interface KPICard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<any>;
}

const mockTicketData: Ticket[] = [
  {
    id: "ENG-123",
    title: "Implement user authentication",
    dev: "Sarah",
    effortDays: 5,
    duration: 7,
    timeBlocked: 1,
    etaMissed: 2,
    status: "Completed",
    clarifications: 1,
    dropReason: ""
  },
  {
    id: "ENG-124",
    title: "Optimize database queries",
    dev: "Mike",
    effortDays: 3,
    duration: 5,
    timeBlocked: 0,
    etaMissed: 0,
    status: "In Progress",
    clarifications: 3,
    dropReason: ""
  },
  {
    id: "ENG-125",
    title: "Refactor payment service",
    dev: "Nidhi",
    effortDays: 8,
    duration: 10,
    timeBlocked: 2,
    etaMissed: 3,
    status: "Blocked",
    clarifications: 5,
    dropReason: ""
  },
  {
    id: "ENG-126",
    title: "Implement logging",
    dev: "Alex",
    effortDays: 2,
    duration: 4,
    timeBlocked: 0,
    etaMissed: 0,
    status: "Code Review",
    clarifications: 0,
    dropReason: ""
  },
  {
    id: "ENG-127",
    title: "Design new API endpoints",
    dev: "Sarah",
    effortDays: 4,
    duration: 6,
    timeBlocked: 1,
    etaMissed: 1,
    status: "In Progress",
    clarifications: 2,
    dropReason: ""
  },
  {
    id: "ENG-128",
    title: "Fix UI bugs",
    dev: "Mike",
    effortDays: 1,
    duration: 2,
    timeBlocked: 0,
    etaMissed: 0,
    status: "Completed",
    clarifications: 0,
    dropReason: ""
  },
  {
    id: "ENG-129",
    title: "Update documentation",
    dev: "Nidhi",
    effortDays: 2,
    duration: 3,
    timeBlocked: 0,
    etaMissed: 1,
    status: "Not Started",
    clarifications: 1,
    dropReason: ""
  },
  {
    id: "ENG-130",
    title: "Implement search functionality",
    dev: "Alex",
    effortDays: 6,
    duration: 8,
    timeBlocked: 2,
    etaMissed: 4,
    status: "Dropped",
    clarifications: 4,
    dropReason: "Scope change"
  }
];

const kpiCards: KPICard[] = [
  { title: "Tickets Completed", value: 15, change: "+3%", icon: TrendingUp },
  { title: "Active Tickets", value: 8, icon: AlertTriangle },
  { title: "Avg. ETA Missed", value: "2.1d", change: "-0.5d", icon: Users },
  { title: "Clarification Loops", value: 23, change: "+12%", icon: MessageSquare },
  { title: "Blocked Time", value: "15d", change: "+5d", icon: Brain },
  { title: "Sprint Velocity", value: "42 SP", change: "+8 SP", icon: TrendingUp }
];

const sprintData = [
  { sprint: "S1", completed: 10, dropped: 2, inProgress: 5, blocked: 1 },
  { sprint: "S2", completed: 12, dropped: 1, inProgress: 4, blocked: 2 },
  { sprint: "S3", completed: 15, dropped: 0, inProgress: 3, blocked: 1 }
];

const blockerData = [
  { name: "Success", value: 30, color: "#ef4444" },
  { name: "Client", value: 25, color: "#f97316" },
  { name: "Infra", value: 20, color: "#eab308" },
  { name: "QA", value: 15, color: "#22c55e" },
  { name: "Other", value: 10, color: "#6b7280" }
];

const stageTimeData = [
  { stage: "Clarification", days: 1.5 },
  { stage: "Development", days: 4.2 },
  { stage: "Tech QC", days: 0.8 },
  { stage: "Business QC", days: 0.5 },
  { stage: "Blocked", days: 2.1 }
];

const etaData = [
  { eta: 5, actual: 6, status: "missed" },
  { eta: 3, actual: 3, status: "onTrack" },
  { eta: 8, actual: 10, status: "missed" },
  { eta: 2, actual: 2, status: "onTrack" },
  { eta: 6, actual: 4, status: "onTrack" },
  { eta: 4, actual: 7, status: "missed" },
  { eta: 7, actual: 7, status: "onTrack" },
  { eta: 1, actual: 5, status: "dropped" }
];

const chartConfig = {
  completed: { label: "Completed", color: "#22c55e" },
  dropped: { label: "Dropped", color: "#ef4444" },
  inProgress: { label: "In Progress", color: "#3b82f6" },
  blocked: { label: "Blocked", color: "#f59e0b" }
};

const RetrospectiveExport = ({ ticketData, kpis }: { ticketData: Ticket[], kpis: KPICard[] }) => {
  const handleExport = () => {
    const data = {
      kpis: kpis.map(kpi => ({ title: kpi.title, value: kpi.value })),
      tickets: ticketData.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        dev: ticket.dev,
        status: ticket.status,
        effortDays: ticket.effortDays,
        duration: ticket.duration,
        timeBlocked: ticket.timeBlocked,
        etaMissed: ticket.etaMissed,
        clarifications: ticket.clarifications,
        dropReason: ticket.dropReason
      }))
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sprint_retrospective.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retrospective Export</CardTitle>
        <CardDescription>Download sprint data for offline analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport}>Export as JSON</Button>
      </CardContent>
    </Card>
  );
};

const SprintComparison = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sprint Comparison</CardTitle>
        <CardDescription>Compare key metrics across recent sprints</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 italic">Coming soon: Interactive sprint comparison charts</p>
      </CardContent>
    </Card>
  );
};

const SprintAnalysis = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
                {kpi.change && (
                  <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                    {kpi.change}
                  </p>
                )}
              </div>
              <kpi.icon className="h-8 w-8 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>

      {/* AI Recommendations Panel */}
      <AIRecommendationsPanel ticketData={mockTicketData} sprintKPIs={kpiCards} />

      {/* Sprint Comparison */}
      <SprintComparison />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Completion</CardTitle>
            <CardDescription>Tickets by status over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={sprintData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" />
                <Bar dataKey="dropped" stackId="a" fill="var(--color-dropped)" />
                <Bar dataKey="inProgress" stackId="a" fill="var(--color-in-progress)" />
                <Bar dataKey="blocked" stackId="a" fill="var(--color-blocked)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Blocker Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Blocker Sources</CardTitle>
            <CardDescription>Distribution of blocking reasons</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              success: { label: "Success", color: "#ef4444" },
              client: { label: "Client", color: "#f97316" },
              infra: { label: "Infrastructure", color: "#eab308" },
              qa: { label: "QA", color: "#22c55e" }
            }}>
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Pie
                  data={blockerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {blockerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cycle Time Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Stage Time Breakdown</CardTitle>
            <CardDescription>Average days per development stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              clarification: { label: "Clarification", color: "#8b5cf6" },
              development: { label: "Development", color: "#3b82f6" },
              techQC: { label: "Tech QC", color: "#10b981" },
              businessQC: { label: "Business QC", color: "#f59e0b" },
              blocked: { label: "Blocked", color: "#ef4444" }
            }}>
              <BarChart data={stageTimeData} layout="horizontal" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="days" fill="#3b82f6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* ETA vs Actual Scatter Plot */}
        <Card>
          <CardHeader>
            <CardTitle>ETA vs Actual Delivery</CardTitle>
            <CardDescription>Estimation accuracy per ticket</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              onTrack: { label: "On Track", color: "#22c55e" },
              missed: { label: "Missed ETA", color: "#ef4444" },
              dropped: { label: "Dropped", color: "#6b7280" }
            }}>
              <ScatterChart data={etaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="eta" name="ETA (days)" />
                <YAxis dataKey="actual" name="Actual (days)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Scatter name="Tickets" data={etaData} fill="#3b82f6" />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Retrospective Export */}
      <RetrospectiveExport ticketData={mockTicketData} kpis={kpiCards} />

      {/* Sprint Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sprint Ticket Details</CardTitle>
          <CardDescription>Complete ticket breakdown for retrospective analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Effort</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Time Blocked</TableHead>
                <TableHead>ETA Missed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clarifications</TableHead>
                <TableHead>Drop Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTicketData.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono">{ticket.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
                  <TableCell>{ticket.dev}</TableCell>
                  <TableCell>{ticket.effortDays}d</TableCell>
                  <TableCell>{ticket.duration}d</TableCell>
                  <TableCell className="text-red-600">{ticket.timeBlocked}d</TableCell>
                  <TableCell className={ticket.etaMissed > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                    {ticket.etaMissed > 0 ? `+${ticket.etaMissed}d` : "On time"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ticket.status === "Completed" ? "default" : ticket.status === "Dropped" ? "destructive" : "secondary"}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.clarifications}</TableCell>
                  <TableCell className="text-sm text-gray-600">{ticket.dropReason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SprintAnalysis;
