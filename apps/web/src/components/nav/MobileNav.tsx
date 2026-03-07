import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Github,
  Menu,
  X,
  BarChart3,
  Target,
  Timer,
  Sparkles,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from './DesktopSidebar';

export function MobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Primary destinations for the bottom bar
  const primaryDestinations = [
    { label: 'Overview', to: '/', icon: LayoutDashboard },
    { label: 'Projects', to: '/projects', icon: FolderGit2 },
    { label: 'Tasks', to: '/tasks', icon: CheckSquare },
    { label: 'GitHub', to: '/github', icon: Github },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop & Panel */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative z-50 w-full rounded-t-xl border-t border-border bg-card p-5 shadow-2xl animate-in slide-in-from-bottom-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-sm font-semibold tracking-tight">Navigation</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <div className="pt-2 border-t border-border/60">
                <NavLink
                  to="/settings"
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )
                  }
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Navigation Bar for Mobile Viewports */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 border-t border-border bg-card/90 backdrop-blur-md px-2 flex items-center justify-around select-none">
        {primaryDestinations.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors gap-0.5',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium text-muted-foreground hover:text-foreground gap-0.5"
        >
          <Menu className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
