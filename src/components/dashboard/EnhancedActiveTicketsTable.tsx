
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, AlertCircle, Clock, Flag } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  owner: string;
  status: string;
  daysBlocked: number;
  effortRemaining: number;
  eta: string;
  projectedCompletion: string;
  isRisk: boolean;
  blockedBy: string | null;
  rank: number;
  addedToAgenda?: boolean;
}

interface EnhancedActiveTicketsTableProps {
  tickets: Ticket[];
  onTicketClick: (ticketId: string) => void;
  onToggleAgenda: (ticketId: string) => void;
}

export const EnhancedActiveTicketsTable = ({ 
  tickets, 
  onTicketClick, 
  onToggleAgenda 
}: EnhancedActiveTicketsTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'Blocked':
        return <Badge variant="destructive">Blocked</Badge>;
      case 'Code Review':
        return <Badge variant="secondary">Code Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDaysUntilETA = (etaStr: string) => {
    const eta = new Date(etaStr);
    const today = new Date();
    const diffTime = eta.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Ticket</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Days Blocked</TableHead>
            <TableHead>Effort Remaining</TableHead>
            <TableHead>ETA</TableHead>
            <TableHead>Projected</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Blocked By</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow 
              key={ticket.id} 
              className={`${ticket.isRisk ? 'bg-red-50' : ''} hover:bg-gray-50 cursor-pointer`}
              onClick={() => onTicketClick(ticket.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={ticket.addedToAgenda}
                  onCheckedChange={() => onToggleAgenda(ticket.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-gray-600">{ticket.id}</span>
                  <span className="font-medium">{ticket.title}</span>
                </div>
              </TableCell>
              <TableCell>{ticket.owner}</TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell>
                {ticket.daysBlocked > 0 ? (
                  <div className="flex items-center space-x-1">
                    <Clock size={14} className="text-red-500" />
                    <span className="text-red-600 font-medium">{ticket.daysBlocked}d</span>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ticket.effortRemaining}d</Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{formatDate(ticket.eta)}</div>
                  <div className="text-xs text-gray-500">
                    {getDaysUntilETA(ticket.eta)} days left
                  </div>
                </div>
              </TableCell>
              <TableCell className={ticket.isRisk ? 'text-red-600 font-medium' : ''}>
                {formatDate(ticket.projectedCompletion)}
              </TableCell>
              <TableCell>
                {ticket.isRisk && (
                  <div className="flex items-center space-x-1">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span className="text-xs text-red-600">ETA Risk</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {ticket.blockedBy && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle size={14} className="text-amber-500" />
                    <Badge variant="outline" className="text-xs">{ticket.blockedBy}</Badge>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono">
                  #{ticket.rank}
                </Badge>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleAgenda(ticket.id)}
                  className={ticket.addedToAgenda ? 'text-blue-600' : 'text-gray-400'}
                >
                  <Flag size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
