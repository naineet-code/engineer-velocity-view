
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload as UploadIcon, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const Upload = () => {
  const navigate = useNavigate();
  const { uploadCSV, isLoading, error, downloadSampleCSV, tickets, isUsingDummyData } = useData();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      await uploadCSV(file);
      // Redirect to team pulse after successful upload
      if (!error) {
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const requiredColumns = [
    'ticket_id', 'title', 'developer', 'created_at', 'last_updated',
    'status', 'effort_points', 'ETA', 'priority', 'rank', 'blocked_by',
    'resumed_at', 'event_log'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Ticket Data</h1>
        <p className="text-gray-600 mt-2">
          Upload your CSV file to start analyzing your team's engineering metrics
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              CSV File Upload
            </CardTitle>
            <CardDescription>
              Upload a CSV file containing your ticket data to start using the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Required Columns</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {requiredColumns.map((column) => (
                    <Badge key={column} variant="outline" className="text-xs">
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Make sure your CSV includes headers and that the <code>event_log</code> column contains valid JSON arrays.
                </AlertDescription>
              </Alert>

              <div className="flex items-center gap-4">
                <Button 
                  onClick={triggerFileSelect} 
                  disabled={isLoading}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <UploadIcon className="h-4 w-4 mr-2" />
                  {isLoading ? 'Uploading...' : 'Upload CSV File'}
                </Button>
                
                <Button 
                  onClick={downloadSampleCSV}
                  variant="outline"
                  size="lg"
                  className="border-gray-200 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {tickets.length > 0 && !isLoading && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Successfully loaded {tickets.length} tickets! 
                  {!isUsingDummyData && " Redirecting to dashboard..."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {isUsingDummyData && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Demo Mode Active</CardTitle>
              <CardDescription className="text-blue-700">
                You're currently viewing sample data. Upload your own CSV to see real insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                📊 {tickets.length} sample tickets loaded
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Upload;
