import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Github,
  BarChart3,
  Target,
  Timer,
  Sparkles,
  Settings,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const navItems = [
  { label: 'Overview', to: '/', icon: LayoutDashboard },
  { label: 'Projects', to: '/projects', icon: FolderGit2 },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'GitHub', to: '/github', icon: Github },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Goals', to: '/goals', icon: Target },
  { label: 'Focus', to: '/focus', icon: Timer },
  { label: 'AI Planner', to: '/ai', icon: Sparkles },
];

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card/50 backdrop-blur-sm shrink-0 select-none min-h-screen">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-5 border-b border-border/60 gap-2.5">
        <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
          <Terminal className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-foreground">DevOS</span>
          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">v0.1-preview</span>
        </div>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/15'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Nav / Settings */}
      <div className="p-3 border-t border-border/60">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all',
              isActive
                ? 'bg-primary/10 text-primary font-semibold border border-primary/15'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )
          }
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
