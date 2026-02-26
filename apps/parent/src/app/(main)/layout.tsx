import { MobileNav } from '@/components/layout/mobile-nav';
import { DesktopSidebar } from '@/components/layout/desktop-sidebar';
import { TopBar } from '@/components/layout/top-bar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto pb-16 md:pb-0 px-4 py-4 md:px-6 md:py-6">
          {children}
        </main>
      </div>
      {/* Mobile bottom nav - hidden on desktop */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
