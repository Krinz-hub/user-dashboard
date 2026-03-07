import React from 'react';
import { Outlet } from 'react-router-dom';
import { DesktopSidebar } from '../components/nav/DesktopSidebar';
import { MobileNav } from '../components/nav/MobileNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row antialiased overflow-x-hidden">
      {/* Desktop Sidebar (hidden on mobile) */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <main className="flex-1 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sticky Navigation (hidden on desktop) */}
      <MobileNav />
    </div>
  );
}
