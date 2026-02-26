'use client';

import { Camera, Mail, Phone, MapPin, Shield, Bell } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Separator,
  Badge,
} from '@admissions-compass/ui';

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Profile header */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                SJ
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted transition-colors hover:bg-accent"
                aria-label="Change profile photo"
              >
                <Camera className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Name and email */}
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-foreground">
                Sarah Johnson
              </h2>
              <p className="text-sm text-muted-foreground">
                Parent / Guardian
              </p>
              <Badge variant="secondary" className="mt-2">
                2 students enrolled
              </Badge>
            </div>

            <div className="sm:ml-auto">
              <Button variant="outline" className="min-h-[44px]">
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
          <CardDescription>
            How schools will reach you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">sarah.johnson@email.com</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">(555) 123-4567</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium">
                123 Main Street, Springfield, IL 62704
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Email notifications</span>
                <Badge variant="secondary">On</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>SMS notifications</span>
                <Badge variant="outline">Off</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Deadline reminders</span>
                <Badge variant="secondary">On</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Security
            </CardTitle>
            <CardDescription>Account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0 md:p-6 md:pt-0">
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px] w-full"
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px] w-full"
            >
              Enable Two-Factor Auth
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
