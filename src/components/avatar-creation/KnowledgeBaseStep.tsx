
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Database } from 'lucide-react';

interface KnowledgeBaseStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const KnowledgeBaseStep: React.FC<KnowledgeBaseStepProps> = ({ data, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== files.length) {
      // Show error for non-PDF files
      return;
    }

    const currentFiles = data.knowledgeFiles || [];
    const updatedFiles = [...currentFiles, ...pdfFiles];
    onUpdate('knowledgeFiles', updatedFiles);
  };

  const removeFile = (index: number) => {
    const currentFiles = data.knowledgeFiles || [];
    const updatedFiles = currentFiles.filter((_: any, i: number) => i !== index);
    onUpdate('knowledgeFiles', updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Knowledge Base
        </CardTitle>
        <CardDescription>
          Upload PDF documents to give your avatar specialized knowledge (product manuals, guides, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Upload PDF Documents</h3>
          <p className="text-muted-foreground mb-4">
            Add knowledge documents that your avatar can reference and learn from
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-hero"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose PDF Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Supports PDF files up to 10MB each
          </p>
        </div>

        {/* File Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h4 className="font-medium mb-1">Document Types</h4>
            <p className="text-xs text-muted-foreground">
              Product manuals, guides, FAQs, policies, or any reference material
            </p>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h4 className="font-medium mb-1">File Format</h4>
            <p className="text-xs text-muted-foreground">
              PDF files only, maximum 10MB per file
            </p>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h4 className="font-medium mb-1">Processing</h4>
            <p className="text-xs text-muted-foreground">
              Documents will be processed and indexed for quick retrieval
            </p>
          </div>
        </div>

        {/* Uploaded Files List */}
        {data.knowledgeFiles && data.knowledgeFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              Uploaded Documents ({data.knowledgeFiles.length})
            </h4>
            <div className="space-y-2">
              {data.knowledgeFiles.map((file: File, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">PDF</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">How Knowledge Base Works</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Documents are processed and stored securely</li>
            <li>• Your avatar can reference this information during conversations</li>
            <li>• Knowledge is indexed for quick and accurate retrieval</li>
            <li>• You can add more documents anytime after creation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
