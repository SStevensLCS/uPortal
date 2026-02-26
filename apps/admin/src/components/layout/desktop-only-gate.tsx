'use client';

import { useMediaQuery } from '@admissions-compass/ui';
import { Monitor } from 'lucide-react';

export function DesktopOnlyGate({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  if (!isDesktop) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background p-8 text-center">
        <Monitor className="mb-6 h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Desktop Browser Required
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Please use a desktop browser. Admissions Compass Admin requires a
          screen width of at least 1280px.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
