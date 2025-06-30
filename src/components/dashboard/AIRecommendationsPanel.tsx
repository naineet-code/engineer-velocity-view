import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Clock } from "lucide-react";

interface AIRecommendationsPanelProps {
  sprintData: any;
}

export const AIRecommendationsPanel = ({ sprintData }: AIRecommendationsPanelProps) => {
  // Generate AI insights based on sprint data
  const generateInsights = () => {
    const insights = [];
    
    // ETA Analysis
    const etaMetrics = sprintData?.etaAnalysis || { missed: 0, total: 0 };
    if (etaMetrics.total > 0) {
      const missRate = ((etaMetrics.missed / etaMetrics.total) * 100).toFixed(0);
      insights.push({
        type: "warning",
        text: `${etaMetrics.missed} of ${etaMetrics.total} tickets missed ETA (${missRate}%) - consider better estimation practices`,
        icon: AlertTriangle
      });
    }
    
    // Blocked Time Analysis
    const blockedMetrics = sprintData?.blockedTimeAnalysis || { totalBlockedDays: 0, ticketsBlocked: 0 };
    if (blockedMetrics.ticketsBlocked > 0) {
      const avgBlockedDays = (blockedMetrics.totalBlockedDays / blockedMetrics.ticketsBlocked).toFixed(1);
      insights.push({
        type: "info",
        text: `Tickets were blocked for an average of ${avgBlockedDays} days - identify common blockers`,
        icon: Clock
      });
    }

    // High Effort Tickets
    const highEffortTickets = sprintData?.highEffortTickets || [];
    if (highEffortTickets.length > 0) {
      const ticketList = highEffortTickets.map(t => t.id).join(", ");
      insights.push({
        type: "action",
        text: `Consider breaking down high-effort tickets: ${ticketList}`,
        icon: TrendingUp
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>AI Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <insight.icon className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">{insight.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
