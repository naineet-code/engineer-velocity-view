
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

export const CSVUpload = () => {
  const { uploadCSV, isLoading, error, tickets } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      await uploadCSV(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Data Source
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Button 
            onClick={triggerFileSelect} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isLoading ? 'Processing...' : 'Upload CSV'}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {tickets.length > 0 && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {tickets.length} tickets loaded
            </span>
          )}
          
          {error && (
            <span className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </span>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Upload a CSV with columns: ticket_id, title, developer, created_at, last_updated, status, effort_points, ETA, priority, rank, blocked_by, resumed_at, event_log
        </p>
      </CardContent>
    </Card>
  );
};
