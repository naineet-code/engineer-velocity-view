import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Download,
  FileText,
  MessageSquare
} from "lucide-react";
import { AIRecommendationsPanel } from "@/components/dashboard/AIRecommendationsPanel";
import { SprintComparison } from "@/components/dashboard/SprintComparison";
import { RetrospectiveExport } from "@/components/dashboard/RetrospectiveExport";

// Mock data
const mockSprintData = {
  sprintName: "Sprint 12",
  startDate: "2024-01-01",
  endDate: "2024-01-15",
  teamVelocity: 15,
  completedTickets: 12,
  totalTickets: 15,
  avgTicketAge: 3.5,
  blockerSources: {
    "Success Team": 3,
    "Client": 1,
    "Engineering": 2
  },
  etaAnalysis: {
    missed: 2,
    total: 15
  },
  developerPerformance: [
    { name: "Sarah", completed: 4, etaOverruns: 1 },
    { name: "Mike", completed: 3, etaOverruns: 0 },
    { name: "Nidhi", completed: 5, etaOverruns: 2 }
  ],
  riskTickets: [
    { id: "ENG-1235", title: "Dashboard Performance Optimization", daysOver: 2 },
    { id: "ENG-1238", title: "API Integration", daysOver: 1 }
  ],
  blockerTrends: [
    { source: "Success Team", daysBlocked: 5 },
    { source: "Client", daysBlocked: 2 }
  ],
  actionItems: [
    { description: "Improve estimation accuracy", owner: "Team", status: "Open" },
    { description: "Address Success Team blocking issues", owner: "Engineering Lead", status: "In Progress" }
  ]
};

const sprintOptions = [
  { value: "sprint-12", label: "Sprint 12 (Current)" },
  { value: "sprint-11", label: "Sprint 11" },
  { value: "sprint-10", label: "Sprint 10" }
];

const developerOptions = [
  { value: "all", label: "All Developers" },
  { value: "sarah", label: "Sarah" },
  { value: "mike", label: "Mike" },
  { value: "nidhi", label: "Nidhi" }
];

const burndownData = [
  { day: "Day 1", ideal: 15, actual: 15 },
  { day: "Day 3", ideal: 13, actual: 14 },
  { day: "Day 5", ideal: 10, actual: 11 },
  { day: "Day 7", ideal: 8, actual: 9 },
  { day: "Day 9", ideal: 6, actual: 5 },
  { day: "Day 11", ideal: 4, actual: 4 },
  { day: "Day 13", ideal: 2, actual: 3 },
  { day: "Day 15", ideal: 0, actual: 0 }
];

const blockerData = [
  { source: "Success Team", tickets: 3, daysBlocked: 5 },
  { source: "Client", tickets: 1, daysBlocked: 2 },
  { source: "Engineering", tickets: 2, daysBlocked: 3 }
];

const actionItemsData = [
  { description: "Improve estimation accuracy", owner: "Team", status: "Open" },
  { description: "Address Success Team blocking issues", owner: "Engineering Lead", status: "In Progress" }
];

const SprintAnalysis = () => {
  const [selectedSprint, setSelectedSprint] = useState("sprint-12");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState("all");

  const handleSprintChange = (sprintValue: string) => {
    setSelectedSprint(sprintValue);
  };

  const handleDeveloperChange = (developerValue: string) => {
    setSelectedDeveloper(developerValue);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Sprint Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sprint Analysis</h1>
          <p className="text-gray-600">Retrospective insights for continuous improvement</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedSprint} onValueChange={setSelectedSprint}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sprint-12">Sprint 12 (Current)</SelectItem>
              <SelectItem value="sprint-11">Sprint 11</SelectItem>
              <SelectItem value="sprint-10">Sprint 10</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant={comparisonMode ? "default" : "outline"}
            onClick={() => setComparisonMode(!comparisonMode)}
          >
            Compare Sprints
          </Button>
        </div>
      </div>

      {/* AI Recommendations */}
      <AIRecommendationsPanel sprintData={mockSprintData} />

      {/* Sprint Comparison */}
      {comparisonMode && <SprintComparison />}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Team Velocity</p>
                <p className="text-2xl font-bold text-blue-600">{mockSprintData.teamVelocity}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <TrendingUp size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed Tickets</p>
                <p className="text-2xl font-bold text-green-600">{mockSprintData.completedTickets} / {mockSprintData.totalTickets}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <CheckCircle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Ticket Age</p>
                <p className="text-2xl font-bold text-orange-600">{mockSprintData.avgTicketAge}d</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                <Clock size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">ETA Miss Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {((mockSprintData.etaAnalysis.missed / mockSprintData.etaAnalysis.total) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <AlertTriangle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burndown Chart */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Sprint Burndown</CardTitle>
            <CardDescription>Ideal vs Actual progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="ideal" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Blocker Sources Chart */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Blocker Sources</CardTitle>
            <CardDescription>Distribution of blocking issues</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={blockerData}
                    dataKey="tickets"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {blockerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Developer Performance Table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Developer Performance</CardTitle>
          <CardDescription>Individual contributions and ETA adherence</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDeveloper} onValueChange={handleDeveloperChange}>
            <SelectTrigger className="w-48 mb-4">
              <SelectValue placeholder="Select Developer" />
            </SelectTrigger>
            <SelectContent>
              {developerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Developer</TableHead>
                <TableHead>Completed Tickets</TableHead>
                <TableHead>ETA Overruns</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSprintData.developerPerformance.map((dev) => (
                <TableRow key={dev.name}>
                  <TableCell>{dev.name}</TableCell>
                  <TableCell>{dev.completed}</TableCell>
                  <TableCell>{dev.etaOverruns}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Risk Tickets */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Risk Tickets</CardTitle>
          <CardDescription>Tickets at risk of missing ETA</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Days Over ETA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSprintData.riskTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell className="text-red-500">{ticket.daysOver}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Blocker Trends */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Blocker Trends</CardTitle>
          <CardDescription>Recurring blocking issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blocker Source</TableHead>
                <TableHead>Tickets Blocked</TableHead>
                <TableHead>Total Days Blocked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockerData.map((blocker) => (
                <TableRow key={blocker.source}>
                  <TableCell>{blocker.source}</TableCell>
                  <TableCell>{blocker.tickets}</TableCell>
                  <TableCell>{blocker.daysBlocked}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Action Items</CardTitle>
          <CardDescription>Sprint retrospective action items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actionItemsData.map((item) => (
                <TableRow key={item.description}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Retrospective Export */}
      <RetrospectiveExport sprintData={mockSprintData} />
    </div>
  );
};

export default SprintAnalysis;
