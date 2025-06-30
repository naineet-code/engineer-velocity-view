
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Developer } from '@/pages/SprintCreation';

interface BandwidthChartProps {
  developers: Developer[];
}

export const BandwidthChart: React.FC<BandwidthChartProps> = ({ developers }) => {
  const chartData = developers.map(dev => {
    const assignedEffort = dev.assignedTickets.reduce((sum, ticket) => sum + ticket.effort, 0);
    const utilization = Math.round((assignedEffort / dev.availableEffort) * 100);
    
    return {
      name: dev.name.split(' ')[0], // First name only for chart
      assigned: assignedEffort,
      available: dev.availableEffort,
      utilization
    };
  });

  const chartConfig: ChartConfig = {
    assigned: { label: "Assigned", color: "#3B82F6" },
    available: { label: "Available", color: "#E5E7EB" }
  };

  return (
    <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Bandwidth Chart</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${value}d`, 
                name === 'assigned' ? 'Assigned' : 'Available'
              ]}
            />
            <Bar dataKey="available" fill="#E5E7EB" />
            <Bar dataKey="assigned" fill="#3B82F6" />
          </BarChart>
        </ChartContainer>
        
        <div className="mt-4 space-y-2">
          {chartData.map((dev, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{dev.name}</span>
              <span className={`font-medium ${
                dev.utilization > 100 ? 'text-red-600' :
                dev.utilization > 80 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {dev.utilization}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
