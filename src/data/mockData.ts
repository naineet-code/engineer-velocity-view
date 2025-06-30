
export const mockDashboardData = {
  kpis: {
    blockedTickets: 7,
    avgDaysBlocked: 2.3,
    etaRiskTickets: 12,
    devsWithRisk: 4,
    ticketsClosed7d: 23
  },
  
  developers: [
    {
      name: "Sarah Chen",
      tickets: [
        {
          id: "T-142",
          title: "User Authentication Refactor",
          effortDays: 5,
          status: "on-track",
          etaPosition: 80,
          isBlocked: false,
          overdueDays: 0,
          blockedDays: 0
        },
        {
          id: "T-156",
          title: "API Rate Limiting",
          effortDays: 3,
          status: "blocked",
          etaPosition: 60,
          isBlocked: true,
          overdueDays: 0,
          blockedDays: 2
        }
      ]
    },
    {
      name: "Marcus Johnson",
      tickets: [
        {
          id: "T-145",
          title: "Payment Gateway Integration",
          effortDays: 8,
          status: "overdue",
          etaPosition: 70,
          isBlocked: false,
          overdueDays: 2,
          blockedDays: 0
        },
        {
          id: "T-167",
          title: "Mobile Responsive Fixes",
          effortDays: 2,
          status: "not-started",
          etaPosition: 90,
          isBlocked: false,
          overdueDays: 0,
          blockedDays: 0
        }
      ]
    },
    {
      name: "Nidhi Patel",
      tickets: [
        {
          id: "T-134",
          title: "Dashboard Performance Optimization",
          effortDays: 6,
          status: "overdue",
          etaPosition: 65,
          isBlocked: false,
          overdueDays: 1,
          blockedDays: 0
        },
        {
          id: "T-178",
          title: "Email Notification System",
          effortDays: 4,
          status: "overdue",
          etaPosition: 75,
          isBlocked: false,
          overdueDays: 3,
          blockedDays: 0
        },
        {
          id: "T-189",
          title: "Database Migration Script",
          effortDays: 2,
          status: "blocked",
          etaPosition: 85,
          isBlocked: true,
          overdueDays: 0,
          blockedDays: 1
        }
      ]
    },
    {
      name: "Alex Rivera",
      tickets: [
        {
          id: "T-201",
          title: "Search Feature Enhancement",
          effortDays: 5,
          status: "on-track",
          etaPosition: 70,
          isBlocked: false,
          overdueDays: 0,
          blockedDays: 0
        }
      ]
    },
    {
      name: "Emma Thompson",
      tickets: [
        {
          id: "T-223",
          title: "Security Audit Implementation",
          effortDays: 7,
          status: "blocked",
          etaPosition: 60,
          isBlocked: true,
          overdueDays: 0,
          blockedDays: 3
        },
        {
          id: "T-234",
          title: "File Upload Optimization",
          effortDays: 3,
          status: "on-track",
          etaPosition: 80,
          isBlocked: false,
          overdueDays: 0,
          blockedDays: 0
        }
      ]
    }
  ],

  riskByDeveloper: [
    { name: "Nidhi", riskCount: 3 },
    { name: "Marcus", riskCount: 2 },
    { name: "Emma", riskCount: 1 },
    { name: "Sarah", riskCount: 1 },
    { name: "Alex", riskCount: 0 }
  ],

  blockersBySource: [
    { name: "Client", value: 35 },
    { name: "Infra", value: 25 },
    { name: "Design", value: 20 },
    { name: "Success", value: 15 },
    { name: "Other", value: 5 }
  ],

  activeTickets: [
    {
      id: "T-145",
      title: "Payment Gateway Integration",
      owner: "Marcus Johnson", 
      status: "In Progress",
      daysBlocked: 0,
      effortRemaining: 3,
      eta: "2024-07-05",
      projectedCompletion: "2024-07-08",
      isRisk: true,
      blockedBy: null,
      rank: 1
    },
    {
      id: "T-156",
      title: "API Rate Limiting",
      owner: "Sarah Chen",
      status: "Blocked", 
      daysBlocked: 2,
      effortRemaining: 3,
      eta: "2024-07-03",
      projectedCompletion: "2024-07-06",
      isRisk: true,
      blockedBy: "Infra",
      rank: 2
    },
    {
      id: "T-134", 
      title: "Dashboard Performance Optimization",
      owner: "Nidhi Patel",
      status: "In Progress",
      daysBlocked: 0,
      effortRemaining: 2,
      eta: "2024-07-02",
      projectedCompletion: "2024-07-04",
      isRisk: true,
      blockedBy: null,
      rank: 3
    },
    {
      id: "T-178",
      title: "Email Notification System", 
      owner: "Nidhi Patel",
      status: "Code Review",
      daysBlocked: 0,
      effortRemaining: 1,
      eta: "2024-07-06",
      projectedCompletion: "2024-07-08",
      isRisk: true,
      blockedBy: null,
      rank: 4
    },
    {
      id: "T-223",
      title: "Security Audit Implementation",
      owner: "Emma Thompson", 
      status: "Blocked",
      daysBlocked: 3,
      effortRemaining: 5,
      eta: "2024-07-04",
      projectedCompletion: "2024-07-10",
      isRisk: true,
      blockedBy: "Client",
      rank: 5
    },
    {
      id: "T-189",
      title: "Database Migration Script",
      owner: "Nidhi Patel",
      status: "Blocked",
      daysBlocked: 1, 
      effortRemaining: 2,
      eta: "2024-07-07",
      projectedCompletion: "2024-07-09",
      isRisk: true,
      blockedBy: "Design",
      rank: 6
    }
  ],

  insights: [
    {
      type: "warning",
      message: "Nidhi has 3 tickets projected to overrun — T-145 is 2 days behind and needs immediate attention."
    },
    {
      type: "info", 
      message: "Client and Infrastructure blocks account for 60% of current delays. Consider escalation paths."
    },
    {
      type: "warning",
      message: "Sprint velocity is 15% below target. T-223 and T-156 are critical path blockers."
    }
  ]
};
