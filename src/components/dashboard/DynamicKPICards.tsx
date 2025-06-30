
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, Clock, CheckCircle, User, AlertCircle } from "lucide-react";

interface KPIData {
  blockedTickets: number;
  avgDaysBlocked: number;
  etaRiskTickets: number;
  devsWithRisk: number;
  ticketsClosed7d: number;
  blockedBreakdown: { [key: string]: number };
}

interface DynamicKPICardsProps {
  kpiData: KPIData;
}

export const DynamicKPICards = ({ kpiData }: DynamicKPICardsProps) => {
  const cards = [
    {
      title: "Blocked Tickets",
      value: kpiData.blockedTickets,
      icon: AlertCircle,
      color: "text-red-600 bg-red-100",
      textColor: "text-red-600",
      breakdown: kpiData.blockedBreakdown
    },
    {
      title: "Avg Days Blocked",
      value: `${kpiData.avgDaysBlocked}d`,
      icon: Clock,
      color: "text-amber-600 bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      title: "ETA Risk Tickets",
      value: kpiData.etaRiskTickets,
      icon: AlertTriangle,
      color: "text-red-600 bg-red-100",
      textColor: "text-red-600"
    },
    {
      title: "Devs with ETA Risk",
      value: kpiData.devsWithRisk,
      icon: User,
      color: "text-orange-600 bg-orange-100",
      textColor: "text-orange-600"
    },
    {
      title: "Closed (7d)",
      value: kpiData.ticketsClosed7d,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
      textColor: "text-green-600"
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                      <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <card.icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            {card.breakdown && (
              <TooltipContent>
                <div className="space-y-1">
                  <div className="font-semibold">Breakdown:</div>
                  {Object.entries(card.breakdown).map(([source, count]) => (
                    <div key={source} className="flex justify-between">
                      <span>{source}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
