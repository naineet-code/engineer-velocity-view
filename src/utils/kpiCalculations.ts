
import { TicketData } from '@/contexts/DataContext';

export class KPICalculator {
  private tickets: TicketData[];
  private today: Date;

  constructor(tickets: TicketData[]) {
    this.tickets = tickets;
    this.today = new Date();
  }

  // 1. Total Blocked Tickets
  getTotalBlockedTickets(): number {
    const blockedStatuses = ['Clarification', 'Business QC', 'Release Plan'];
    return this.tickets.filter(ticket => {
      const isBlocked = blockedStatuses.includes(ticket.status);
      const daysSinceUpdate = Math.floor((this.today.getTime() - new Date(ticket.last_updated).getTime()) / (1000 * 60 * 60 * 24));
      return isBlocked && daysSinceUpdate >= 1;
    }).length;
  }

  // 2. Average Days Blocked
  getAverageDaysBlocked(): number {
    const blockedTickets = this.tickets.filter(ticket => 
      ['Clarification', 'Business QC', 'Release Plan'].includes(ticket.status)
    );

    if (blockedTickets.length === 0) return 0;

    const totalBlockedDays = blockedTickets.reduce((sum, ticket) => {
      const latestBlockedEntry = ticket.event_log
        .filter(entry => ['Clarification', 'Business QC', 'Release Plan'].includes(entry.status))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      if (latestBlockedEntry) {
        const blockedDate = new Date(latestBlockedEntry.timestamp);
        const daysSince = Math.floor((this.today.getTime() - blockedDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + daysSince;
      }
      return sum;
    }, 0);

    return Math.round(totalBlockedDays / blockedTickets.length * 10) / 10;
  }

  // 3. ETA Risk Tickets
  getETARiskTickets(): TicketData[] {
    return this.tickets.filter(ticket => {
      if (ticket.status === 'Closed') return false;
      
      const devStartEntry = ticket.event_log.find(entry => entry.status === 'In Development');
      if (!devStartEntry) return false;
      
      const devStartDate = new Date(devStartEntry.timestamp);
      const daysInDev = Math.floor((this.today.getTime() - devStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const effortRemaining = Math.max(0, ticket.effort_points - daysInDev);
      
      const projectedCompletion = new Date(this.today);
      projectedCompletion.setDate(projectedCompletion.getDate() + effortRemaining);
      
      const eta = new Date(ticket.ETA);
      return projectedCompletion > eta;
    });
  }

  // 4. Developers with Risk
  getDevelopersWithRisk(): number {
    const riskTickets = this.getETARiskTickets();
    const developersWithRisk = new Set(riskTickets.map(ticket => ticket.developer));
    return developersWithRisk.size;
  }

  // 5. Tickets Closed Yesterday
  getTicketsClosedYesterday(): number {
    const yesterday = new Date(this.today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    return this.tickets.filter(ticket => 
      ticket.status === 'Closed' && 
      ticket.last_updated.startsWith(yesterdayStr)
    ).length;
  }

  // 6. Tickets Closed Last 7 Days
  getTicketsClosedLast7Days(): number {
    const sevenDaysAgo = new Date(this.today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return this.tickets.filter(ticket => {
      if (ticket.status !== 'Closed') return false;
      const lastUpdated = new Date(ticket.last_updated);
      return lastUpdated >= sevenDaysAgo;
    }).length;
  }

  // 7. Time Distribution by Status
  getTimeDistribution(): { [status: string]: number } {
    const distribution: { [status: string]: number } = {
      Development: 0,
      Blocked: 0,
      Review: 0,
      Release: 0
    };

    this.tickets.forEach(ticket => {
      const eventLog = [...ticket.event_log].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      for (let i = 0; i < eventLog.length - 1; i++) {
        const current = eventLog[i];
        const next = eventLog[i + 1];
        const duration = new Date(next.timestamp).getTime() - new Date(current.timestamp).getTime();
        const days = duration / (1000 * 60 * 60 * 24);

        if (current.status === 'In Development') {
          distribution.Development += days;
        } else if (['Clarification', 'Business QC', 'Release Plan'].includes(current.status)) {
          distribution.Blocked += days;
        } else if (['Tech QC', 'Business QC'].includes(current.status)) {
          distribution.Review += days;
        } else if (current.status === 'Release') {
          distribution.Release += days;
        }
      }
    });

    return distribution;
  }

  // 8. Blockers by Source
  getBlockersBySource(): { [source: string]: number } {
    const blockers: { [source: string]: number } = {};
    
    this.tickets.forEach(ticket => {
      if (ticket.blocked_by && ['Clarification', 'Business QC', 'Release Plan'].includes(ticket.status)) {
        blockers[ticket.blocked_by] = (blockers[ticket.blocked_by] || 0) + 1;
      }
    });

    return blockers;
  }

  // Get developer-specific metrics
  getDeveloperMetrics(developerName: string) {
    const devTickets = this.tickets.filter(ticket => ticket.developer === developerName);
    
    return {
      totalAssignedEffort: devTickets
        .filter(ticket => ticket.status !== 'Closed')
        .reduce((sum, ticket) => sum + ticket.effort_points, 0),
      
      ticketsCompleted: devTickets.filter(ticket => ticket.status === 'Closed').length,
      
      queueOverflows: devTickets.filter(ticket => 
        this.getETARiskTickets().some(risk => risk.ticket_id === ticket.ticket_id)
      ).length,
      
      isIdle: !devTickets.some(ticket => 
        ticket.status === 'In Development' || 
        ticket.event_log.some(entry => 
          entry.status === 'In Development' && 
          new Date(entry.timestamp) >= new Date(this.today.getTime() - 2 * 24 * 60 * 60 * 1000)
        )
      )
    };
  }
}
