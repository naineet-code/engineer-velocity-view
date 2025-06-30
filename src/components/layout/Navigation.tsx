
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  User, 
  Ticket, 
  Plus,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    description: "Individual developer insights",
    disabled: false
  },
  {
    name: "Ticket View",
    href: "/ticket-view",
    icon: Ticket,
    description: "Detailed ticket analytics",
    disabled: false
  },
  {
    name: "Sprint Planning",
    href: "/sprint-planning",
    icon: Plus,
    description: "Create and plan new sprints",
    disabled: false
  }
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Engineering Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : item.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.disabled && (
                    <span className="text-xs bg-gray-200 px-1 rounded">Soon</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">Dashboard</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.disabled ? "#" : item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : item.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                    onClick={(e) => {
                      if (item.disabled) e.preventDefault();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    {item.disabled && (
                      <span className="text-xs bg-gray-200 px-1 rounded">Soon</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
