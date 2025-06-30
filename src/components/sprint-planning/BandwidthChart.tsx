
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Developer } from '@/pages/SprintCreation';

interface BandwidthChartProps {
  developers: Developer[];
}

export const BandwidthChart: React.FC<BandwidthChartProps> = ({ developers }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bandwidth Utilization</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {developers.map((developer) => {
          const assignedEffort = developer.assignedTickets.reduce((sum, ticket) => sum + ticket.effort, 0);
          const utilization = (assignedEffort / developer.availableEffort) * 100;
          const isOverloaded = assignedEffort > developer.availableEffort;
          
          return (
            <div key={developer.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{developer.name}</span>
                <span className={`text-sm ${isOverloaded ? 'text-red-600' : 'text-gray-600'}`}>
                  {assignedEffort}d / {developer.availableEffort}d ({Math.round(utilization)}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isOverloaded 
                      ? 'bg-red-500' 
                      : utilization > 80 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min(utilization, 100)}%` 
                  }}
                />
                {isOverloaded && (
                  <div 
                    className="h-3 bg-red-500 opacity-50 rounded-full -mt-3"
                    style={{ 
                      width: `${Math.min((assignedEffort / developer.availableEffort) * 100, 200)}%` 
                    }}
                  />
                )}
              </div>
              
              {isOverloaded && (
                <p className="text-xs text-red-600">
                  Overloaded by {assignedEffort - developer.availableEffort} days
                </p>
              )}
            </div>
          );
        })}
        
        {developers.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No developers available
          </p>
        )}
      </CardContent>
    </Card>
  );
};
