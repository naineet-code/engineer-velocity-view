
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter } from "lucide-react";

interface FilterToolbarProps {
  showFilter: 'all' | 'blocked' | 'eta-risk';
  onShowFilterChange: (value: 'all' | 'blocked' | 'eta-risk') => void;
  selectedDeveloper: string;
  onDeveloperChange: (value: string) => void;
  selectedBlockerSource: string;
  onBlockerSourceChange: (value: string) => void;
  developers: string[];
  blockerSources: string[];
  onRefresh: () => void;
  lastRefresh: Date;
}

export const FilterToolbar = ({
  showFilter,
  onShowFilterChange,
  selectedDeveloper,
  onDeveloperChange,
  selectedBlockerSource,
  onBlockerSourceChange,
  developers,
  blockerSources,
  onRefresh,
  lastRefresh
}: FilterToolbarProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Show:</span>
            </div>
            
            <div className="flex space-x-2">
              <Badge 
                variant={showFilter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onShowFilterChange('all')}
              >
                All Tickets
              </Badge>
              <Badge 
                variant={showFilter === 'blocked' ? 'destructive' : 'outline'}
                className="cursor-pointer"
                onClick={() => onShowFilterChange('blocked')}
              >
                Only Blocked
              </Badge>
              <Badge 
                variant={showFilter === 'eta-risk' ? 'secondary' : 'outline'}
                className="cursor-pointer"
                onClick={() => onShowFilterChange('eta-risk')}
              >
                Only ETA Risk
              </Badge>
            </div>

            <Select value={selectedDeveloper} onValueChange={onDeveloperChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Developers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Developers</SelectItem>
                {developers.map(dev => (
                  <SelectItem key={dev} value={dev}>{dev}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBlockerSource} onValueChange={onBlockerSourceChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Blockers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blockers</SelectItem>
                {blockerSources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
