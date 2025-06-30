
import { Badge } from "@/components/ui/badge";
import { StandupSummaryExporter } from "@/components/shared/StandupSummaryExporter";
import { useData } from "@/contexts/DataContext";
import { BarChart3, Info, Upload, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  const { tickets, isUsingDummyData, downloadSampleCSV } = useData();

  return (
    <div className="fixed top-0 left-64 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Engineering Dashboard</h1>
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
        
        <div className="flex items-center space-x-3">
          {tickets.length === 0 ? (
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data
                </Link>
              </Button>
              <Button onClick={downloadSampleCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Sample CSV
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <StandupSummaryExporter />
              <Badge variant="secondary" className="text-xs font-medium">
                ✅ {tickets.length} tickets loaded
              </Badge>
              {!isUsingDummyData && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Last updated: {new Date().toLocaleTimeString()}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
