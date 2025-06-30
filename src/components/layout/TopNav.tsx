
import { Button } from "@/components/ui/button";
import { CSVUpload } from "@/components/shared/CSVUpload";
import { StandupSummaryExporter } from "@/components/shared/StandupSummaryExporter";
import { useData } from "@/contexts/DataContext";

export const TopNav = () => {
  const { tickets } = useData();

  return (
    <div className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center z-20">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Engineering Dashboard</h1>
        <p className="text-sm text-gray-500">Track team progress and identify blockers</p>
      </div>
      
      <div className="flex items-center space-x-4">
        {tickets.length > 0 && <StandupSummaryExporter />}
        <CSVUpload />
      </div>
    </div>
  );
};
