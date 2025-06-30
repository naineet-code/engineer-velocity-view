
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  User, 
  Ticket, 
  Plus,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Team Pulse",
    href: "/",
    icon: BarChart3,
    description: "Real-time team dashboard"
  },
  {
    name: "Sprint Analysis",
    href: "/sprint-analysis",
    icon: TrendingUp,
    description: "Retrospective sprint reviews"
  },
  {
    name: "Developer View",
    href: "/developer-view",
    icon: User,
    description: "Individual developer insights"
  },
  {
    name: "Ticket View",
    href: "/ticket-view",
    icon: Ticket,
    description: "Detailed ticket analytics"
  },
  {
    name: "Sprint Planning",
    href: "/sprint-planning",
    icon: Plus,
    description: "Create and plan new sprints"
  }
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Aura</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Engineering Dashboard</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              )}
            >
              <Icon className="h-5 w-5" />
              <div>
                <div>{item.name}</div>
                <div className="text-xs text-gray-400">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
