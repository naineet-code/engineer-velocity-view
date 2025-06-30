
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

export const NoDataFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>No Data Loaded</CardTitle>
          <CardDescription>
            Upload your ticket data CSV file to start analyzing your team's engineering metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/upload">
              <Upload className="h-4 w-4 mr-2" />
              Go to Upload Page
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
