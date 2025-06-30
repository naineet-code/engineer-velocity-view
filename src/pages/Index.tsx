
import { KPICards } from "@/components/dashboard/KPICards";
import { DeveloperGantt } from "@/components/dashboard/DeveloperGantt";
import { RiskCharts } from "@/components/dashboard/RiskCharts";
import { ActiveTicketsTable } from "@/components/dashboard/ActiveTicketsTable";
import { InsightStrip } from "@/components/dashboard/InsightStrip";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Pulse Dashboard</h1>
          <p className="text-gray-600">Daily Engineering Stand-up • Live Status</p>
        </div>

        {/* KPI Cards */}
        <KPICards />

        {/* Developer Gantt Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Developer Workload Gantt</h2>
          <DeveloperGantt />
        </div>

        {/* Risk Analysis Charts */}
        <RiskCharts />

        {/* Active Tickets Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Risk & Blocked Tickets</h2>
          <ActiveTicketsTable />
        </div>

        {/* AI Insights */}
        <InsightStrip />
      </div>
    </div>
  );
};

export default Index;
