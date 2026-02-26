'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  ClipboardCheck,
  Calendar,
  MessageCircle,
  CreditCard,
  User,
  GraduationCap,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'My Applications', href: '/applications', icon: FileText },
  { label: 'Checklist', href: '/checklist', icon: ClipboardCheck },
  { label: 'Schedule', href: '/schedule', icon: Calendar },
  { label: 'Messages', href: '/messages', icon: MessageCircle },
  { label: 'Billing', href: '/billing', icon: CreditCard },
  { label: 'Profile', href: '/profile', icon: User },
] as const;

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-col border-r bg-background">
      {/* Logo area */}
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <GraduationCap className="h-7 w-7 text-primary" />
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight text-foreground">
            Admissions
          </span>
          <span className="text-xs font-medium leading-tight text-muted-foreground">
            Compass
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Sidebar navigation">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[40px] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          Admissions Compass v0.1
        </p>
      </div>
    </aside>
  );
}
