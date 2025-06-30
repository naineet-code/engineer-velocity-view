
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  RefreshCw, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle, 
  MessageSquare, 
  Edit3,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Flag,
  GitPullRequest
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { TicketData } from "@/contexts/DataContext";

const TicketView = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { tickets } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ticket, setTicket] = useState<TicketData | null>(null);

  useEffect(() => {
    if (ticketId && tickets.length > 0) {
      const foundTicket = tickets.find(t => t.ticket_id === ticketId);
      setTicket(foundTicket || null);
    }
  }, [ticketId, tickets]);

  if (!ticket) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Ticket Not Found</h1>
            <p className="text-gray-600">The requested ticket could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "in development": return "bg-blue-100 text-blue-800";
      case "blocked": 
      case "clarification":
      case "business qc":
      case "release plan": return "bg-red-100 text-red-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": 
      case "closed": return <CheckCircle className="h-4 w-4" />;
      case "in development": return <Play className="h-4 w-4" />;
      case "blocked": 
      case "clarification":
      case "business qc":
      case "release plan": return <XCircle className="h-4 w-4" />;
      case "pending": return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Calculate lifecycle stages from event_log
  const lifecycleStages = ticket.event_log.map((event, index) => {
    const nextEvent = ticket.event_log[index + 1];
    const startDate = event.timestamp;
    const endDate = nextEvent ? nextEvent.timestamp : new Date().toISOString().split('T')[0];
    
    const duration = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      stage: event.status,
      duration: `${duration}d`,
      startDate,
      endDate,
      status: nextEvent ? "completed" : "active",
      owner: ticket.developer
    };
  });

  // Calculate blocker history
  const blockerInstances = ticket.event_log
    .filter(event => ['Clarification', 'Business QC', 'Release Plan'].includes(event.status))
    .map((event, index) => ({
      id: index + 1,
      source: ticket.blocked_by || 'Unknown',
      reason: `Ticket in ${event.status} status`,
      startDate: event.timestamp,
      endDate: new Date().toISOString().split('T')[0],
      daysBlocked: Math.ceil(
        (new Date().getTime() - new Date(event.timestamp).getTime()) / (1000 * 60 * 60 * 24)
      ),
      status: "active",
      resolvedBy: ""
    }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <p className="text-gray-600">{ticket.ticket_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Flag className="h-4 w-4 mr-2" />
            Add to 1-on-1
          </Button>
        </div>
      </div>

      {/* Ticket Header Info */}
      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Assigned Developer</p>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                <button 
                  className="font-medium text-blue-600 hover:underline"
                  onClick={() => navigate(`/developer-view/${ticket.developer}`)}
                >
                  {ticket.developer}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={`mt-1 ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Priority</p>
              <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'} className="mt-1">
                {ticket.priority}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">ETA</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{new Date(ticket.ETA).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lifecycle Timeline */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Lifecycle Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lifecycleStages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor(stage.status)}`}>
                      {getStatusIcon(stage.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{stage.stage}</h4>
                        <span className="text-sm text-gray-600">{stage.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(stage.startDate).toLocaleDateString()} - {new Date(stage.endDate).toLocaleDateString()} • {stage.owner}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blocker History */}
          {blockerInstances.length > 0 && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Blocker History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blockerInstances.map((blocker) => (
                    <div key={blocker.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{blocker.source}</span>
                        <Badge variant={blocker.status === "resolved" ? "default" : "destructive"}>
                          {blocker.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{blocker.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(blocker.startDate).toLocaleDateString()} - {new Date(blocker.endDate).toLocaleDateString()}</span>
                        <span>{blocker.daysBlocked} days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Effort & Timeline Panel */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Effort & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Effort Points:</span>
                <span className="font-medium">{ticket.effort_points}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="font-medium">{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="font-medium">{new Date(ticket.last_updated).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rank:</span>
                <span className="font-medium">#{ticket.rank}</span>
              </div>
            </CardContent>
          </Card>

          {/* Status Insights */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ticket.blocked_by && (
                <div className="p-2 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Currently blocked by {ticket.blocked_by}
                  </p>
                </div>
              )}
              
              {new Date(ticket.ETA) < new Date() && ticket.status !== 'Closed' && (
                <div className="p-2 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Past ETA - requires attention
                  </p>
                </div>
              )}

              <div className="p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  {ticket.event_log.length} status changes tracked
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
