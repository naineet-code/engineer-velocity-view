import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from "recharts";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Download
} from "lucide-react";
import AIRecommendationsPanel from "@/components/dashboard/AIRecommendationsPanel";
import SprintComparison from "@/components/dashboard/SprintComparison";
import RetrospectiveExport from "@/components/dashboard/RetrospectiveExport";

// Mock data for demonstration
const sprintKPIs = {
  completed: 18,
  dropped: 3,
  timeBlocked: 23,
  etaMisses: 4,
  clarificationLoops: 6,
  avgDevTimeVsETA: 1.2
};

const completionData = [
  { sprint: "Sprint 1", completed: 15, dropped: 2, inProgress: 3, blocked: 1 },
  { sprint: "Sprint 2", completed: 18, dropped: 3, inProgress: 2, blocked: 2 },
  { sprint: "Sprint 3", completed: 14, dropped: 4, inProgress: 4, blocked: 3 },
];

const blockerData = [
  { name: "Client", value: 35, color: "#ff6b6b" },
  { name: "Success", value: 25, color: "#4ecdc4" },
  { name: "Infra", value: 20, color: "#45b7d1" },
  { name: "Internal", value: 20, color: "#96ceb4" },
];

const stageTimeData = [
  { stage: "Clarification", days: 2.3 },
  { stage: "In Dev", days: 5.8 },
  { stage: "Tech QC", days: 1.2 },
  { stage: "Business QC", days: 2.1 },
  { stage: "Release Plan", days: 0.8 },
  { stage: "Blocked", days: 1.9 },
];

const ticketData = [
  {
    id: "PROJ-123",
    title: "User authentication flow",
    dev: "Alice",
    effort: 8,
    duration: 12,
    blocked: 2,
    etaMissed: 4,
    status: "Completed",
    clarifications: 1,
  },
  {
    id: "PROJ-124",
    title: "Payment integration",
    dev: "Bob",
    effort: 5,
    duration: 8,
    blocked: 1,
    etaMissed: 3,
    status: "Completed",
    clarifications: 2,
  },
  {
    id: "PROJ-125",
    title: "Dashboard redesign",
    dev: "Charlie",
    effort: 13,
    duration: 0,
    blocked: 5,
    etaMissed: 0,
    status: "Dropped",
    clarifications: 3,
  },
];

