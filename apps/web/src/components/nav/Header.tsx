import React from 'react';
import { useAuth } from '@/features/auth/auth.context';
import { Button } from '../ui/Button';
import { Sun, Moon, LogOut, Play, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  context?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function Header({ title, context, actionLabel, onAction }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('devos_theme', isDark ? 'dark' : 'light');
  };

  return (
    <header className="h-14 border-b border-border/60 bg-background/80 backdrop-blur-sm px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Context */}
      <div className="flex flex-col">
        <h1 className="text-sm md:text-base font-semibold text-foreground tracking-tight">{title}</h1>
        {context && <span className="text-[11px] text-muted-foreground hidden sm:inline-block">{context}</span>}
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {actionLabel && onAction && (
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}

        {/* Quick Focus Mode Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/focus')}
          className="hidden sm:inline-flex text-xs h-8 gap-1.5"
          title="Start Focus Session"
        >
          <Play className="h-3 w-3 text-primary fill-primary" />
          <span>Focus</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 text-muted-foreground"
          aria-label="Toggle Theme"
        >
          <Moon className="h-4 w-4 hidden dark:block" />
          <Sun className="h-4 w-4 block dark:hidden" />
        </Button>

        {/* User Account / Sign Out */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold uppercase">
            {user?.name?.charAt(0) || 'D'}
          </div>
          <button
            onClick={logout}
            className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
