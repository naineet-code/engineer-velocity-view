
import { Card, CardContent } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { mockDashboardData } from "@/data/mockData";

export const InsightStrip = () => {
  const { insights } = mockDashboardData;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Brain className="text-blue-600 mt-1 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <span>AI Insights</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Live</span>
            </h3>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {insight.type === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                    {insight.type === 'info' && <TrendingUp size={16} className="text-blue-500" />}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{insight.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
