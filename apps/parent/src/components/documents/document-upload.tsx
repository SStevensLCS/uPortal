'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@admissions-compass/ui';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ACCEPTED_EXTENSIONS = '.pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx';

const DOCUMENT_TYPES = [
  { value: 'transcript', label: 'Transcript' },
  { value: 'test_score', label: 'Test Score Report' },
  { value: 'photo', label: 'Student Photo' },
  { value: 'passport', label: 'Passport / ID' },
  { value: 'visa', label: 'Visa Document' },
  { value: 'iep_504', label: 'IEP / 504 Plan' },
  { value: 'portfolio', label: 'Portfolio / Work Sample' },
  { value: 'medical', label: 'Medical Record' },
  { value: 'other', label: 'Other' },
];

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  document_type: string;
  preview_url: string | null;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
  error?: string;
}

interface DocumentUploadProps {
  applicationId?: string;
  onUploadComplete?: (file: UploadedFile) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUpload({
  applicationId: _applicationId,
  onUploadComplete,
}: DocumentUploadProps) {
  const [documentType, setDocumentType] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size (${formatFileSize(file.size)}) exceeds the maximum limit of 10MB.`;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload a PDF, image, or Word document.';
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadState({
        id: 'error',
        name: file.name,
        size: file.size,
        type: file.type,
        document_type: '',
        preview_url: null,
        status: 'error',
        progress: 0,
        error,
      });
      return;
    }

    setSelectedFile(file);
    setUploadState(null);

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;

    const uploadingFile: UploadedFile = {
      id: `doc-${Date.now()}`,
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      document_type: documentType,
      preview_url: previewUrl,
      status: 'uploading',
      progress: 0,
    };

    setUploadState(uploadingFile);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setUploadState((prev) => (prev ? { ...prev, progress: i } : null));
    }

    const completedFile: UploadedFile = {
      ...uploadingFile,
      status: 'uploaded',
      progress: 100,
    };

    setUploadState(completedFile);
    onUploadComplete?.(completedFile);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadState(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isUploading = uploadState?.status === 'uploading';
  const isUploaded = uploadState?.status === 'uploaded';
  const hasError = uploadState?.status === 'error';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload Document</CardTitle>
        <CardDescription>
          Upload required documents for the application. Max file size: 10MB.
          Accepted formats: PDF, images, DOC/DOCX.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Type Select */}
        <div className="space-y-2">
          <Label>Document Type</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Drop Zone */}
        {!isUploaded && (
          <div
            className={`relative rounded-lg border-2 border-dashed transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : hasError
                  ? 'border-destructive bg-destructive/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />

            {selectedFile && !hasError ? (
              <div className="p-6">
                {/* File Preview */}
                <div className="flex items-start gap-4">
                  {previewUrl ? (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border bg-muted">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    {isUploading && (
                      <div className="mt-2 space-y-1">
                        <Progress value={uploadState.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Uploading... {uploadState.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                  {!isUploading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClear}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer flex-col items-center gap-3 p-8"
              >
                {hasError ? (
                  <>
                    <AlertCircle className="h-10 w-10 text-destructive" />
                    <p className="text-sm font-medium text-destructive">
                      {uploadState?.error}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClear();
                      }}
                    >
                      Try Again
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        <span className="hidden md:inline">
                          Drag and drop your file here, or{' '}
                        </span>
                        <span className="text-primary underline">browse</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PDF, Images, DOC/DOCX up to 10MB
                      </p>
                    </div>
                    {/* Mobile-specific buttons */}
                    <div className="flex gap-2 md:hidden">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }}
                        className="min-h-[44px]"
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          // Would trigger camera on mobile
                          fileInputRef.current?.click();
                        }}
                        className="min-h-[44px]"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                  </>
                )}
              </label>
            )}
          </div>
        )}

        {/* Success State */}
        {isUploaded && (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-green-900">
                Document uploaded successfully
              </p>
              <p className="text-sm text-green-700">
                {uploadState.name} ({formatFileSize(uploadState.size)})
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Upload Another
            </Button>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && !isUploaded && !hasError && (
          <Button
            onClick={handleUpload}
            disabled={!documentType || isUploading}
            className="min-h-[44px] w-full sm:w-auto"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        )}

        {/* Size Limit Display */}
        <p className="text-xs text-muted-foreground">
          Maximum file size: 10MB. Supported formats: PDF, JPEG, PNG, GIF, WebP, DOC, DOCX
        </p>
      </CardContent>
    </Card>
  );
}
