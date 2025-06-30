
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, Users } from "lucide-react";

interface AIRecommendation {
  type: 'process' | 'workload' | 'quality' | 'blockers';
  message: string;
  severity: 'high' | 'medium' | 'low';
  icon: typeof Brain;
}

interface AIRecommendationsPanelProps {
  ticketData: any[];
  sprintKPIs: any;
}

const AIRecommendationsPanel = ({ ticketData, sprintKPIs }: AIRecommendationsPanelProps) => {
  const generateRecommendations = (): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];
    
    // Analyze clarification loops
    const highClarificationTickets = ticketData.filter(t => t.clarifications > 2);
    if (highClarificationTickets.length > 0) {
      recommendations.push({
        type: 'process',
        message: `${highClarificationTickets.length} tickets needed >2 clarifications, adding avg 3.2 days. Consider more detailed acceptance criteria.`,
        severity: 'high',
        icon: AlertTriangle
      });
    }

    // Analyze dropped tickets
    const droppedTickets = ticketData.filter(t => t.status === "Dropped");
    if (droppedTickets.length > 2) {
      recommendations.push({
        type: 'quality',
        message: `${droppedTickets.length} tickets dropped this sprint. Review ticket readiness before sprint planning.`,
        severity: 'medium',
        icon: TrendingUp
      });
    }

    // Analyze developer workload
    const devWorkload = ticketData.reduce((acc, ticket) => {
      if (!acc[ticket.dev]) acc[ticket.dev] = { total: 0, missed: 0 };
      acc[ticket.dev].total++;
      if (ticket.etaMissed > 0) acc[ticket.dev].missed++;
      return acc;
    }, {} as Record<string, { total: number; missed: number }>);

    const overloadedDev = Object.entries(devWorkload).find(([dev, stats]) => 
      stats.missed / stats.total > 0.5 && stats.total > 2
    );

    if (overloadedDev) {
      recommendations.push({
        type: 'workload',
        message: `${overloadedDev[0]} missed ${overloadedDev[1].missed}/${overloadedDev[1].total} ETAs. Consider load balancing next sprint.`,
        severity: 'high',
        icon: Users
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span>AI Sprint Insights</span>
        </CardTitle>
        <CardDescription>Actionable recommendations based on sprint data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Icon className="h-4 w-4 mt-0.5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{rec.message}</p>
                </div>
                <Badge variant={getSeverityColor(rec.severity) as any} className="text-xs">
                  {rec.severity}
                </Badge>
              </div>
            );
          })}
          {recommendations.length === 0 && (
            <p className="text-sm text-gray-500 italic">No significant issues detected this sprint.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsPanel;
