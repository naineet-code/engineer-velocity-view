
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, AlertTriangle } from "lucide-react";

interface ClarificationLoopMapProps {
  tickets: any[];
}

export const ClarificationLoopMap = ({ tickets }: ClarificationLoopMapProps) => {
  // Mock clarification data
  const clarificationData = tickets.map(ticket => ({
    ...ticket,
    clarificationCount: Math.floor(Math.random() * 5),
    blockerSource: ["Success", "Client", "Product", "Engineering"][Math.floor(Math.random() * 4)],
    daysinClarification: Math.floor(Math.random() * 10) + 1
  })).filter(t => t.clarificationCount > 0);

  const getHeatmapColor = (count: number) => {
    if (count >= 4) return "bg-red-100 text-red-800";
    if (count >= 2) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <TooltipProvider>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <span>Clarification Loop Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Loops</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clarificationData.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{ticket.id}</p>
                      <p className="text-xs text-gray-600 truncate max-w-32">{ticket.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={getHeatmapColor(ticket.clarificationCount)}>
                          {ticket.clarificationCount}x
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>High churn may indicate unclear requirements</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {ticket.blockerSource}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{ticket.daysinClarification}d</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {clarificationData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No clarification loops detected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
