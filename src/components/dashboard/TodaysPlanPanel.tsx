
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Target, Play, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

interface TodaysPlanPanelProps {
  tickets: any[];
  onTicketStart: (ticketId: string) => void;
  onTicketDefer: (ticketId: string, comment: string) => void;
}

export const TodaysPlanPanel = ({ tickets, onTicketStart, onTicketDefer }: TodaysPlanPanelProps) => {
  const [deferComment, setDeferComment] = useState("");
  const [showDeferInput, setShowDeferInput] = useState<string | null>(null);

  // Get suggested tickets for today based on rank, ETA, and status
  const getTodaysSuggestions = () => {
    return tickets
      .filter(t => t.status === "Not Started" || t.status === "In Dev")
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 3);
  };

  const suggestedTickets = getTodaysSuggestions();

  const handleDefer = (ticketId: string) => {
    onTicketDefer(ticketId, deferComment);
    setDeferComment("");
    setShowDeferInput(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Target className="h-5 w-5 text-green-600" />
          <span>Today's Suggested Focus</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestedTickets.map((ticket) => (
          <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">{ticket.id}</span>
                <Badge variant="outline" className="text-xs">
                  {ticket.eta}d ETA
                </Badge>
              </div>
              <p className="text-sm text-gray-600 truncate max-w-xs">{ticket.title}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTicketStart(ticket.id)}
                className="flex items-center space-x-1"
              >
                <Play className="h-3 w-3" />
                <span>Start</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeferInput(ticket.id)}
              >
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {showDeferInput && (
          <div className="p-3 border rounded-lg bg-yellow-50">
            <p className="text-sm font-medium mb-2">Why are you deferring this ticket?</p>
            <Textarea
              placeholder="Optional comment..."
              value={deferComment}
              onChange={(e) => setDeferComment(e.target.value)}
              className="mb-2"
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => handleDefer(showDeferInput)}>
                Defer
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeferInput(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {suggestedTickets.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">All caught up! No pending tickets.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
