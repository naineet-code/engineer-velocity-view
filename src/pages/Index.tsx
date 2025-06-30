
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { AlertTriangle, Clock, CheckCircle, User, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { CSVUpload } from "@/components/shared/CSVUpload";
import { useData } from "@/contexts/DataContext";
import { KPICalculator } from "@/utils/kpiCalculations";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { tickets } = useData();
  const navigate = useNavigate();
  
  // Initialize calculator with safety checks
  const calculator = useMemo(() => {
    if (!tickets || tickets.length === 0) return null;
    try {
      return new KPICalculator(tickets);
    } catch (error) {
      console.error('Error initializing KPI calculator:', error);
      return null;
    }
  }, [tickets]);

  // KPI Calculations with comprehensive safety checks
  const kpis = useMemo(() => {
    if (!calculator || !tickets || tickets.length === 0) {
      return {
        blockedTickets: 0,
        avgDaysBlocked: 0,
        etaRiskTickets: 0,
        devsWithRisk: 0,
        ticketsClosedYesterday: 0,
        ticketsClosed7d: 0
      };
    }
    
    try {
      return {
        blockedTickets: calculator.getTotalBlockedTickets(),
        avgDaysBlocked: calculator.getAverageDaysBlocked(),
        etaRiskTickets: calculator.getETARiskTickets().length,
        devsWithRisk: calculator.getDevelopersWithRisk(),
        ticketsClosedYesterday: calculator.getTicketsClosedYesterday(),
        ticketsClosed7d: calculator.getTicketsClosed7Days()
      };
    } catch (error) {
      console.error('Error calculating KPIs:', error);
      return {
        blockedTickets: 0,
        avgDaysBlocked: 0,
        etaRiskTickets: 0,
        devsWithRisk: 0,
        ticketsClosedYesterday: 0,
        ticketsClosed7d: 0
      };
    }
  }, [calculator, tickets]);

  // Chart data with proper error handling
  const chartData = useMemo(() => {
    if (!calculator || !tickets || tickets.length === 0) {
      return {
        statusPie: [],
        timeBar: [],
        riskTrend: []
      };
    }
    
    try {
      const statusDistribution = calculator.getStatusDistribution();
      const timeDistribution = calculator.getTimeDistribution();
      const riskTickets = calculator.getETARiskTickets();
      
      const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
          'Blocked': '#EF4444',
          'In Development': '#3B82F6', 
          'Review': '#FACC15',
          'Closed': '#10B981',
          'Clarification': '#EF4444',
          'Business QC': '#F59E0B',
          'Release Plan': '#8B5CF6'
        };
        return colors[status] || '#6B7280';
      };
      
      return {
        statusPie: Object.entries(statusDistribution).map(([status, count]) => ({
          name: status,
          value: count,
          color: getStatusColor(status)
        })),
        timeBar: Object.entries(timeDistribution).map(([status, days]) => ({
          status,
          days: Math.round(days * 10) / 10
        })),
        riskTrend: riskTickets.slice(0, 10).map((ticket, index) => ({
          name: ticket.ticket_id,
          risk: 50 + Math.random() * 50,
          effort: ticket.effort_points
        }))
      };
    } catch (error) {
      console.error('Error generating chart data:', error);
      return {
        statusPie: [],
        timeBar: [],
        riskTrend: []
      };
    }
  }, [calculator, tickets]);

  const chartConfig: ChartConfig = {
    blocked: { label: "Blocked", color: "#EF4444" },
    development: { label: "Development", color: "#3B82F6" },
    review: { label: "Review", color: "#FACC15" },
    closed: { label: "Closed", color: "#10B981" }
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-base text-gray-600 mb-6">
            Upload your CSV file to start tracking your team's progress and identify blockers.
          </p>
          <CSVUpload />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Team Pulse</h1>
        <p className="text-base text-gray-600 mt-2">
          Real-time overview of your team's progress, blockers, and key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Blocked Tickets</p>
                <p className="text-3xl font-bold text-red-600">{kpis.blockedTickets}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg Days Blocked</p>
                <p className="text-3xl font-bold text-yellow-600">{kpis.avgDaysBlocked}d</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">ETA Risk Tickets</p>
                <p className="text-3xl font-bold text-red-600">{kpis.etaRiskTickets}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Devs with Risk</p>
                <p className="text-3xl font-bold text-orange-600">{kpis.devsWithRisk}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <User className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Closed Yesterday</p>
                <p className="text-3xl font-bold text-green-600">{kpis.ticketsClosedYesterday}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Closed (7d)</p>
                <p className="text-3xl font-bold text-green-600">{kpis.ticketsClosed7d}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {chartData.statusPie.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <PieChart>
                  <Pie
                    data={chartData.statusPie}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.statusPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                No data to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Time Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {chartData.timeBar.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData.timeBar}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="days" fill="#3B82F6" />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                No data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            ETA Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          {chartData.riskTrend.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <LineChart data={chartData.riskTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No risk data to display
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button 
          onClick={() => navigate('/sprint-analysis')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          View Sprint Analysis
        </Button>
        <Button 
          onClick={() => navigate('/sprint-planning')}
          variant="outline"
          className="border-gray-200 hover:bg-blue-50"
        >
          Plan Next Sprint
        </Button>
      </div>
    </div>
  );
};

export default Index;
