
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Target, Calendar } from "lucide-react";
import { useState } from "react";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: "tickets" | "days" | "custom";
  timeframe: string;
}

interface PersonalGoalTrackerProps {
  isVisible: boolean;
}

export const PersonalGoalTracker = ({ isVisible }: PersonalGoalTrackerProps) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Close tickets this week",
      target: 3,
      current: 2,
      type: "tickets",
      timeframe: "week"
    },
    {
      id: "2", 
      title: "Keep blocked time under",
      target: 2,
      current: 1,
      type: "days",
      timeframe: "week"
    }
  ]);

  const [newGoal, setNewGoal] = useState({ title: "", target: "" });
  const [showAddGoal, setShowAddGoal] = useState(false);

  const addGoal = () => {
    if (newGoal.title && newGoal.target) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        target: parseInt(newGoal.target),
        current: 0,
        type: "custom",
        timeframe: "week"
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: "", target: "" });
      setShowAddGoal(false);
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const isGoalAchieved = (current: number, target: number) => {
    return current >= target;
  };

  if (!isVisible) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>My Goals</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddGoal(!showAddGoal)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">{goal.title}</span>
              </div>
              {isGoalAchieved(goal.current, goal.target) && (
                <Badge className="bg-green-100 text-green-800">
                  🎉 Done!
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{goal.current} of {goal.target}</span>
                <span>{Math.round(getProgressPercentage(goal.current, goal.target))}%</span>
              </div>
              <Progress 
                value={getProgressPercentage(goal.current, goal.target)} 
                className="h-2"
              />
            </div>
          </div>
        ))}

        {showAddGoal && (
          <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-3">
              <Input
                placeholder="Goal description..."
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Target number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={addGoal}>
                  Add Goal
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {goals.length === 0 && !showAddGoal && (
          <div className="text-center py-4 text-gray-500">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Set your first goal!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
