
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, Clock, AlertTriangle } from "lucide-react";

interface AgendaTicket {
  id: string;
  title: string;
  owner: string;
  isRisk: boolean;
  daysBlocked: number;
  eta: string;
}

interface AgendaPanelProps {
  tickets: AgendaTicket[];
  onRemoveFromAgenda: (ticketId: string) => void;
  onExportAgenda: () => void;
}

export const AgendaPanel = ({ tickets, onRemoveFromAgenda, onExportAgenda }: AgendaPanelProps) => {
  if (tickets.length === 0) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="fixed right-4 top-4 w-80 max-h-96 overflow-y-auto shadow-lg z-10 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Stand-up Agenda
          <Badge variant="secondary">{tickets.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex items-start justify-between p-3 bg-gray-50 rounded">
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-gray-600">{ticket.id}</span>
                {ticket.isRisk && <AlertTriangle size={12} className="text-red-500" />}
                {ticket.daysBlocked > 0 && <Clock size={12} className="text-amber-500" />}
              </div>
              <div className="font-medium text-sm">{ticket.title}</div>
              <div className="text-xs text-gray-600">
                {ticket.owner} • ETA: {formatDate(ticket.eta)}
              </div>
              {ticket.daysBlocked > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Blocked {ticket.daysBlocked}d
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFromAgenda(ticket.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={14} />
            </Button>
          </div>
        ))}
        
        <Button 
          onClick={onExportAgenda} 
          className="w-full mt-4"
          variant="outline"
        >
          <Download size={14} className="mr-2" />
          Export for Slack
        </Button>
      </CardContent>
    </Card>
  );
};
