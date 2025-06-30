
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown, ChevronUp, Clock, AlertCircle, GitPullRequest } from "lucide-react";
import { useState } from "react";

interface SmartNudgesPanelProps {
  developerName: string;
  tickets: any[];
}

export const SmartNudgesPanel = ({ developerName, tickets }: SmartNudgesPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const generateNudges = () => {
    const nudges = [];
    
    // Check for old tickets
    const oldTickets = tickets.filter(t => {
      const daysSinceStart = 7; // Mock calculation
      return daysSinceStart > 5;
    });
    
    if (oldTickets.length > 0) {
      nudges.push({
        type: "warning",
        icon: Clock,
        text: `${oldTickets[0].id} is older than your average ticket time`,
        action: "Review"
      });
    }

    // Check for stale tickets
    const staleTickets = tickets.filter(t => t.status === "In Dev");
    if (staleTickets.length > 0) {
      nudges.push({
        type: "info",
        icon: AlertCircle,
        text: "No tickets updated in 2 days — possibly stuck?",
        action: "Update"
      });
    }

    // PR nudge
    nudges.push({
      type: "action",
      icon: GitPullRequest,
      text: "3 PRs opened by you are pending for >2 days",
      action: "Follow up"
    });

    return nudges.slice(0, 3);
  };

  const nudges = generateNudges();

  const getIconColor = (type: string) => {
    switch (type) {
      case "warning": return "text-amber-600";
      case "info": return "text-blue-600";
      case "action": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader 
        className="pb-3 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Smart Nudges</span>
            <Badge variant="secondary" className="text-xs">
              {nudges.length}
            </Badge>
          </div>
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="space-y-3">
          {nudges.map((nudge, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <nudge.icon className={`h-4 w-4 mt-0.5 ${getIconColor(nudge.type)} flex-shrink-0`} />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{nudge.text}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                {nudge.action}
              </Button>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
};
