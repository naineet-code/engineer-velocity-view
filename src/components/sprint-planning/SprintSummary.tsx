
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Rocket, 
  RefreshCw, 
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SprintSummaryProps {
  sprintStats: {
    totalTickets: number;
    totalEffort: number;
    overloadedDevs: number;
    riskyTickets: number;
  };
  sprintDuration: number;
  onRecalculate: () => void;
  onSaveDraft: () => void;
  onFinalize: () => void;
  onExport: () => void;
  disabled: boolean;
}

export const SprintSummary: React.FC<SprintSummaryProps> = ({
  sprintStats,
  sprintDuration,
  onRecalculate,
  onSaveDraft,
  onFinalize,
  onExport,
  disabled
}) => {
  const canFinalize = sprintStats.overloadedDevs === 0 && sprintStats.totalTickets > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sprint Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Tickets</span>
            <Badge variant="secondary">{sprintStats.totalTickets}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Effort</span>
            <Badge variant="secondary">{sprintStats.totalEffort} days</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sprint Duration</span>
            <Badge variant="secondary">{sprintDuration} days</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Overloaded Devs</span>
            <Badge variant={sprintStats.overloadedDevs > 0 ? "destructive" : "secondary"}>
              {sprintStats.overloadedDevs}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">ETA Risks</span>
            <Badge variant={sprintStats.riskyTickets > 0 ? "destructive" : "secondary"}>
              {sprintStats.riskyTickets}
            </Badge>
          </div>
        </div>

        {/* Alerts */}
        {sprintStats.overloadedDevs > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">
              {sprintStats.overloadedDevs} developer{sprintStats.overloadedDevs > 1 ? 's' : ''} overloaded
            </span>
          </div>
        )}

        {sprintStats.riskyTickets > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-700">
              {sprintStats.riskyTickets} ticket{sprintStats.riskyTickets > 1 ? 's' : ''} at ETA risk
            </span>
          </div>
        )}

        {canFinalize && !disabled && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">
              Sprint ready to finalize
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={onRecalculate}
            variant="outline"
            className="w-full"
            disabled={disabled}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate Projections
          </Button>
          
          <Button
            onClick={onSaveDraft}
            variant="outline"
            className="w-full"
            disabled={disabled}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          <Button
            onClick={onFinalize}
            className="w-full"
            disabled={!canFinalize || disabled}
          >
            <Rocket className="h-4 w-4 mr-2" />
            Finalize & Publish
          </Button>
          
          <Button
            onClick={onExport}
            variant="outline"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
