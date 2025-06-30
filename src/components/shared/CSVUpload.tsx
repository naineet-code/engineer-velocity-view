
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle, Download, Info } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

export const CSVUpload = () => {
  const { uploadCSV, isLoading, error, tickets, isUsingDummyData, downloadSampleCSV } = useData();
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
    <div className="space-y-4">
      {isUsingDummyData && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Demo Mode:</strong> Using sample dataset with 25 tickets across 5 developers. 
            Upload your CSV to see live ticket data.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="h-5 w-5 text-blue-600" />
            Data Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button 
              onClick={triggerFileSelect} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'Upload CSV'}
            </Button>
            
            <Button 
              onClick={downloadSampleCSV}
              variant="outline"
              className="border-gray-200 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample
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
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <p className="text-xs text-gray-500">
            Upload a CSV with columns: ticket_id, title, developer, created_at, last_updated, status, 
            effort_points, ETA, priority, rank, blocked_by, resumed_at, event_log
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
