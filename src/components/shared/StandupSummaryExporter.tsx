
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { KPICalculator } from '@/utils/kpiCalculations';

export const StandupSummaryExporter = () => {
  const { tickets } = useData();
  const calculator = new KPICalculator(tickets);

  const generateStandupSummary = () => {
    const blockedTickets = calculator.getTotalBlockedTickets();
    const riskTickets = calculator.getETARiskTickets();
    const completedYesterday = calculator.getTicketsClosedYesterday();
    
    const summary = `# Daily Standup Summary - ${new Date().toLocaleDateString()}

## 🎯 Key Metrics
- Tickets completed yesterday: ${completedYesterday}
- Currently blocked tickets: ${blockedTickets}
- ETA risk tickets: ${riskTickets.length}

## 🚨 Blocked Tickets
${blockedTickets > 0 ? 
  tickets.filter(t => ['Clarification', 'Business QC', 'Release Plan'].includes(t.status))
    .map(t => `- ${t.ticket_id}: ${t.title} (blocked by ${t.blocked_by || 'Unknown'})`)
    .join('\n') 
  : 'No blocked tickets'}

## ⚠️ ETA Risk Tickets
${riskTickets.length > 0 ?
  riskTickets.map(t => `- ${t.ticket_id}: ${t.title} (Developer: ${t.developer})`)
    .join('\n')
  : 'No ETA risk tickets'}

## 📈 Developer Status
${[...new Set(tickets.map(t => t.developer))].map(dev => {
  const devTickets = tickets.filter(t => t.developer === dev && t.status !== 'Closed');
  const activeTicket = devTickets.find(t => t.status === 'In Development');
  return `- ${dev}: ${activeTicket ? `Working on ${activeTicket.ticket_id}` : 'No active tickets'}`;
}).join('\n')}

Generated at: ${new Date().toLocaleString()}
    `;

    navigator.clipboard.writeText(summary).then(() => {
      alert('Standup summary copied to clipboard!');
    }).catch(() => {
      // Fallback: download as file
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `standup-summary-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <Button 
      onClick={generateStandupSummary}
      variant="outline"
      size="sm"
      className="border-gray-200 hover:bg-blue-50"
    >
      <Download className="h-4 w-4 mr-2" />
      Export Standup
    </Button>
  );
};
