import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Header } from '@/components/nav/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Play, Pause, Square, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface FocusSession {
  _id: string;
  projectId?: { _id: string; name: string };
  taskId?: { _id: string; title: string };
  duration: number;
  status: string;
  notes?: string;
  startedAt: string;
}

export function FocusPage() {
  const queryClient = useQueryClient();
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [notes, setNotes] = useState('');

  const { data: sessionsData } = useQuery<{ sessions: FocusSession[] }>({
    queryKey: ['focus-sessions'],
    queryFn: () => api.get<{ sessions: FocusSession[] }>('/focus'),
  });

  const { data: projectsData } = useQuery<{ projects: Array<{ _id: string; name: string }> }>({
    queryKey: ['projects'],
    queryFn: () => api.get<{ projects: any[] }>('/projects'),
  });

  const startMutation = useMutation({
    mutationFn: (data: any) => api.post('/focus', data),
    onSuccess: (res: any) => {
      setCurrentSessionId(res.session._id);
      setIsActive(true);
      queryClient.invalidateQueries({ queryKey: ['focus-sessions'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.patch(`/focus/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      if (currentSessionId) {
        updateMutation.mutate({
          id: currentSessionId,
          data: { status: 'completed', duration: targetMinutes, notes },
        });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining, currentSessionId, targetMinutes, notes]);

  const toggleTimer = () => {
    if (!isActive) {
      if (!currentSessionId) {
        startMutation.mutate({
          duration: targetMinutes,
          projectId: selectedProjectId || undefined,
          notes,
        });
      } else {
        setIsActive(true);
      }
    } else {
      setIsActive(false);
    }
  };

  const finishSession = () => {
    setIsActive(false);
    if (currentSessionId) {
      const elapsedMinutes = Math.max(1, Math.round((targetMinutes * 60 - secondsRemaining) / 60));
      updateMutation.mutate({
        id: currentSessionId,
        data: { status: 'completed', duration: elapsedMinutes, notes },
      });
      setCurrentSessionId(null);
      setSecondsRemaining(targetMinutes * 60);
      setNotes('');
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setCurrentSessionId(null);
    setSecondsRemaining(targetMinutes * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const sessions = sessionsData?.sessions || [];
  const projectOptions = [
    { value: '', label: 'General / No Project' },
    ...(projectsData?.projects || []).map((p) => ({ value: p._id, label: p.name })),
  ];

  return (
    <div className="animate-in fade-in duration-200">
      <Header title="Focus Mode" context="Distraction-free deep work session" />

      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 text-center">
        {/* Minimal Focus Area */}
        <div className="pt-6 space-y-6">
          {/* Project association selector */}
          <div className="max-w-xs mx-auto">
            <Select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              options={projectOptions}
              disabled={isActive}
            />
          </div>

          {/* Large Digital Clock Display */}
          <div className="py-6">
            <div className="text-6xl md:text-8xl font-bold font-mono tracking-tight text-foreground select-none">
              {formatTime(secondsRemaining)}
            </div>
            <p className="mt-2 text-xs text-muted-foreground uppercase font-mono tracking-wider">
              {isActive ? 'Session Active — Stay in Flow' : 'Ready to begin'}
            </p>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={toggleTimer}
              className="h-12 px-8 text-sm gap-2 font-semibold shadow-md"
            >
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isActive ? 'Pause' : 'Start Focus'}</span>
            </Button>

            {currentSessionId && (
              <Button variant="outline" size="lg" onClick={finishSession} className="h-12 px-5 text-sm gap-2">
                <Square className="h-4 w-4 fill-current" />
                <span>Finish</span>
              </Button>
            )}

            {!isActive && secondsRemaining !== targetMinutes * 60 && (
              <Button variant="ghost" size="icon" onClick={resetTimer} className="h-12 w-12" title="Reset">
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Quick Preset Buttons */}
          {!isActive && !currentSessionId && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setTargetMinutes(mins);
                    setSecondsRemaining(mins * 60);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    targetMinutes === mins
                      ? 'bg-muted text-foreground font-semibold border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          )}

          {/* Session Notes Input */}
          <div className="max-w-md mx-auto pt-2">
            <input
              type="text"
              placeholder="Session notes (e.g. refactor cache layer)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-center text-xs h-9 bg-card/50 border border-input rounded-md px-3 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Recent Focus History */}
        <div className="pt-8 border-t border-border/60 text-left space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Completed Sessions
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Total: {sessions.reduce((acc, s) => acc + (s.duration || 0), 0)} mins
            </span>
          </div>

          <Card className="divide-y divide-border/60">
            {sessions.slice(0, 5).map((session) => (
              <div key={session._id} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">
                      {session.projectId?.name || 'General Focus'}
                    </span>
                    {session.notes && (
                      <span className="text-muted-foreground ml-2">— {session.notes}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
                  <span>{session.duration} min</span>
                  <span>{formatRelativeTime(session.startedAt)}</span>
                </div>
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No recorded focus sessions yet today. Start one above!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
