'use client';

import { useState } from 'react';
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@admissions-compass/ui';
import {
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Eye,
} from 'lucide-react';

type DocumentStatus = 'uploaded' | 'verified' | 'rejected';

interface Document {
  id: string;
  name: string;
  document_type: string;
  file_type: string;
  size: number;
  status: DocumentStatus;
  uploaded_at: string;
  verified_at: string | null;
  rejection_reason: string | null;
  url: string;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  transcript: 'Transcript',
  test_score: 'Test Score',
  photo: 'Student Photo',
  passport: 'Passport / ID',
  visa: 'Visa Document',
  iep_504: 'IEP / 504',
  portfolio: 'Portfolio',
  medical: 'Medical',
  other: 'Other',
};

const STATUS_CONFIG: Record<DocumentStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  icon: typeof Clock;
}> = {
  uploaded: { label: 'Uploaded', variant: 'secondary', icon: Clock },
  verified: { label: 'Verified', variant: 'default', icon: CheckCircle2 },
  rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
};

// Mock documents
const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    name: 'Emma_Thompson_Transcript_2025-2026.pdf',
    document_type: 'transcript',
    file_type: 'application/pdf',
    size: 245_760,
    status: 'verified',
    uploaded_at: '2026-01-15T10:30:00Z',
    verified_at: '2026-01-16T09:00:00Z',
    rejection_reason: null,
    url: '#',
  },
  {
    id: 'doc-002',
    name: 'ISEE_Score_Report.pdf',
    document_type: 'test_score',
    file_type: 'application/pdf',
    size: 189_440,
    status: 'verified',
    uploaded_at: '2026-01-20T14:15:00Z',
    verified_at: '2026-01-21T10:30:00Z',
    rejection_reason: null,
    url: '#',
  },
  {
    id: 'doc-003',
    name: 'emma_school_photo.jpg',
    document_type: 'photo',
    file_type: 'image/jpeg',
    size: 1_536_000,
    status: 'uploaded',
    uploaded_at: '2026-02-10T08:45:00Z',
    verified_at: null,
    rejection_reason: null,
    url: '#',
  },
  {
    id: 'doc-004',
    name: 'birth_certificate_scan.pdf',
    document_type: 'passport',
    file_type: 'application/pdf',
    size: 3_072_000,
    status: 'rejected',
    uploaded_at: '2026-02-05T16:20:00Z',
    verified_at: null,
    rejection_reason: 'Image is too blurry to read. Please upload a clearer scan.',
    url: '#',
  },
  {
    id: 'doc-005',
    name: 'art_portfolio_samples.pdf',
    document_type: 'portfolio',
    file_type: 'application/pdf',
    size: 8_192_000,
    status: 'uploaded',
    uploaded_at: '2026-02-18T11:00:00Z',
    verified_at: null,
    rejection_reason: null,
    url: '#',
  },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentListProps {
  applicationId?: string;
}

export function DocumentList({ applicationId: _applicationId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const handleDelete = (doc: Document) => {
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    setDeleteTarget(null);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-orange-500" />;
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">No Documents Uploaded</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your first document using the form above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Uploaded Documents</CardTitle>
          <CardDescription>
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded.{' '}
            {documents.filter((d) => d.status === 'verified').length} verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {documents.map((doc) => {
            const statusConfig = STATUS_CONFIG[doc.status];
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedDoc === doc.id;

            return (
              <div
                key={doc.id}
                className="rounded-lg border transition-colors hover:bg-accent/30"
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    {getFileIcon(doc.file_type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                      </Badge>
                      <span>{formatFileSize(doc.size)}</span>
                      <span>
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant={statusConfig.variant} className="shrink-0 text-xs">
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusConfig.label}
                  </Badge>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setExpandedDoc(isExpanded ? null : doc.id)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a href={doc.url} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(doc)}
                      disabled={doc.status === 'verified'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t px-3 py-2">
                    {doc.status === 'rejected' && doc.rejection_reason && (
                      <div className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                        <strong>Rejection reason:</strong> {doc.rejection_reason}
                      </div>
                    )}
                    {doc.status === 'verified' && doc.verified_at && (
                      <p className="text-xs text-muted-foreground">
                        Verified on {new Date(doc.verified_at).toLocaleDateString()}
                      </p>
                    )}
                    {doc.status === 'uploaded' && (
                      <p className="text-xs text-muted-foreground">
                        Awaiting verification by the admissions team.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
