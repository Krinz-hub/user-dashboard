import React, { useState } from 'react';
import { useAuth } from '@/features/auth/auth.context';
import { Header } from '@/components/nav/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Github, CheckCircle2, ShieldCheck, Sun, Moon } from 'lucide-react';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || 'Lead Developer');
  const [focusDuration, setFocusDuration] = useState('25');
  const [breakDuration, setBreakDuration] = useState('5');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-200">
      <Header title="Settings" context="Preferences, integrations, and workspace configuration" />

      <div className="p-4 md:p-8 space-y-6 max-w-3xl">
        {/* Profile Card */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Developer Profile</h3>
          <form onSubmit={handleSave} className="space-y-3">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              value={user?.email || 'developer@devos.local'}
              disabled
            />
            <div className="pt-2">
              <Button size="sm" type="submit">
                {saved ? 'Changes Saved' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Focus Mode Preferences */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Focus Preferences</h3>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Default Focus Block"
              value={focusDuration}
              onChange={(e) => setFocusDuration(e.target.value)}
              options={[
                { value: '15', label: '15 minutes' },
                { value: '25', label: '25 minutes (Pomodoro)' },
                { value: '45', label: '45 minutes' },
                { value: '60', label: '60 minutes' },
              ]}
            />
            <Select
              label="Short Break"
              value={breakDuration}
              onChange={(e) => setBreakDuration(e.target.value)}
              options={[
                { value: '5', label: '5 minutes' },
                { value: '10', label: '10 minutes' },
                { value: '15', label: '15 minutes' },
              ]}
            />
          </div>
        </Card>

        {/* GitHub Connection */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                <Github className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground">GitHub Integration</h4>
                <p className="text-[11px] text-muted-foreground">Connected to account for telemetry sync</p>
              </div>
            </div>
            <Badge variant="success" className="text-[10px]">
              Connected
            </Badge>
          </div>
        </Card>

        {/* Security & Session */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Security & Session</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                JWT token session with server-side authorization validation.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="text-xs text-destructive">
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
