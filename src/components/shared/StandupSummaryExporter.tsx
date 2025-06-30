
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { KPICalculator } from '@/utils/kpiCalculations';

export const StandupSummaryExporter = () => {
  const { tickets } = useData();

  const exportSummary = () => {
    const calculator = new KPICalculator(tickets);
    const riskTickets = calculator.getETARiskTickets();
    const blockedTickets = tickets.filter(ticket => 
      ['Clarification', 'Business QC', 'Release Plan'].includes(ticket.status)
    );

    let summary = '🚨 **Daily Standup Summary**\n\n';
    
    if (blockedTickets.length > 0) {
      summary += '**🔴 Blocked Tickets:**\n';
      blockedTickets.forEach(ticket => {
        summary += `• ${ticket.ticket_id}: ${ticket.title} (${ticket.developer}) - Blocked by: ${ticket.blocked_by}\n`;
      });
      summary += '\n';
    }

    if (riskTickets.length > 0) {
      summary += '**⚠️ ETA Risk Tickets:**\n';
      riskTickets.forEach(ticket => {
        summary += `• ${ticket.ticket_id}: ${ticket.title} (${ticket.developer}) - ETA: ${ticket.ETA}\n`;
      });
      summary += '\n';
    }

    if (blockedTickets.length === 0 && riskTickets.length === 0) {
      summary += '✅ **No blocked or at-risk tickets today!**\n\n';
    }

    summary += `📊 **Quick Stats:**\n`;
    summary += `• Total Blocked: ${calculator.getTotalBlockedTickets()}\n`;
    summary += `• Avg Days Blocked: ${calculator.getAverageDaysBlocked()}\n`;
    summary += `• Developers with Risk: ${calculator.getDevelopersWithRisk()}\n`;
    summary += `• Closed Last 7 Days: ${calculator.getTicketsClosedLast7Days()}\n`;

    // Download as text file
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `standup-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={exportSummary} variant="outline" className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Download Stand-up Summary
    </Button>
  );
};
