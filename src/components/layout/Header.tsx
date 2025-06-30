
import { Badge } from "@/components/ui/badge";
import { StandupSummaryExporter } from "@/components/shared/StandupSummaryExporter";
import { useData } from "@/contexts/DataContext";
import { BarChart3, Info } from "lucide-react";

export const Header = () => {
  const { tickets, isUsingDummyData } = useData();

  return (
    <div className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 px-6 py-3 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Engineering Dashboard</h1>
              <p className="text-sm text-gray-500">Track team progress and identify blockers</p>
            </div>
          </div>
          
          {isUsingDummyData && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Info className="h-3 w-3 mr-1" />
              Demo Mode
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {tickets.length > 0 && <StandupSummaryExporter />}
          {tickets.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              ✅ {tickets.length} tickets loaded
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
