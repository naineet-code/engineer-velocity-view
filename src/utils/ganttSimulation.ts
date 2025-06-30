interface SimulatedTicket {
  id: string;
  title: string;
  effortDays: number;
  effortRemaining: number;
  status: string;
  etaDate: Date;
  projectedStartDate: Date;
  projectedEndDate: Date;
  isRisk: boolean;
  isBlocked: boolean;
  daysBlocked: number;
  blockedBy?: string;
  rank: number;
  owner: string;
}

interface SimulatedDeveloper {
  name: string;
  tickets: SimulatedTicket[];
  totalEffortDays: number;
  hasQueueOverflow: boolean;
  riskTicketCount: number;
}

export class GanttSimulationEngine {
  private workingDaysOnly = true;

  calculateWorkingDays(startDate: Date, days: number): Date {
    const result = new Date(startDate);
    let addedDays = 0;
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++;
      }
    }
    
    return result;
  }

  simulateTicketQueue(tickets: any[], developerName: string): SimulatedTicket[] {
    const today = new Date();
    let currentDate = new Date(today);
    
    // Sort tickets by rank
    const sortedTickets = [...tickets].sort((a, b) => (a.rank || 999) - (b.rank || 999));
    
    return sortedTickets.map(ticket => {
      const effortRemaining = this.calculateEffortRemaining(ticket);
      const projectedStartDate = new Date(currentDate);
      
      // If ticket is blocked, add blocked days to timeline
      const effectiveEffort = ticket.isBlocked ? effortRemaining + ticket.blockedDays : effortRemaining;
      const projectedEndDate = this.calculateWorkingDays(currentDate, effectiveEffort);
      
      // Update current date for next ticket
      currentDate = new Date(projectedEndDate);
      
      const etaDate = new Date(ticket.eta || ticket.projectedCompletion);
      const isRisk = projectedEndDate > etaDate || ticket.daysBlocked > 3;
      
      return {
        id: ticket.id,
        title: ticket.title,
        effortDays: ticket.effortDays || ticket.effortRemaining || 1,
        effortRemaining,
        status: ticket.status,
        etaDate,
        projectedStartDate,
        projectedEndDate,
        isRisk,
        isBlocked: ticket.isBlocked || ticket.daysBlocked > 0,
        daysBlocked: ticket.daysBlocked || ticket.blockedDays || 0,
        blockedBy: ticket.blockedBy,
        rank: ticket.rank || 999,
        owner: developerName
      };
    });
  }

  calculateEffortRemaining(ticket: any): number {
    // If we have explicit effort remaining, use it
    if (ticket.effortRemaining) return ticket.effortRemaining;
    
    // Otherwise calculate based on status and effort
    const totalEffort = ticket.effortDays || 1;
    const daysInDev = this.getDaysInDevelopment(ticket);
    
    return Math.max(0, totalEffort - daysInDev);
  }

  getDaysInDevelopment(ticket: any): number {
    // Simulate days in development based on status
    switch (ticket.status) {
      case 'not-started':
      case 'Not Started':
        return 0;
      case 'blocked':
      case 'Blocked':
        return ticket.blockedDays || 0;
      case 'on-track':
      case 'In Progress':
        // Assume 30% progress for in-progress tickets
        return Math.floor((ticket.effortDays || 1) * 0.3);
      case 'Code Review':
        // Assume 80% complete
        return Math.floor((ticket.effortDays || 1) * 0.8);
      default:
        return 0;
    }
  }

  simulateDeveloperQueue(developer: any): SimulatedDeveloper {
    const simulatedTickets = this.simulateTicketQueue(developer.tickets, developer.name);
    const totalEffortDays = simulatedTickets.reduce((sum, t) => sum + t.effortRemaining, 0);
    const riskTicketCount = simulatedTickets.filter(t => t.isRisk).length;
    
    // Check for queue overflow (more than 2 weeks of work)
    const hasQueueOverflow = totalEffortDays > 10;
    
    return {
      name: developer.name,
      tickets: simulatedTickets,
      totalEffortDays,
      hasQueueOverflow,
      riskTicketCount
    };
  }

  generateInsights(simulatedDevelopers: SimulatedDeveloper[]): string[] {
    const insights: string[] = [];
    
    // Blocked tickets insights
    const allTickets = simulatedDevelopers.flatMap(dev => dev.tickets);
    const blockedTickets = allTickets.filter(t => t.daysBlocked > 3);
    if (blockedTickets.length > 0) {
      insights.push(`${blockedTickets.length} tickets blocked >3 days — escalation needed`);
    }
    
    // Developer queue insights
    const overflowDevs = simulatedDevelopers.filter(dev => dev.hasQueueOverflow);
    overflowDevs.forEach(dev => {
      const unstarted = dev.tickets.filter(t => t.status === 'not-started' || t.status === 'Not Started').length;
      if (unstarted > 0) {
        insights.push(`${dev.name} has ${dev.totalEffortDays} days queued, ${unstarted} tickets not started`);
      }
    });
    
    // Blocker source insights
    const blockerCounts: { [key: string]: number } = {};
    allTickets.filter(t => t.blockedBy).forEach(t => {
      blockerCounts[t.blockedBy!] = (blockerCounts[t.blockedBy!] || 0) + 1;
    });
    
    const totalBlocked = Object.values(blockerCounts).reduce((sum, count) => sum + count, 0);
    if (totalBlocked > 0) {
      const topBlocker = Object.entries(blockerCounts).sort(([,a], [,b]) => b - a)[0];
      const percentage = Math.round((topBlocker[1] / totalBlocked) * 100);
      insights.push(`${topBlocker[0]} blockers account for ${percentage}% of current delays`);
    }
    
    return insights.slice(0, 3); // Limit to 3 insights
  }
}

export const simulationEngine = new GanttSimulationEngine();
