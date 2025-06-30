
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, ArrowLeftRight } from "lucide-react";

interface SprintComparisonProps {
  sprints: string[];
  currentSprint: string;
}

const SprintComparison = ({ sprints, currentSprint }: SprintComparisonProps) => {
  const [isComparing, setIsComparing] = useState(false);
  const [compareSprint, setCompareSprint] = useState("");

  // Mock data for comparison
  const getSprintKPIs = (sprint: string) => {
    const baseKPIs = {
      completed: 18,
      dropped: 3,
      timeBlocked: 23,
      etaMisses: 4,
      clarificationLoops: 6,
      avgDevTimeVsETA: 1.2
    };

    if (sprint === "Sprint 1") {
      return { ...baseKPIs, completed: 15, dropped: 2, timeBlocked: 18, etaMisses: 2 };
    }
    return baseKPIs;
  };

  const currentKPIs = getSprintKPIs(currentSprint);
  const compareKPIs = compareSprint ? getSprintKPIs(compareSprint) : null;

  const getDelta = (current: number, compare: number) => {
    const delta = current - compare;
    const percentage = ((delta / compare) * 100).toFixed(1);
    return { delta, percentage: parseFloat(percentage) };
  };

  const renderDelta = (current: number, compare: number, higherIsBetter = true) => {
    const { delta, percentage } = getDelta(current, compare);
    const isPositive = delta > 0;
    const isBetter = higherIsBetter ? isPositive : !isPositive;

    if (delta === 0) {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }

    return (
      <div className={`flex items-center space-x-1 ${isBetter ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span className="text-sm font-medium">
          {Math.abs(percentage)}%
        </span>
      </div>
    );
  };

  if (!isComparing) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-purple-600" />
            <span>Sprint Comparison</span>
          </CardTitle>
          <CardDescription>Compare performance across sprints</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsComparing(true)} variant="outline">
            Compare with Previous Sprint
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-purple-600" />
            <span>Sprint Comparison</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsComparing(false)}
          >
            Close
          </Button>
        </CardTitle>
        <CardDescription>
          <div className="flex items-center space-x-4">
            <span>Comparing: {currentSprint}</span>
            <span>vs</span>
            <Select value={compareSprint} onValueChange={setCompareSprint}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.filter(s => s !== currentSprint).map(sprint => (
                  <SelectItem key={sprint} value={sprint}>{sprint}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardDescription>
      </CardHeader>
      {compareKPIs && (
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-lg font-bold">{currentKPIs.completed}</div>
              {renderDelta(currentKPIs.completed, compareKPIs.completed, true)}
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Dropped</div>
              <div className="text-lg font-bold">{currentKPIs.dropped}</div>
              {renderDelta(currentKPIs.dropped, compareKPIs.dropped, false)}
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">% Time Blocked</div>
              <div className="text-lg font-bold">{currentKPIs.timeBlocked}%</div>
              {renderDelta(currentKPIs.timeBlocked, compareKPIs.timeBlocked, false)}
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">ETA Misses</div>
              <div className="text-lg font-bold">{currentKPIs.etaMisses}</div>
              {renderDelta(currentKPIs.etaMisses, compareKPIs.etaMisses, false)}
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Clarification Loops</div>
              <div className="text-lg font-bold">{currentKPIs.clarificationLoops}</div>
              {renderDelta(currentKPIs.clarificationLoops, compareKPIs.clarificationLoops, false)}
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Dev Time vs ETA</div>
              <div className="text-lg font-bold">{currentKPIs.avgDevTimeVsETA}x</div>
              {renderDelta(currentKPIs.avgDevTimeVsETA * 100, compareKPIs.avgDevTimeVsETA * 100, false)}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SprintComparison;
