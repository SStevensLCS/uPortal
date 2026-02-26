'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Textarea,
} from '@admissions-compass/ui';
import { useToast } from '@admissions-compass/ui';
import { ArrowLeft, Loader2, Save, Upload } from 'lucide-react';
import Link from 'next/link';
import { useSchool, useUpdateSchool } from '@/hooks/use-school';

const SCHOOL_ID = '00000000-0000-0000-0000-000000000001';

export default function BrandingPage() {
  const { data: school, isLoading } = useSchool(SCHOOL_ID);
  const updateSchool = useUpdateSchool(SCHOOL_ID);
  const { toast } = useToast();

  const [primaryColor, setPrimaryColor] = useState('#1e40af');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (school) {
      const settings = school.settings as Record<string, string> | undefined;
      setPrimaryColor(settings?.primary_color ?? '#1e40af');
      setSecondaryColor(settings?.secondary_color ?? '#f59e0b');
      setWelcomeMessage(settings?.portal_welcome_message ?? '');
    }
  }, [school]);

  const handleSave = () => {
    updateSchool.mutate(
      {
        settings: {
          ...((school?.settings as Record<string, unknown>) ?? {}),
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          portal_welcome_message: welcomeMessage,
        },
      },
      {
        onSuccess: () => {
          setIsDirty(false);
          toast({
            title: 'Branding updated',
            description: 'Your branding settings have been saved.',
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to save branding settings.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branding</h1>
          <p className="text-muted-foreground">
            Customize the look and feel of your parent portal.
          </p>
        </div>
      </div>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
          <CardDescription>
            Choose the primary and secondary colors for your portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="primary_color"
                  value={primaryColor}
                  onChange={(e) => {
                    setPrimaryColor(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-10 w-14 cursor-pointer rounded border"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => {
                    setPrimaryColor(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="#1e40af"
                  className="max-w-[150px] font-mono"
                />
                <div
                  className="h-10 flex-1 rounded-md border"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="secondary_color"
                  value={secondaryColor}
                  onChange={(e) => {
                    setSecondaryColor(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-10 w-14 cursor-pointer rounded border"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => {
                    setSecondaryColor(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="#f59e0b"
                  className="max-w-[150px] font-mono"
                />
                <div
                  className="h-10 flex-1 rounded-md border"
                  style={{ backgroundColor: secondaryColor }}
                />
              </div>
            </div>
          </div>

          {/* Preview swatch */}
          <div className="mt-4 space-y-2">
            <Label>Preview</Label>
            <div className="flex gap-2 rounded-lg border p-4">
              <div
                className="flex h-12 w-32 items-center justify-center rounded-md text-sm font-medium text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Primary
              </div>
              <div
                className="flex h-12 w-32 items-center justify-center rounded-md text-sm font-medium text-white"
                style={{ backgroundColor: secondaryColor }}
              >
                Secondary
              </div>
              <div
                className="flex h-12 flex-1 items-center justify-center rounded-md text-sm font-medium"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                  border: `1px solid ${primaryColor}30`,
                }}
              >
                Background Accent
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>School Logo</CardTitle>
          <CardDescription>
            Upload your school logo. Recommended size: 512x512px, PNG or SVG
            format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
              {school?.logo_url ? (
                <img
                  src={school.logo_url}
                  alt="School logo"
                  className="h-full w-full rounded-lg object-contain"
                />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Button variant="outline" type="button">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <p className="text-sm text-muted-foreground">
                PNG, SVG, or JPEG. Max 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle>Portal Welcome Message</CardTitle>
          <CardDescription>
            This message is displayed to parents when they first log into the
            admissions portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={welcomeMessage}
            onChange={(e) => {
              setWelcomeMessage(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Welcome to our admissions portal! We are excited to guide you through the enrollment process."
            rows={4}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {welcomeMessage.length} / 500 characters
          </p>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Link href="/settings">
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Link>
        <Button
          onClick={handleSave}
          disabled={!isDirty || updateSchool.isPending}
        >
          {updateSchool.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
