
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Download, ArrowRight } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

export const NoDataFallback = () => {
  const { downloadSampleCSV } = useData();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl mb-2">No Ticket Data Found</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            To start analyzing your team's engineering metrics, upload a CSV file with your ticket data or try the demo with sample data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg text-left text-sm">
            <p className="font-medium text-gray-700 mb-2">Required CSV columns:</p>
            <code className="text-xs text-gray-600 block">
              ticket_id, title, developer, created_at, last_updated, status, effort_points, ETA, priority, rank, blocked_by, resumed_at, event_log
            </code>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild className="button-primary flex-1">
              <Link to="/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV Data
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button onClick={downloadSampleCSV} variant="outline" className="button-outline">
              <Download className="h-4 w-4 mr-2" />
              Download Sample
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
