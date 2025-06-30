
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RiskData {
  name: string;
  riskCount: number;
}

interface BlockerData {
  name: string;
  value: number;
}

interface InteractiveRiskChartsProps {
  riskByDeveloper: RiskData[];
  blockersBySource: BlockerData[];
  onDeveloperClick: (developer: string) => void;
  onBlockerSourceClick: (source: string) => void;
}

export const InteractiveRiskCharts = ({ 
  riskByDeveloper, 
  blockersBySource, 
  onDeveloperClick, 
  onBlockerSourceClick 
}: InteractiveRiskChartsProps) => {
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  const handleDeveloperBarClick = (data: any) => {
    if (data && data.name) {
      onDeveloperClick(data.name);
    }
  };

  const handleBlockerPieClick = (data: any) => {
    if (data && data.name) {
      onBlockerSourceClick(data.name);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tickets at Risk per Developer */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Tickets at Risk per Developer
            <span className="text-xs text-gray-500 font-normal">Click bars to filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskByDeveloper}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="riskCount" 
                fill="#ef4444" 
                className="cursor-pointer hover:opacity-80"
                onClick={handleDeveloperBarClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Blockers by Source */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Blockers by Source
            <span className="text-xs text-gray-500 font-normal">Click segments to filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={blockersBySource}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                className="cursor-pointer"
                onClick={handleBlockerPieClick}
              >
                {blockersBySource.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
