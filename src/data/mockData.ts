
// Mock data for the Engineering Dashboard

export interface MockTicket {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effortDays?: number;
  eta?: string;
  tags?: string[];
  type: 'bug' | 'story' | 'task';
  status: string;
  isBlocked?: boolean;
  blockedBy?: string;
  daysBlocked?: number;
  isRisk?: boolean;
  owner?: string;
  rank?: number;
  projectedCompletion?: string;
}

export interface MockDeveloper {
  id: string;
  name: string;
  tickets: MockTicket[];
  availableEffort?: number;
}

export const mockTickets: MockTicket[] = [
  {
    id: "TICKET-001",
    title: "Implement OAuth2 authentication system",
    priority: "high",
    effortDays: 5,
    eta: "2024-01-15",
    tags: ["security", "backend"],
    type: "story",
    status: "not-started",
    owner: "unassigned",
    rank: 1
  },
  {
    id: "TICKET-002", 
    title: "Fix dashboard loading performance",
    priority: "critical",
    effortDays: 3,
    eta: "2024-01-12",
    tags: ["performance", "frontend"],
    type: "bug",
    status: "not-started",
    isRisk: true,
    owner: "unassigned",
    rank: 2
  },
  {
    id: "TICKET-003",
    title: "Add user notification preferences",
    priority: "medium",
    effortDays: 2,
    eta: "2024-01-18",
    tags: ["feature", "frontend"],
    type: "story",
    status: "not-started",
    owner: "unassigned",
    rank: 3
  },
  {
    id: "TICKET-004",
    title: "Database migration for user profiles",
    priority: "high",
    effortDays: 4,
    eta: "2024-01-20",
    tags: ["database", "backend"],
    type: "task",
    status: "not-started",
    owner: "unassigned",
    rank: 4
  },
  {
    id: "TICKET-005",
    title: "Implement real-time chat feature",
    priority: "medium",
    effortDays: 8,
    eta: "2024-01-25",
    tags: ["realtime", "feature"],
    type: "story",
    status: "not-started",
    owner: "unassigned",
    rank: 5
  },
  {
    id: "TICKET-006",
    title: "Fix mobile responsive layout issues",
    priority: "medium",
    effortDays: 2,
    eta: "2024-01-16",
    tags: ["mobile", "css"],
    type: "bug",
    status: "not-started",
    owner: "unassigned",
    rank: 6
  },
  {
    id: "TICKET-007",
    title: "Add API rate limiting",
    priority: "high",
    effortDays: 3,
    eta: "2024-01-22",
    tags: ["security", "api"],
    type: "story",
    status: "not-started",
    owner: "unassigned",
    rank: 7
  },
  {
    id: "TICKET-008",
    title: "Update documentation for new features",
    priority: "low",
    effortDays: 1,
    eta: "2024-01-30",
    tags: ["docs"],
    type: "task",
    status: "not-started",
    owner: "unassigned",
    rank: 8
  }
];

export const mockDevelopers: MockDeveloper[] = [
  {
    id: "sarah",
    name: "Sarah Chen",
    tickets: [],
    availableEffort: 8
  },
  {
    id: "mike",
    name: "Mike Rodriguez", 
    tickets: [],
    availableEffort: 8
  },
  {
    id: "alex",
    name: "Alex Johnson",
    tickets: [],
    availableEffort: 8
  },
  {
    id: "nidhi",
    name: "Nidhi Patel",
    tickets: [],
    availableEffort: 8
  }
];

// Mock data for dashboard
export const mockDashboardData = {
  developers: [
    {
      name: "Sarah Chen",
      tickets: [
        {
          id: "TICKET-101",
          title: "User Authentication System",
          status: "on-track",
          etaDate: new Date("2024-01-15"),
          effortDays: 5,
          isBlocked: false,
          isRisk: false,
          rank: 1,
          owner: "Sarah Chen"
        },
        {
          id: "TICKET-102", 
          title: "Dashboard Performance Fix",
          status: "blocked",
          etaDate: new Date("2024-01-12"),
          effortDays: 3,
          isBlocked: true,
          blockedDays: 2,
          blockedBy: "Success Team",
          isRisk: true,
          rank: 2,
          owner: "Sarah Chen"
        }
      ]
    },
    {
      name: "Mike Rodriguez",
      tickets: [
        {
          id: "TICKET-201",
          title: "API Integration",
          status: "on-track", 
          etaDate: new Date("2024-01-18"),
          effortDays: 4,
          isBlocked: false,
          isRisk: false,
          rank: 1,
          owner: "Mike Rodriguez"
        }
      ]
    },
    {
      name: "Alex Johnson",
      tickets: [
        {
          id: "TICKET-301",
          title: "Mobile Responsive Layout",
          status: "not-started",
          etaDate: new Date("2024-01-20"),
          effortDays: 2,
          isBlocked: false,
          isRisk: false,
          rank: 1,
          owner: "Alex Johnson"
        }
      ]
    }
  ],
  kpis: {
    ticketsClosed7d: 8
  },
  riskByDeveloper: [
    { name: "Sarah", riskTickets: 1 },
    { name: "Mike", riskTickets: 0 },
    { name: "Alex", riskTickets: 0 },
    { name: "Nidhi", riskTickets: 0 }
  ],
  blockersBySource: [
    { name: "Success Team", blockedTickets: 2, color: "#ef4444" },
    { name: "Client", blockedTickets: 1, color: "#f59e0b" },
    { name: "Infrastructure", blockedTickets: 1, color: "#3b82f6" }
  ],
  activeTickets: [
    {
      id: "TICKET-101",
      title: "User Authentication System", 
      owner: "Sarah Chen",
      status: "In Progress",
      eta: "2024-01-15",
      daysBlocked: 0,
      isRisk: false,
      addedToAgenda: false
    },
    {
      id: "TICKET-102",
      title: "Dashboard Performance Fix",
      owner: "Sarah Chen", 
      status: "Blocked",
      eta: "2024-01-12",
      daysBlocked: 2,
      isRisk: true,
      addedToAgenda: true
    },
    {
      id: "TICKET-201",
      title: "API Integration",
      owner: "Mike Rodriguez",
      status: "In Progress", 
      eta: "2024-01-18",
      daysBlocked: 0,
      isRisk: false,
      addedToAgenda: false
    }
  ]
};
