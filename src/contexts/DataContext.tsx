import React, { createContext, useContext, useState, ReactNode } from 'react';
import { dummyTicketsData } from '@/data/dummyTickets';

export interface TicketData {
  ticket_id: string;
  title: string;
  developer: string;
  created_at: string;
  last_updated: string;
  status: string;
  effort_points: number;
  ETA: string;
  priority: string;
  rank: number;
  blocked_by?: string;
  resumed_at?: string;
  event_log: Array<{ status: string; timestamp: string; }>;
}

interface DataContextType {
  tickets: TicketData[];
  uploadCSV: (file: File) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isUsingDummyData: boolean;
  downloadSampleCSV: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDummyData, setIsUsingDummyData] = useState(true);

  const parseEventLog = (eventLogString: string): Array<{ status: string; timestamp: string; }> => {
    if (!eventLogString || eventLogString.trim() === '') {
      return [];
    }
    
    try {
      // Clean up the string - remove extra quotes and fix common issues
      let cleanedString = eventLogString.trim();
      
      // Remove surrounding quotes if they exist
      if (cleanedString.startsWith('"') && cleanedString.endsWith('"')) {
        cleanedString = cleanedString.slice(1, -1);
      }
      
      // Handle escaped quotes
      cleanedString = cleanedString.replace(/""/g, '"');
      
      // Try to parse as JSON
      const parsed = JSON.parse(cleanedString);
      
      // Ensure it's an array
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        console.warn('Event log is not an array:', parsed);
        return [];
      }
    } catch (err) {
      console.warn('Failed to parse event_log JSON:', eventLogString, err);
      return [];
    }
  };

  const parseCSV = (csvText: string): TicketData[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have header and data rows');
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data: TicketData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: any = {};
        
        headers.forEach((header, index) => {
          if (values[index] !== undefined) {
            row[header] = values[index];
          }
        });
        
        // Parse specific fields with validation
        const ticket: TicketData = {
          ticket_id: row.ticket_id || `TICKET-${i}`,
          title: row.title || 'Untitled Ticket',
          developer: row.developer || 'Unassigned',
          created_at: row.created_at || new Date().toISOString(),
          last_updated: row.last_updated || new Date().toISOString(),
          status: row.status || 'Open',
          effort_points: parseInt(row.effort_points) || 0,
          ETA: row.ETA || '',
          priority: row.priority || 'Medium',
          rank: parseInt(row.rank) || 0,
          blocked_by: row.blocked_by || undefined,
          resumed_at: row.resumed_at || undefined,
          event_log: parseEventLog(row.event_log || '[]')
        };
        
        data.push(ticket);
      } catch (err) {
        console.warn(`Failed to parse row ${i}:`, err);
        // Continue processing other rows instead of failing completely
      }
    }
    
    if (data.length === 0) {
      throw new Error('No valid tickets could be parsed from the CSV');
    }
    
    return data;
  };

  const uploadCSV = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      setTickets(parsedData);
      setIsUsingDummyData(false);
      
      // Store in localStorage
      localStorage.setItem('aura-tickets', JSON.stringify(parsedData));
      localStorage.setItem('aura-using-dummy-data', 'false');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const headers = [
      'ticket_id', 'title', 'developer', 'created_at', 'last_updated', 
      'status', 'effort_points', 'ETA', 'priority', 'rank', 'blocked_by', 
      'resumed_at', 'event_log'
    ];
    
    const csvContent = [
      headers.join(','),
      ...dummyTicketsData.map(ticket => [
        ticket.ticket_id,
        `"${ticket.title}"`,
        ticket.developer,
        ticket.created_at,
        ticket.last_updated,
        ticket.status,
        ticket.effort_points,
        ticket.ETA,
        ticket.priority,
        ticket.rank,
        ticket.blocked_by || '',
        ticket.resumed_at || '',
        `"${JSON.stringify(ticket.event_log).replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_tickets.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Load from localStorage on mount, or use dummy data
  React.useEffect(() => {
    const stored = localStorage.getItem('aura-tickets');
    const usingDummy = localStorage.getItem('aura-using-dummy-data');
    
    if (stored && usingDummy === 'false') {
      try {
        setTickets(JSON.parse(stored));
        setIsUsingDummyData(false);
      } catch (err) {
        console.error('Failed to load stored data:', err);
        setTickets(dummyTicketsData);
        setIsUsingDummyData(true);
      }
    } else {
      setTickets(dummyTicketsData);
      setIsUsingDummyData(true);
    }
  }, []);

  return (
    <DataContext.Provider value={{ 
      tickets, 
      uploadCSV, 
      isLoading, 
      error, 
      isUsingDummyData, 
      downloadSampleCSV 
    }}>
      {children}
    </DataContext.Provider>
  );
};
