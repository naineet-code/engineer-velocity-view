
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, CheckCircle, User, AlertCircle } from "lucide-react";
import { mockDashboardData } from "@/data/mockData";

export const KPICards = () => {
  const { kpis } = mockDashboardData;

  const cards = [
    {
      title: "Blocked Tickets",
      value: kpis.blockedTickets,
      icon: AlertCircle,
      color: "text-red-600 bg-red-100",
      textColor: "text-red-600"
    },
    {
      title: "Avg Days Blocked",
      value: `${kpis.avgDaysBlocked}d`,
      icon: Clock,
      color: "text-amber-600 bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      title: "ETA Risk Tickets",
      value: kpis.etaRiskTickets,
      icon: AlertTriangle,
      color: "text-red-600 bg-red-100",
      textColor: "text-red-600"
    },
    {
      title: "Devs with ETA Risk",
      value: kpis.devsWithRisk,
      icon: User,
      color: "text-orange-600 bg-orange-100",
      textColor: "text-orange-600"
    },
    {
      title: "Closed (7d)",
      value: kpis.ticketsClosed7d,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
      textColor: "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
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
      ))}
    </div>
  );
};
