import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  MessageSquare,
  Copy,
  Download,
  Pin,
  RotateCcw,
  Settings
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// Import new components
import { SmartNudgesPanel } from "@/components/dashboard/SmartNudgesPanel";
import { TodaysPlanPanel } from "@/components/dashboard/TodaysPlanPanel";
import { ClarificationLoopMap } from "@/components/dashboard/ClarificationLoopMap";
import { PersonalGoalTracker } from "@/components/dashboard/PersonalGoalTracker";

// Mock data
const developers = [
  { id: "sarah", name: "Sarah Chen", avatar: "SC" },
  { id: "mike", name: "Mike Rodriguez", avatar: "MR" },
  { id: "nidhi", name: "Nidhi Patel", avatar: "NP" },
  { id: "alex", name: "Alex Kim", avatar: "AK" }
];

const mockTickets = [
  {
    id: "ENG-1234",
    title: "User Authentication System",
    status: "In Dev",
    eta: 5,
    effortRemaining: 3,
    projectedEnd: "2024-01-15",
    daysBlocked: 0,
    isRisk: false,
    rank: 1,
    blockerHistory: [],
    addedToOneOnOne: false
  },
  {
    id: "ENG-1235", 
    title: "Dashboard Performance Optimization",
    status: "Blocked",
    eta: 3,
    effortRemaining: 2,
    projectedEnd: "2024-01-18",
    daysBlocked: 4,
    isRisk: true,
    rank: 2,
    blockerHistory: ["Success team review pending"],
    addedToOneOnOne: true
  },
  {
    id: "ENG-1236",
    title: "Email Notification Service",
    status: "Not Started",
    eta: 2,
    effortRemaining: 2,
    projectedEnd: "2024-01-20", 
    daysBlocked: 0,
    isRisk: false,
    rank: 3,
    blockerHistory: [],
    addedToOneOnOne: false
  }
];

const timeAllocationData = [
  { name: "Development", value: 65, color: "#22c55e" },
  { name: "Blocked", value: 20, color: "#ef4444" },
  { name: "Clarification", value: 15, color: "#f59e0b" }
];

const velocityData = [
  { week: "W1", effortClosed: 8, avgAge: 3.2 },
  { week: "W2", effortClosed: 12, avgAge: 2.8 },
  { week: "W3", effortClosed: 6, avgAge: 4.1 },
  { week: "W4", effortClosed: 10, avgAge: 3.5 }
];

const blockerPatternData = [
  { source: "Success", days: 5, tickets: ["ENG-1235"] },
  { source: "Client", days: 3, tickets: ["ENG-1230"] },
  { source: "Infrastructure", days: 2, tickets: ["ENG-1228"] }
];

const recentActivity = [
  { date: "2024-01-10", event: "Started", ticket: "ENG-1234", type: "start" },
  { date: "2024-01-09", event: "Blocked", ticket: "ENG-1235", type: "blocked" },
  { date: "2024-01-08", event: "Completed", ticket: "ENG-1233", type: "completed" },
  { date: "2024-01-07", event: "Clarification", ticket: "ENG-1235", type: "clarification" }
];

