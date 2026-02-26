'use client';

import { useState } from 'react';
import { Bell, GraduationCap, LogOut, Settings, User } from 'lucide-react';
import { StudentSwitcher } from './student-switcher';

export function TopBar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationCount] = useState(2);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-lg md:h-16 md:px-6">
      {/* Left: Logo on mobile, empty on desktop (sidebar has logo) */}
      <div className="flex items-center gap-2 md:hidden">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="text-sm font-bold text-foreground">
          Admissions Compass
        </span>
      </div>

      {/* Center / Left on desktop: Student switcher */}
      <div className="hidden md:flex md:items-center">
        <StudentSwitcher />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Student switcher on mobile (compact) */}
        <div className="md:hidden">
          <StudentSwitcher />
        </div>

        {/* Notification bell */}
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-accent"
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notificationCount > 0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Profile menu - desktop only */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex h-11 items-center gap-2 rounded-lg px-2 transition-colors hover:bg-accent"
            aria-expanded={showProfileMenu}
            aria-haspopup="menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              SJ
            </div>
            <span className="text-sm font-medium text-foreground">
              Sarah Johnson
            </span>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
                aria-hidden="true"
              />
              <div
                className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border bg-popover p-1 shadow-md"
                role="menu"
              >
                <div className="border-b px-3 py-2">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">
                    sarah.johnson@email.com
                  </p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full min-h-[40px] items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full min-h-[40px] items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full min-h-[40px] items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive transition-colors hover:bg-accent"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
