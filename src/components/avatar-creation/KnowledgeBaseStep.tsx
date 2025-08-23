
import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';

interface KnowledgeBaseStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const KnowledgeBaseStep = ({ data, onUpdate }: KnowledgeBaseStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      const newFiles = [...data.knowledgeFiles, ...pdfFiles];
      onUpdate({ knowledgeFiles: newFiles });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = data.knowledgeFiles.filter((_: File, i: number) => i !== index);
    onUpdate({ knowledgeFiles: newFiles });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Knowledge Base (Optional)</Label>
        <p className="text-sm text-muted-foreground">
          Upload PDF documents to provide your avatar with specialized knowledge and information.
        </p>
      </div>

      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Upload PDF Documents</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop PDF files here, or click to browse
              </p>
            </div>
            <Button onClick={() => fileInputRef.current?.click()}>
              Choose PDF Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {data.knowledgeFiles.length > 0 && (
        <div className="space-y-4">
          <Label>Uploaded Documents ({data.knowledgeFiles.length})</Label>
          <div className="space-y-2">
            {data.knowledgeFiles.map((file: File, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <File className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-blue-800">
            <Upload className="h-4 w-4" />
            Knowledge Base Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Upload product manuals, documentation, or reference materials</li>
            <li>• PDFs should be text-based (not scanned images) for best results</li>
            <li>• Larger files may take longer to process</li>
            <li>• Your avatar will be able to reference this information in conversations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBaseStep;
