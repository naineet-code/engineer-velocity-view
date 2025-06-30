
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  User, 
  Ticket, 
  Plus,
  Upload,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Team Pulse",
    href: "/",
    icon: Home,
    description: "Real-time team dashboard",
    category: "overview"
  },
  {
    name: "Sprint Analysis",
    href: "/sprint-analysis",
    icon: TrendingUp,
    description: "Retrospective sprint reviews",
    category: "analysis"
  },
  {
    name: "Developer View",
    href: "/developer-view",
    icon: User,
    description: "Individual developer insights",
    category: "analysis"
  },
  {
    name: "Ticket View",
    href: "/ticket-view",
    icon: Ticket,
    description: "Detailed ticket analytics",
    category: "analysis"
  },
  {
    name: "Sprint Planning",
    href: "/sprint-planning",
    icon: Plus,
    description: "Create and plan new sprints",
    category: "planning"
  },
  {
    name: "Upload Data",
    href: "/upload",
    icon: Upload,
    description: "Upload CSV ticket data",
    category: "setup"
  }
];

export const Sidebar = () => {
  const location = useLocation();

  const overviewItems = navigationItems.filter(item => item.category === "overview");
  const analysisItems = navigationItems.filter(item => item.category === "analysis");
  const planningItems = navigationItems.filter(item => item.category === "planning");
  const setupItems = navigationItems.filter(item => item.category === "setup");

  const renderNavSection = (title: string, items: typeof navigationItems) => (
    <div className="mb-6">
      <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "nav-item",
                isActive ? "nav-item-active" : "nav-item-inactive"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.name}</div>
                <div className="text-xs text-gray-400 truncate mt-0.5">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900">Aura</span>
            <p className="text-sm text-gray-500">Engineering Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        {renderNavSection("Overview", overviewItems)}
        {renderNavSection("Analysis", analysisItems)}
        {renderNavSection("Planning", planningItems)}
        {renderNavSection("Setup", setupItems)}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Built with ❤️ for engineering teams
        </div>
      </div>
    </div>
  );
};
