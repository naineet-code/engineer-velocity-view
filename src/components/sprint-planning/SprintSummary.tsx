
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Rocket, 
  RefreshCw, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock
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
  const getHealthScore = () => {
    let score = 100;
    if (sprintStats.overloadedDevs > 0) score -= 30;
    if (sprintStats.riskyTickets > 0) score -= 20;
    if (sprintStats.totalTickets === 0) score = 0;
    return Math.max(0, score);
  };

  const healthScore = getHealthScore();
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Sprint Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Health Score */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-3xl font-bold ${getHealthColor(healthScore)}`}>
            {healthScore}%
          </div>
          <p className="text-sm text-gray-600">Sprint Health</p>
        </div>

        <Separator />

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Tickets</span>
            <Badge variant="secondary">{sprintStats.totalTickets}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Effort</span>
            <Badge variant="secondary">{sprintStats.totalEffort}d</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sprint Duration</span>
            <Badge variant="secondary">{sprintDuration}d</Badge>
          </div>
          
          {sprintStats.overloadedDevs > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Overloaded Devs
              </span>
              <Badge variant="destructive">{sprintStats.overloadedDevs}</Badge>
            </div>
          )}
          
          {sprintStats.riskyTickets > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-600 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                ETA Risks
              </span>
              <Badge className="bg-orange-100 text-orange-800">{sprintStats.riskyTickets}</Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={onRecalculate}
            variant="outline"
            className="w-full"
            disabled={disabled}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate
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
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={disabled || healthScore < 70}
          >
            <Rocket className="h-4 w-4 mr-2" />
            Finalize Sprint
          </Button>
          
          <Button
            onClick={onExport}
            variant="ghost"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Summary
          </Button>
        </div>

        {healthScore < 70 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              Sprint health below 70%. Address overloads and risks before finalizing.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
