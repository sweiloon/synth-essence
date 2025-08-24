
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  Plus,
  Trash2,
  Link,
  Unlink,
  FileText,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';

interface KnowledgeFile {
  id: string;
  name: string;
  size: string;
  type: string;
  linked: boolean;
  uploadedAt: string;
  file?: File;
}

interface KnowledgeBaseProps {
  avatarId: string;
  isTraining: boolean;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ avatarId, isTraining }) => {
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<KnowledgeFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load files from localStorage on component mount
  React.useEffect(() => {
    const savedFiles = localStorage.getItem(`avatar_${avatarId}_knowledge`);
    if (savedFiles) {
      setKnowledgeFiles(JSON.parse(savedFiles));
    }
  }, [avatarId]);

  // Save files to localStorage whenever knowledgeFiles changes
  React.useEffect(() => {
    localStorage.setItem(`avatar_${avatarId}_knowledge`, JSON.stringify(knowledgeFiles));
  }, [knowledgeFiles, avatarId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== files.length) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF files are allowed in the knowledge base.",
        variant: "destructive"
      });
      return;
    }

    const newFiles: KnowledgeFile[] = pdfFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: 'PDF',
      linked: false, // Default to unlinked
      uploadedAt: new Date().toISOString(),
      file
    }));

    setKnowledgeFiles(prev => [...prev, ...newFiles]);

    toast({
      title: "Files Uploaded",
      description: `${newFiles.length} file(s) uploaded successfully. Link them to make available to your avatar.`,
    });

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleLinkStatus = (fileId: string) => {
    if (isTraining) {
      toast({
        title: "Cannot Modify During Training",
        description: "Please wait for training to complete before modifying knowledge base.",
        variant: "destructive"
      });
      return;
    }

    setKnowledgeFiles(prev =>
      prev.map(file => {
        if (file.id === fileId) {
          const newLinked = !file.linked;
          toast({
            title: newLinked ? "File Linked" : "File Unlinked",
            description: newLinked 
              ? `${file.name} is now available to your avatar.`
              : `${file.name} has been removed from avatar's knowledge.`,
          });
          return { ...file, linked: newLinked };
        }
        return file;
      })
    );
  };

  const handleDownload = (file: KnowledgeFile) => {
    if (file.file) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      toast({
        title: "Download Not Available",
        description: "File content is not available for download.",
        variant: "destructive"
      });
    }
  };

  const confirmDelete = (file: KnowledgeFile) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!fileToDelete) return;

    if (isTraining) {
      toast({
        title: "Cannot Delete During Training",
        description: "Please wait for training to complete before deleting files.",
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
      setFileToDelete(null);
      return;
    }

    setKnowledgeFiles(prev => prev.filter(file => file.id !== fileToDelete.id));
    toast({
      title: "File Deleted",
      description: `${fileToDelete.name} has been permanently removed.`,
    });
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  const linkedCount = knowledgeFiles.filter(file => file.linked).length;
  const totalCount = knowledgeFiles.length;

  return (
    <>
      <Card className="card-modern">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Knowledge Base
              </CardTitle>
              <CardDescription>
                Manage PDF documents for your avatar's knowledge
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {linkedCount}/{totalCount} linked
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isTraining}
              >
                <Plus className="mr-2 h-4 w-4" />
                Upload PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="space-y-4">
            {/* Upload Area - Show when no files */}
            {knowledgeFiles.length === 0 && (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Upload Knowledge Documents</h3>
                <p className="text-muted-foreground mb-4">
                  Add PDF documents to give your avatar specialized knowledge
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-hero"
                  disabled={isTraining}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose PDF Files
                </Button>
              </div>
            )}

            {/* Files List */}
            {knowledgeFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Uploaded Documents ({knowledgeFiles.length})</h4>
                  {isTraining && (
                    <Badge variant="destructive" className="text-xs">
                      Training in progress - modifications disabled
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  {knowledgeFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={file.linked ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {file.linked ? "Linked" : "Not Linked"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{file.size}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLinkStatus(file.id)}
                          disabled={isTraining}
                          title={file.linked ? "Unlink from knowledge base" : "Link to knowledge base"}
                        >
                          {file.linked ? (
                            <Unlink className="h-4 w-4" />
                          ) : (
                            <Link className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(file)}
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => confirmDelete(file)}
                          disabled={isTraining}
                          className="text-destructive hover:text-destructive"
                          title="Delete file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Knowledge Base Management</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Link:</strong> Makes the document available to your avatar for referencing</li>
                <li>• <strong>Unlink:</strong> Removes the document from avatar's active knowledge (avatar "forgets")</li>
                <li>• <strong>Delete:</strong> Permanently removes the file from your knowledge base</li>
                <li>• Only linked documents are used by your avatar during conversations</li>
                <li>• Knowledge base changes are disabled during training to prevent conflicts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Knowledge File"
        description="Are you sure you want to permanently delete"
        itemName={fileToDelete?.name}
      />
    </>
  );
};