const SprintAnalysis = () => {
  const [selectedSprint, setSelectedSprint] = useState("Sprint 2");
  const [selectedDeveloper, setSelectedDeveloper] = useState("all");

  // Enhanced insights with more actionable recommendations
  const insights = [
    "Clarification added avg 3.2 days per ticket this sprint",
    "60% of dropped tickets had insufficient acceptance criteria", 
    "Review time increased by 40% vs previous sprint",
    "Client blockers accounted for 35% of all delays",
    "3 tickets blocked >5 days need escalation process",
    "Dev workload imbalance: Charlie had 4/5 ETA misses"
  ];

  // Enhanced ticket data with drop reasons
  const enhancedTicketData = ticketData.map(ticket => ({
    ...ticket,
    dropReason: ticket.status === "Dropped" ? 
      (ticket.clarifications > 2 ? "No AC" : "Client Pullback") : null
  }));

  // Cycle time data for new chart
  const cycleTimeData = [
    { stage: "Clarification", currentSprint: 2.3, previousSprint: 1.8 },
    { stage: "In Dev", currentSprint: 5.8, previousSprint: 4.2 },
    { stage: "Tech QC", currentSprint: 1.2, previousSprint: 1.5 },
    { stage: "Business QC", currentSprint: 2.1, previousSprint: 1.9 },
    { stage: "Release Plan", currentSprint: 0.8, previousSprint: 0.6 },
    { stage: "Blocked", currentSprint: 1.9, previousSprint: 1.2 },
  ];

  // ETA vs Actual scatter plot data
  const etaVsActualData = enhancedTicketData.map(ticket => ({
    eta: ticket.effort,
    actual: ticket.duration || ticket.effort * 1.2,
    status: ticket.status,
    title: ticket.title,
    id: ticket.id
  }));

  // Drop reasons pie chart data
  const dropReasons = enhancedTicketData
    .filter(t => t.status === "Dropped")
    .reduce((acc, ticket) => {
      const reason = ticket.dropReason || "Unknown";
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const dropReasonsData = Object.entries(dropReasons).map(([reason, count]) => ({
    name: reason,
    value: count,
    color: reason === "No AC" ? "#ef4444" : reason === "Client Pullback" ? "#f59e0b" : "#6b7280"
  }));

  const sprints = ["Sprint 1", "Sprint 2", "Sprint 3"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint Analysis</h1>
            <p className="text-gray-600">Retrospective insights for continuous improvement</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedSprint} onValueChange={setSelectedSprint}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sprint 1">Sprint 1</SelectItem>
                <SelectItem value="Sprint 2">Sprint 2</SelectItem>
                <SelectItem value="Sprint 3">Sprint 3</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{sprintKPIs.completed}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                Dropped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{sprintKPIs.dropped}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                % Time Blocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{sprintKPIs.timeBlocked}%</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                ETA Misses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{sprintKPIs.etaMisses}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <RefreshCw className="h-4 w-4 text-blue-500 mr-2" />
                Clarification Loops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{sprintKPIs.clarificationLoops}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
                Dev Time vs ETA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{sprintKPIs.avgDevTimeVsETA}x</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations Panel */}
        <AIRecommendationsPanel 
          ticketData={enhancedTicketData} 
          sprintKPIs={sprintKPIs}
        />

        {/* Sprint Comparison */}
        <SprintComparison 
          sprints={sprints}
          currentSprint={selectedSprint}
        />

        {/* Enhanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sprint Completion Trends</CardTitle>
              <CardDescription>Ticket outcomes across recent sprints</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                  <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
                  <Bar dataKey="dropped" stackId="a" fill="#ef4444" name="Dropped" />
                  <Bar dataKey="blocked" stackId="a" fill="#6b7280" name="Blocked" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Blocker Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Blockers by Source</CardTitle>
              <CardDescription>Root cause analysis of blocking issues</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={blockerData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {blockerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* New: Cycle Time Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cycle Time by Stage</CardTitle>
              <CardDescription>Average days per development stage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cycleTimeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="currentSprint" fill="#3b82f6" name="Current Sprint" />
                  <Bar dataKey="previousSprint" fill="#94a3b8" name="Previous Sprint" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* New: Drop Reasons Analysis */}
          {dropReasonsData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Why Tickets Were Dropped</CardTitle>
                <CardDescription>Root cause analysis of dropped work</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dropReasonsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {dropReasonsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* New: ETA vs Actual Scatter Plot */}
          <Card>
            <CardHeader>
              <CardTitle>ETA vs Actual Delivery</CardTitle>
              <CardDescription>Estimation accuracy analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={etaVsActualData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="eta" name="ETA" />
                  <YAxis dataKey="actual" name="Actual" />
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label, payload) => 
                      payload && payload[0] ? `${payload[0].payload.title}` : ''
                    }
                  />
                  <Scatter 
                    dataKey="actual" 
                    fill="#3b82f6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          )}

          {/* Enhanced AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Sprint Insights</CardTitle>
              <CardDescription>AI-generated retrospective observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sprint Ticket Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Ticket Details</CardTitle>
            <CardDescription>Comprehensive view of all tickets in {selectedSprint}</CardDescription>
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
                {enhancedTicketData.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.dev}</TableCell>
                    <TableCell>{ticket.effort}d</TableCell>
                    <TableCell>{ticket.duration}d</TableCell>
                    <TableCell>{ticket.blocked}d</TableCell>
                    <TableCell>
                      {ticket.etaMissed > 0 ? (
                        <span className="text-red-600">+{ticket.etaMissed}d</span>
                      ) : (
                        <span className="text-green-600">On time</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={ticket.status === "Completed" ? "default" : "destructive"}
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.clarifications}</TableCell>
                    <TableCell>
                      {ticket.dropReason && (
                        <Badge variant="outline" className="text-xs">
                          {ticket.dropReason}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Retrospective Export */}
        <RetrospectiveExport 
          sprintName={selectedSprint}
          sprintKPIs={sprintKPIs}
          ticketData={enhancedTicketData}
          insights={insights}
        />
      </div>
    </div>
  );
};

export default SprintAnalysis;
