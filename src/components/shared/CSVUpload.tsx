
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, AlertCircle, FileText } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

export const CSVUpload = () => {
  const { uploadCSV, isLoading, error, downloadSampleCSV } = useData();
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
    <div className="flex items-center gap-2">
      <Button 
        onClick={triggerFileSelect} 
        disabled={isLoading}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isLoading ? 'Uploading...' : 'Upload CSV'}
      </Button>
      
      <Button 
        onClick={downloadSampleCSV}
        variant="outline"
        size="sm"
        className="border-gray-200 hover:bg-blue-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Sample
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