const DeveloperView = () => {
  const [selectedDeveloper, setSelectedDeveloper] = useState("sarah");
  const [tickets, setTickets] = useState(mockTickets);
  const [managerNotes, setManagerNotes] = useState("");
  const [showGoalTracker, setShowGoalTracker] = useState(false);
  const [calendarView, setCalendarView] = useState(false);

  const selectedDevInfo = developers.find(dev => dev.id === selectedDeveloper);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const activeTickets = tickets.filter(t => t.status !== "Completed");
    const totalEffortRemaining = activeTickets.reduce((sum, t) => sum + t.effortRemaining, 0);
    const riskTickets = activeTickets.filter(t => t.isRisk).length;
    const totalBlocked = activeTickets.reduce((sum, t) => sum + t.daysBlocked, 0);
    const completedLast7Days = 2; // Mock value

    return [
      { 
        title: "Active Tickets", 
        value: activeTickets.length, 
        icon: Calendar,
        tooltip: activeTickets.map(t => t.title).join(", ")
      },
      { 
        title: "Effort Remaining", 
        value: `${totalEffortRemaining}d`, 
        icon: Clock,
        tooltip: `Total development days left across all tickets`
      },
      { 
        title: "ETA Risk Tickets", 
        value: riskTickets, 
        icon: AlertTriangle,
        tooltip: tickets.filter(t => t.isRisk).map(t => t.title).join(", ")
      },
      { 
        title: "Days Blocked", 
        value: totalBlocked, 
        icon: RotateCcw,
        tooltip: "Total blocking days in last 30 days"
      },
      { 
        title: "Closed (7d)", 
        value: completedLast7Days, 
        icon: CheckCircle,
        tooltip: "Tickets completed in the last 7 days"
      }
    ];
  }, [tickets]);

  const handleETAUpdate = (ticketId: string, newETA: number) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, eta: newETA } : ticket
    ));
  };

  const handleReassign = (ticketId: string, newDeveloper: string) => {
    // In a real app, this would update the ticket assignment
    console.log(`Reassigning ${ticketId} to ${newDeveloper}`);
  };

  const toggleOneOnOne = (ticketId: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, addedToOneOnOne: !ticket.addedToOneOnOne }
        : ticket
    ));
  };

  const oneOnOneTickets = tickets.filter(t => t.addedToOneOnOne);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Dev": return "default";
      case "Blocked": return "destructive";
      case "Not Started": return "secondary";
      default: return "outline";
    }
  };

  const aiInsights = [
    "Average ETA overrun: +2.5 days on 4/6 tickets",
    "Majority of blocks came from Success team — consider async templates",
    "Started 2 tickets out of rank order — delayed others by 3 days"
  ];

  const handleTicketStart = (ticketId: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: "In Dev" } : ticket
    ));
    console.log(`Started ticket ${ticketId}`);
  };

  const handleTicketDefer = (ticketId: string, comment: string) => {
    console.log(`Deferred ticket ${ticketId}: ${comment}`);
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Developer Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
              {selectedDevInfo?.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Developer Dashboard</h1>
              <p className="text-gray-600">{selectedDevInfo?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedDeveloper} onValueChange={setSelectedDeveloper}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {developers.map(dev => (
                  <SelectItem key={dev.id} value={dev.id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                        {dev.avatar}
                      </div>
                      <span>{dev.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <SmartNudgesPanel 
              developerName={selectedDevInfo?.name || ""} 
              tickets={tickets}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {kpis.map((kpi) => (
            <Tooltip key={kpi.title}>
              <TooltipTrigger asChild>
                <Card className="p-4 cursor-help">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                    </div>
                    <kpi.icon className="h-6 w-6 text-gray-400" />
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{kpi.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Today's Plan */}
        <TodaysPlanPanel 
          tickets={tickets}
          onTicketStart={handleTicketStart}
          onTicketDefer={handleTicketDefer}
        />

        {/* Current Queue Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Queue (Rank Order)</CardTitle>
                <CardDescription>Active tickets assigned to {selectedDevInfo?.name}</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={calendarView}
                    onCheckedChange={setCalendarView}
                  />
                  <span className="text-sm">Calendar View</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Effort Remaining</TableHead>
                  <TableHead>Projected End</TableHead>
                  <TableHead>Days Blocked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets
                  .sort((a, b) => a.rank - b.rank)
                  .map((ticket) => (
                  <TableRow key={ticket.id} className={ticket.isRisk ? "bg-red-50" : ""}>
                    <TableCell>{ticket.rank}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.id}</p>
                        <p className="text-sm text-gray-600 max-w-xs truncate">{ticket.title}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const newETA = prompt("Enter new ETA (days):", ticket.eta.toString());
                          if (newETA && !isNaN(Number(newETA))) {
                            handleETAUpdate(ticket.id, Number(newETA));
                          }
                        }}
                      >
                        {ticket.eta}d ✏️
                      </Button>
                    </TableCell>
                    <TableCell>{ticket.effortRemaining}d</TableCell>
                    <TableCell>{ticket.projectedEnd}</TableCell>
                    <TableCell className={ticket.daysBlocked > 0 ? "text-red-600 font-medium" : ""}>
                      {ticket.daysBlocked}d
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleOneOnOne(ticket.id)}
                          className={ticket.addedToOneOnOne ? "text-blue-600" : ""}
                        >
                          <Pin className="h-4 w-4" />
                        </Button>
                        <Select onValueChange={(value) => handleReassign(ticket.id, value)}>
                          <SelectTrigger className="w-20 h-8">
                            <SelectValue placeholder="→" />
                          </SelectTrigger>
                          <SelectContent>
                            {developers.filter(d => d.id !== selectedDeveloper).map(dev => (
                              <SelectItem key={dev.id} value={dev.id}>{dev.avatar}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Enhanced Layout with New Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ClarificationLoopMap tickets={tickets} />
            <PersonalGoalTracker isVisible={showGoalTracker} />
          </div>

          {/* Middle Column - Charts */}
          <div className="space-y-6">
            {/* Time Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Time Allocation (30 Days)</CardTitle>
                <CardDescription>How time was spent across activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  development: { label: "Development", color: "#22c55e" },
                  blocked: { label: "Blocked", color: "#ef4444" },
                  clarification: { label: "Clarification", color: "#f59e0b" }
                }}>
                  <PieChart>
                    <Pie
                      data={timeAllocationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${Math.round(percent)}%`}
                    >
                      {timeAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Velocity Graph */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Velocity</CardTitle>
                <CardDescription>Effort completed and average ticket age</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  effortClosed: { label: "Effort Closed", color: "#3b82f6" },
                  avgAge: { label: "Avg Age", color: "#f59e0b" }
                }}>
                  <BarChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="effortClosed" fill="#3b82f6" />
                    <Line dataKey="avgAge" stroke="#f59e0b" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Settings Panel */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>View Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Goal Tracker</span>
                  <Switch
                    checked={showGoalTracker}
                    onCheckedChange={setShowGoalTracker}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Calendar View</span>
                  <Switch
                    checked={calendarView}
                    onCheckedChange={setCalendarView}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 1-on-1 Agenda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>1-on-1 Agenda</span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {oneOnOneTickets.length > 0 ? (
                  <div className="space-y-2">
                    {oneOnOneTickets.map(ticket => (
                      <div key={ticket.id} className="p-2 bg-gray-50 rounded">
                        <p className="font-medium text-sm">{ticket.id}</p>
                        <p className="text-xs text-gray-600">{ticket.title}</p>
                        {ticket.daysBlocked > 0 && (
                          <p className="text-xs text-red-600">Blocked {ticket.daysBlocked} days</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No tickets flagged for discussion</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === "completed" ? "bg-green-500" :
                        activity.type === "blocked" ? "bg-red-500" :
                        activity.type === "start" ? "bg-blue-500" : "bg-yellow-500"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.event}</p>
                        <p className="text-xs text-gray-600">{activity.ticket}</p>
                        <p className="text-xs text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Manager Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Manager Reflection Notes</CardTitle>
                <CardDescription>Private coaching notes (auto-saved)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What's holding them back? What patterns did you notice? What's the plan for next sprint?"
                  value={managerNotes}
                  onChange={(e) => setManagerNotes(e.target.value)}
                  className="min-h-32"
                />
                <p className="text-xs text-gray-500 mt-2">Last edited: Just now</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Coaching Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>AI Coaching Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default DeveloperView;
