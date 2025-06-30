
import React, { createContext, useContext, useState, ReactNode } from 'react';

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

  const parseCSV = (csvText: string): TicketData[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have header and data rows');
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data: TicketData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          row[header] = values[index];
        }
      });
      
      // Parse specific fields
      const ticket: TicketData = {
        ticket_id: row.ticket_id || '',
        title: row.title || '',
        developer: row.developer || '',
        created_at: row.created_at || '',
        last_updated: row.last_updated || '',
        status: row.status || '',
        effort_points: parseInt(row.effort_points) || 0,
        ETA: row.ETA || '',
        priority: row.priority || '',
        rank: parseInt(row.rank) || 0,
        blocked_by: row.blocked_by || undefined,
        resumed_at: row.resumed_at || undefined,
        event_log: row.event_log ? JSON.parse(row.event_log) : []
      };
      
      data.push(ticket);
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
      
      // Store in localStorage
      localStorage.setItem('aura-tickets', JSON.stringify(parsedData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setIsLoading(false);
    }
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('aura-tickets');
    if (stored) {
      try {
        setTickets(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to load stored data:', err);
      }
    }
  }, []);

  return (
    <DataContext.Provider value={{ tickets, uploadCSV, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};
