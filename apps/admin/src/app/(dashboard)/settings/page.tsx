'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@admissions-compass/ui';
import {
  School,
  Palette,
  GraduationCap,
  CalendarDays,
  Users,
} from 'lucide-react';

const SETTINGS_SECTIONS = [
  {
    title: 'School Profile',
    description:
      'Manage your school name, contact information, address, and general settings.',
    href: '/settings/school',
    icon: School,
  },
  {
    title: 'Branding',
    description:
      'Customize your portal colors, upload your logo, and set your welcome message.',
    href: '/settings/branding',
    icon: Palette,
  },
  {
    title: 'Grades & Divisions',
    description:
      'Configure the grade levels your school offers and organize them into divisions.',
    href: '/settings/grades',
    icon: GraduationCap,
  },
  {
    title: 'Enrollment Seasons',
    description:
      'Create and manage enrollment seasons, set date ranges, and configure capacity.',
    href: '/settings/seasons',
    icon: CalendarDays,
  },
  {
    title: 'Staff & Permissions',
    description:
      'Invite staff members, assign roles, and manage access permissions.',
    href: '/settings/staff',
    icon: Users,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure school settings, manage team members, customize workflows,
          and set up integrations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SETTINGS_SECTIONS.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
