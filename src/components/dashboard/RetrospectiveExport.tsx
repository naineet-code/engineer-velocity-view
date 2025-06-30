
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RetrospectiveExportProps {
  sprintName: string;
  sprintKPIs: any;
  ticketData: any[];
  insights: string[];
}

const RetrospectiveExport = ({ sprintName, sprintKPIs, ticketData, insights }: RetrospectiveExportProps) => {
  const { toast } = useToast();

  const generateMarkdownReport = () => {
    const droppedTickets = ticketData.filter(t => t.status === "Dropped");
    const blockedTickets = ticketData.filter(t => t.blocked > 3).slice(0, 5);

    const markdown = `# ${sprintName} Retrospective Report

## 📊 Sprint KPIs
- **Completed Tickets:** ${sprintKPIs.completed}
- **Dropped Tickets:** ${sprintKPIs.dropped}
- **Time Blocked:** ${sprintKPIs.timeBlocked}%
- **ETA Misses:** ${sprintKPIs.etaMisses}
- **Clarification Loops:** ${sprintKPIs.clarificationLoops}
- **Avg Dev Time vs ETA:** ${sprintKPIs.avgDevTimeVsETA}x

## 🧠 Key Insights
${insights.map(insight => `- ${insight}`).join('\n')}

## ❌ Top Dropped Tickets
${droppedTickets.map(ticket => 
  `- **${ticket.id}**: ${ticket.title} (Dev: ${ticket.dev})`
).join('\n')}

## 🚫 Most Blocked Tickets
${blockedTickets.map(ticket => 
  `- **${ticket.id}**: ${ticket.title} - ${ticket.blocked} days blocked`
).join('\n')}

## 🎯 Action Items for Next Sprint
- Review acceptance criteria quality for tickets requiring >2 clarifications
- Address recurring blocker sources (Client: 35% of delays)
- Consider load balancing for developers with >50% ETA misses
- Implement earlier blocker escalation (current avg: 3+ days)

---
*Generated on ${new Date().toLocaleDateString()} for ${sprintName}*
`;

    return markdown;
  };

  const handleMarkdownExport = () => {
    const markdown = generateMarkdownReport();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sprintName.replace(' ', '_')}_Retrospective.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Retrospective report has been saved as Markdown file.",
    });
  };

  const handleCopyToClipboard = () => {
    const markdown = generateMarkdownReport();
    navigator.clipboard.writeText(markdown);
    
    toast({
      title: "Copied to Clipboard",
      description: "Retrospective report copied as Markdown format.",
    });
  };

  const handleSlackExport = () => {
    const slackFormat = `*${sprintName} Sprint Summary*

📊 *KPIs:* ${sprintKPIs.completed} completed, ${sprintKPIs.dropped} dropped, ${sprintKPIs.timeBlocked}% blocked time

🧠 *Key Issues:*
${insights.slice(0, 3).map(insight => `• ${insight}`).join('\n')}

🎯 *Action Items:*
• Review AC quality for clarity
• Address client blocker escalation
• Consider dev workload balancing`;

    navigator.clipboard.writeText(slackFormat);
    
    toast({
      title: "Slack Format Copied",
      description: "Sprint summary copied in Slack-friendly format.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-green-600" />
          <span>Retrospective Export</span>
        </CardTitle>
        <CardDescription>Generate meeting-ready reports and summaries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleMarkdownExport}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleCopyToClipboard}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Copy Markdown</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleSlackExport}
            className="flex items-center space-x-2"
          >
            <Share className="h-4 w-4" />
            <span>Copy for Slack</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetrospectiveExport;
