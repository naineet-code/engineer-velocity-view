
import { TicketData } from '@/contexts/DataContext';

export const dummyTicketsData: TicketData[] = [
  {
    ticket_id: "TIC-001",
    title: "User Authentication System",
    developer: "Asha",
    created_at: "2024-06-15",
    last_updated: "2024-06-28",
    status: "In Development",
    effort_points: 8,
    ETA: "2024-06-30",
    priority: "P0",
    rank: 1,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-15" },
      { status: "In Sprint", timestamp: "2024-06-17" },
      { status: "In Development", timestamp: "2024-06-20" }
    ]
  },
  {
    ticket_id: "TIC-002",
    title: "Payment Gateway Integration",
    developer: "Raj",
    created_at: "2024-06-10",
    last_updated: "2024-06-25",
    status: "Business QC",
    effort_points: 13,
    ETA: "2024-06-28",
    priority: "P0",
    rank: 2,
    blocked_by: "Client",
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-10" },
      { status: "In Development", timestamp: "2024-06-12" },
      { status: "Tech Review", timestamp: "2024-06-20" },
      { status: "Business QC", timestamp: "2024-06-22" }
    ]
  },
  {
    ticket_id: "TIC-003",
    title: "Dashboard Analytics Widget",
    developer: "Meera",
    created_at: "2024-06-12",
    last_updated: "2024-06-29",
    status: "Closed",
    effort_points: 5,
    ETA: "2024-06-25",
    priority: "P1",
    rank: 3,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-12" },
      { status: "In Development", timestamp: "2024-06-14" },
      { status: "Tech Review", timestamp: "2024-06-18" },
      { status: "Released", timestamp: "2024-06-25" },
      { status: "Closed", timestamp: "2024-06-29" }
    ]
  },
  {
    ticket_id: "TIC-004",
    title: "Mobile App Performance Optimization",
    developer: "Devansh",
    created_at: "2024-06-18",
    last_updated: "2024-06-27",
    status: "Clarification",
    effort_points: 10,
    ETA: "2024-07-05",
    priority: "P1",
    rank: 4,
    blocked_by: "Design",
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-18" },
      { status: "In Development", timestamp: "2024-06-20" },
      { status: "Clarification", timestamp: "2024-06-25" }
    ]
  },
  {
    ticket_id: "TIC-005",
    title: "API Rate Limiting Implementation",
    developer: "Anjali",
    created_at: "2024-06-14",
    last_updated: "2024-06-28",
    status: "Tech Review",
    effort_points: 6,
    ETA: "2024-06-30",
    priority: "P2",
    rank: 5,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-14" },
      { status: "In Development", timestamp: "2024-06-16" },
      { status: "Tech Review", timestamp: "2024-06-26" }
    ]
  },
  {
    ticket_id: "TIC-006",
    title: "Email Notification Service",
    developer: "Asha",
    created_at: "2024-06-20",
    last_updated: "2024-06-29",
    status: "In Development",
    effort_points: 7,
    ETA: "2024-07-03",
    priority: "P1",
    rank: 6,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-20" },
      { status: "In Sprint", timestamp: "2024-06-22" },
      { status: "In Development", timestamp: "2024-06-25" }
    ]
  },
  {
    ticket_id: "TIC-007",
    title: "Database Migration Script",
    developer: "Raj",
    created_at: "2024-06-08",
    last_updated: "2024-06-29",
    status: "Closed",
    effort_points: 4,
    ETA: "2024-06-20",
    priority: "P0",
    rank: 7,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-08" },
      { status: "In Development", timestamp: "2024-06-10" },
      { status: "Tech Review", timestamp: "2024-06-15" },
      { status: "Released", timestamp: "2024-06-18" },
      { status: "Closed", timestamp: "2024-06-29" }
    ]
  },
  {
    ticket_id: "TIC-008",
    title: "User Profile Management",
    developer: "Meera",
    created_at: "2024-06-16",
    last_updated: "2024-06-26",
    status: "Release Plan",
    effort_points: 9,
    ETA: "2024-07-01",
    priority: "P1",
    rank: 8,
    blocked_by: "Infra",
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-16" },
      { status: "In Development", timestamp: "2024-06-18" },
      { status: "Tech Review", timestamp: "2024-06-23" },
      { status: "Release Plan", timestamp: "2024-06-25" }
    ]
  },
  {
    ticket_id: "TIC-009",
    title: "Search Functionality Enhancement",
    developer: "Devansh",
    created_at: "2024-06-22",
    last_updated: "2024-06-29",
    status: "In Development",
    effort_points: 11,
    ETA: "2024-07-08",
    priority: "P2",
    rank: 9,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-22" },
      { status: "In Sprint", timestamp: "2024-06-24" },
      { status: "In Development", timestamp: "2024-06-26" }
    ]
  },
  {
    ticket_id: "TIC-010",
    title: "Security Audit Implementation",
    developer: "Anjali",
    created_at: "2024-06-11",
    last_updated: "2024-06-24",
    status: "Business QC",
    effort_points: 12,
    ETA: "2024-06-29",
    priority: "P0",
    rank: 10,
    blocked_by: "Success",
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-11" },
      { status: "In Development", timestamp: "2024-06-13" },
      { status: "Tech Review", timestamp: "2024-06-20" },
      { status: "Business QC", timestamp: "2024-06-22" }
    ]
  },
  {
    ticket_id: "TIC-011",
    title: "Real-time Chat Feature",
    developer: "Asha",
    created_at: "2024-06-25",
    last_updated: "2024-06-29",
    status: "Created",
    effort_points: 15,
    ETA: "2024-07-15",
    priority: "P2",
    rank: 11,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-25" }
    ]
  },
  {
    ticket_id: "TIC-012",
    title: "API Documentation Update",
    developer: "Raj",
    created_at: "2024-06-19",
    last_updated: "2024-06-28",
    status: "Tech Review",
    effort_points: 3,
    ETA: "2024-06-30",
    priority: "P2",
    rank: 12,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-19" },
      { status: "In Development", timestamp: "2024-06-21" },
      { status: "Tech Review", timestamp: "2024-06-26" }
    ]
  },
  {
    ticket_id: "TIC-013",
    title: "File Upload System",
    developer: "Meera",
    created_at: "2024-06-13",
    last_updated: "2024-06-29",
    status: "Closed",
    effort_points: 8,
    ETA: "2024-06-27",
    priority: "P1",
    rank: 13,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-13" },
      { status: "In Development", timestamp: "2024-06-15" },
      { status: "Tech Review", timestamp: "2024-06-22" },
      { status: "Released", timestamp: "2024-06-26" },
      { status: "Closed", timestamp: "2024-06-29" }
    ]
  },
  {
    ticket_id: "TIC-014",
    title: "Cache Optimization",
    developer: "Devansh",
    created_at: "2024-06-17",
    last_updated: "2024-06-28",
    status: "In Development",
    effort_points: 6,
    ETA: "2024-07-02",
    priority: "P1",
    rank: 14,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-17" },
      { status: "In Sprint", timestamp: "2024-06-19" },
      { status: "In Development", timestamp: "2024-06-24" }
    ]
  },
  {
    ticket_id: "TIC-015",
    title: "Error Handling Improvement",
    developer: "Anjali",
    created_at: "2024-06-21",
    last_updated: "2024-06-27",
    status: "Clarification",
    effort_points: 4,
    ETA: "2024-07-01",
    priority: "P2",
    rank: 15,
    blocked_by: "Client",
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-21" },
      { status: "In Development", timestamp: "2024-06-23" },
      { status: "Clarification", timestamp: "2024-06-26" }
    ]
  },
  {
    ticket_id: "TIC-016",
    title: "Social Media Integration",
    developer: "Asha",
    created_at: "2024-06-09",
    last_updated: "2024-06-29",
    status: "Closed",
    effort_points: 7,
    ETA: "2024-06-22",
    priority: "P2",
    rank: 16,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-09" },
      { status: "In Development", timestamp: "2024-06-11" },
      { status: "Tech Review", timestamp: "2024-06-17" },
      { status: "Released", timestamp: "2024-06-20" },
      { status: "Closed", timestamp: "2024-06-29" }
    ]
  },
  {
    ticket_id: "TIC-017",
    title: "Backup System Implementation",
    developer: "Raj",
    created_at: "2024-06-24",
    last_updated: "2024-06-29",
    status: "In Sprint",
    effort_points: 10,
    ETA: "2024-07-10",
    priority: "P1",
    rank: 17,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-24" },
      { status: "In Sprint", timestamp: "2024-06-26" }
    ]
  },
  {
    ticket_id: "TIC-018",
    title: "Performance Monitoring Dashboard",
    developer: "Meera",
    created_at: "2024-06-05",
    last_updated: "2024-06-28",
    status: "Released",
    effort_points: 9,
    ETA: "2024-06-20",
    priority: "P1",
    rank: 18,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-05" },
      { status: "In Development", timestamp: "2024-06-07" },
      { status: "Tech Review", timestamp: "2024-06-15" },
      { status: "Released", timestamp: "2024-06-25" }
    ]
  },
  {
    ticket_id: "TIC-019",
    title: "Load Testing Framework",
    developer: "Devansh",
    created_at: "2024-06-23",
    last_updated: "2024-06-29",
    status: "Created",
    effort_points: 12,
    ETA: "2024-07-12",
    priority: "P2",
    rank: 19,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-23" }
    ]
  },
  {
    ticket_id: "TIC-020",
    title: "Multi-language Support",
    developer: "Anjali",
    created_at: "2024-06-06",
    last_updated: "2024-06-26",
    status: "Business QC",
    effort_points: 11,
    ETA: "2024-06-28",
    priority: "P1",
    rank: 20,
    blocked_by: "Design",
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-06" },
      { status: "In Development", timestamp: "2024-06-08" },
      { status: "Tech Review", timestamp: "2024-06-18" },
      { status: "Business QC", timestamp: "2024-06-24" }
    ]
  },
  {
    ticket_id: "TIC-021",
    title: "Automated Testing Suite",
    developer: "Asha",
    created_at: "2024-06-26",
    last_updated: "2024-06-29",
    status: "In Development",
    effort_points: 8,
    ETA: "2024-07-06",
    priority: "P2",
    rank: 21,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-26" },
      { status: "In Development", timestamp: "2024-06-28" }
    ]
  },
  {
    ticket_id: "TIC-022",
    title: "Data Export Feature",
    developer: "Raj",
    created_at: "2024-06-07",
    last_updated: "2024-06-29",
    status: "Closed",
    effort_points: 5,
    ETA: "2024-06-18",
    priority: "P2",
    rank: 22,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-07" },
      { status: "In Development", timestamp: "2024-06-09" },
      { status: "Tech Review", timestamp: "2024-06-14" },
      { status: "Released", timestamp: "2024-06-17" },
      { status: "Closed", timestamp: "2024-06-29" }
    ]
  },
  {
    ticket_id: "TIC-023",
    title: "Advanced Filtering System",
    developer: "Meera",
    created_at: "2024-06-15",
    last_updated: "2024-06-28",
    status: "Tech Review",
    effort_points: 7,
    ETA: "2024-07-01",
    priority: "P1",
    rank: 23,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-15" },
      { status: "In Development", timestamp: "2024-06-17" },
      { status: "Tech Review", timestamp: "2024-06-25" }
    ]
  },
  {
    ticket_id: "TIC-024",
    title: "Webhook Integration",
    developer: "Devansh",
    created_at: "2024-06-04",
    last_updated: "2024-06-25",
    status: "Release Plan",
    effort_points: 6,
    ETA: "2024-06-20",
    priority: "P0",
    rank: 24,
    blocked_by: "Infra",
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-04" },
      { status: "In Development", timestamp: "2024-06-06" },
      { status: "Tech Review", timestamp: "2024-06-15" },
      { status: "Release Plan", timestamp: "2024-06-20" }
    ]
  },
  {
    ticket_id: "TIC-025",
    title: "GraphQL API Implementation",
    developer: "Anjali",
    created_at: "2024-06-27",
    last_updated: "2024-06-29",
    status: "In Sprint",
    effort_points: 13,
    ETA: "2024-07-15",
    priority: "P1",
    rank: 25,
    blocked_by: undefined,
    resumed_at: undefined,
    event_log: [
      { status: "Created", timestamp: "2024-06-27" },
      { status: "In Sprint", timestamp: "2024-06-29" }
    ]
  }
];
