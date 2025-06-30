
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { mockDashboardData } from "@/data/mockData";

export const ActiveTicketsTable = () => {
  const { activeTickets } = mockDashboardData;

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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeTickets.map((ticket) => (
            <TableRow key={ticket.id} className={ticket.isRisk ? 'bg-red-50' : ''}>
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
                  <span className="text-red-600 font-medium">{ticket.daysBlocked}d</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>{ticket.effortRemaining}d</TableCell>
              <TableCell>{formatDate(ticket.eta)}</TableCell>
              <TableCell className={ticket.isRisk ? 'text-red-600 font-medium' : ''}>
                {formatDate(ticket.projectedCompletion)}
              </TableCell>
              <TableCell>
                {ticket.isRisk && (
                  <AlertTriangle size={16} className="text-red-500" />
                )}
              </TableCell>
              <TableCell>
                {ticket.blockedBy && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle size={14} className="text-amber-500" />
                    <span className="text-sm text-gray-600">{ticket.blockedBy}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  #{ticket.rank}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
