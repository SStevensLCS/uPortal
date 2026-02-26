'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  CheckSquare,
  Calendar,
  MessageSquare,
  Star,
  Scale,
  FileSignature,
  BarChart3,
  Settings,
  Compass,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { cn, Button } from '@admissions-compass/ui';
import { useAppStore } from '@/stores/app-store';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Contacts', icon: Users, href: '/contacts' },
  { label: 'Applications', icon: FileText, href: '/applications' },
  { label: 'Forms', icon: ClipboardList, href: '/forms' },
  { label: 'Checklists', icon: CheckSquare, href: '/checklists' },
  { label: 'Calendar', icon: Calendar, href: '/calendar' },
  { label: 'Messages', icon: MessageSquare, href: '/messages' },
  { label: 'Reviews', icon: Star, href: '/reviews' },
  { label: 'Decisions', icon: Scale, href: '/decisions' },
  { label: 'Contracts', icon: FileSignature, href: '/contracts' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
  { label: 'Settings', icon: Settings, href: '/settings' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <Compass className="h-7 w-7 shrink-0 text-primary" />
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap text-lg font-semibold tracking-tight">
              Admissions Compass
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-accent-foreground'
                    )}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn('h-9 w-9', !sidebarCollapsed && 'ml-auto')}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}
