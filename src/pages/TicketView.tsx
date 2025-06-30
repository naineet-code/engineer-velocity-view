
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  RefreshCw, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle, 
  MessageSquare, 
  Link2, 
  Edit3,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Flag,
  GitPullRequest
} from "lucide-react";

const TicketView = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingETA, setEditingETA] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Mock ticket data
  const ticketData = {
    id: ticketId || "TICKET-123",
    title: "Implement user authentication with OAuth2",
    assignedDeveloper: "Alex Johnson",
    currentStatus: "In Dev",
    eta: "2024-01-15",
    priority: "High",
    effortEstimate: 8,
    effortRemaining: 3,
    daysInDev: 5,
    projectedEndDate: "2024-01-18",
    rank: 2,
    clarificationLoops: 2
  };

  const lifecycleStages = [
    { 
      stage: "Not Started", 
      duration: "0d", 
      startDate: "2024-01-08", 
      endDate: "2024-01-08", 
      status: "completed",
      owner: "Product Team"
    },
    { 
      stage: "Clarification", 
      duration: "2d", 
      startDate: "2024-01-08", 
      endDate: "2024-01-10", 
      status: "completed",
      owner: "Alex Johnson"
    },
    { 
      stage: "In Dev", 
      duration: "5d", 
      startDate: "2024-01-10", 
      endDate: "2024-01-15", 
      status: "active",
      owner: "Alex Johnson"
    },
    { 
      stage: "Tech QC", 
      duration: "1d", 
      startDate: "2024-01-15", 
      endDate: "2024-01-16", 
      status: "pending",
      owner: "Sarah Wilson"
    },
    { 
      stage: "Business QC", 
      duration: "1d", 
      startDate: "2024-01-16", 
      endDate: "2024-01-17", 
      status: "pending",
      owner: "Product Team"
    }
  ];

  const eventLog = [
    {
      date: "2024-01-15",
      time: "10:30 AM",
      event: "Status changed to In Dev",
      user: "Alex Johnson",
      type: "status"
    },
    {
      date: "2024-01-14",
      time: "2:15 PM",
      event: "Blocked by Success Team - waiting for API keys",
      user: "System",
      type: "blocker"
    },
    {
      date: "2024-01-12",
      time: "9:00 AM",
      event: "ETA updated to 2024-01-15",
      user: "Alex Johnson",
      type: "eta"
    },
    {
      date: "2024-01-10",
      time: "11:45 AM",
      event: "Clarification resolved",
      user: "Product Team",
      type: "clarification"
    }
  ];

  const blockerInstances = [
    {
      id: 1,
      source: "Success Team",
      reason: "API keys not provided",
      startDate: "2024-01-12",
      endDate: "2024-01-14",
      daysBlocked: 2,
      status: "resolved",
      resolvedBy: "Mike Chen"
    },
    {
      id: 2,
      source: "Client",
      reason: "Requirements clarification needed",
      startDate: "2024-01-09",
      endDate: "2024-01-10",
      daysBlocked: 1,
      status: "resolved",
      resolvedBy: "Product Team"
    }
  ];

  const comments = [
    {
      id: 1,
      author: "Alex Johnson",
      timestamp: "2024-01-15 10:30 AM",
      content: "Started implementation of OAuth2 flow. Initial setup complete.",
      type: "Dev Log"
    },
    {
      id: 2,
      author: "Sarah Wilson",
      timestamp: "2024-01-14 3:00 PM",
      content: "API keys have been received. Unblocking the ticket.",
      type: "Manager Note"
    }
  ];

  const linkedReferences = [
    {
      type: "Design",
      title: "OAuth2 Flow Mockups",
      url: "#",
      icon: "🎨"
    },
    {
      type: "Slack Thread",
      title: "Authentication Discussion",
      url: "#",
      icon: "💬"
    },
    {
      type: "Requirements",
      title: "Security Requirements Doc",
      url: "#",
      icon: "📋"
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "blocked": return "bg-red-100 text-red-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "active": return <Play className="h-4 w-4" />;
      case "blocked": return <XCircle className="h-4 w-4" />;
      case "pending": return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

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
            <h1 className="text-2xl font-bold">{ticketData.title}</h1>
            <p className="text-gray-600">{ticketData.id}</p>
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
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Assigned Developer</p>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                <span className="font-medium">{ticketData.assignedDeveloper}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={`mt-1 ${getStatusColor(ticketData.currentStatus.toLowerCase())}`}>
                {ticketData.currentStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Priority</p>
              <Badge variant="destructive" className="mt-1">
                {ticketData.priority}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">ETA</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{ticketData.eta}</span>
                <Button variant="ghost" size="sm" onClick={() => setEditingETA(true)}>
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lifecycle Gantt/Stepper */}
          <Card>
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
                        {stage.startDate} - {stage.endDate} • {stage.owner}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Log Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Event Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {eventLog.map((event, index) => (
                  <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                    <div className="text-sm text-gray-500 w-20">
                      {event.time}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{event.event}</p>
                      <p className="text-xs text-gray-500">by {event.user}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blocker Tracker */}
          <Card>
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
                      <span>{blocker.startDate} - {blocker.endDate}</span>
                      <span>{blocker.daysBlocked} days</span>
                      {blocker.resolvedBy && <span>Resolved by {blocker.resolvedBy}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notes & Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{comment.author}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{comment.type}</Badge>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-20"
                  />
                  <Button size="sm">Post Comment</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Effort & ETA Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Effort & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Effort Assigned:</span>
                <span className="font-medium">{ticketData.effortEstimate}d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Days in Dev:</span>
                <span className="font-medium">{ticketData.daysInDev}d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Effort Remaining:</span>
                <span className="font-medium">{ticketData.effortRemaining}d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Projected End:</span>
                <span className="font-medium">{ticketData.projectedEndDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rank:</span>
                <span className="font-medium">#{ticketData.rank}</span>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  {ticketData.clarificationLoops} clarification loops detected
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Dev time 25% above team average
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  On track for delivery milestone
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Linked References */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {linkedReferences.map((ref, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-lg">{ref.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ref.title}</p>
                      <p className="text-xs text-gray-500">{ref.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Developer Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Developer Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">PR Raised:</span>
                <span className="text-sm">2024-01-14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">PR Status:</span>
                <Badge variant="outline" className="text-xs">
                  <GitPullRequest className="h-3 w-3 mr-1" />
                  Review Pending
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Update:</span>
                <span className="text-sm">2 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
