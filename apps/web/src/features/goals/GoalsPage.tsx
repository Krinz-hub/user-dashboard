import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Header } from '@/components/nav/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Target, Plus, CheckCircle2, Circle } from 'lucide-react';

interface Goal {
  _id: string;
  title: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  target: number;
  current: number;
  status: 'active' | 'completed' | 'missed';
}

export function GoalsPage() {
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('weekly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [target, setTarget] = useState(5);

  const { data, isLoading, refetch } = useQuery<{ goals: Goal[] }>({
    queryKey: ['goals', selectedPeriod],
    queryFn: () => api.get<{ goals: Goal[] }>(`/goals?period=${selectedPeriod}`),
  });

  const createMutation = useMutation({
    mutationFn: (newGoal: any) => api.post('/goals', newGoal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setIsModalOpen(false);
      setTitle('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.patch(`/goals/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const goals = data?.goals || [];
  const periods = ['daily', 'weekly', 'monthly', 'yearly'];

  return (
    <div className="animate-in fade-in duration-200">
      <Header
        title="Goals"
        context="Measurable targets across daily, weekly, and yearly horizons"
        actionLabel="New Goal"
        onAction={() => setIsModalOpen(true)}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium capitalize transition-colors select-none ${
                selectedPeriod === p
                  ? 'bg-card text-foreground border border-border shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {p} Goals
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && goals.length === 0 && (
          <EmptyState
            icon={<Target className="h-8 w-8 text-muted-foreground/60" />}
            title={`No ${selectedPeriod} goals set`}
            description="Establish clear, measurable targets to keep development structured and focused."
            actionLabel="Set your first goal"
            onAction={() => {
              setPeriod(selectedPeriod as any);
              setIsModalOpen(true);
            }}
          />
        )}

        {/* Goals Grid */}
        {!isLoading && goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const isCompleted = goal.status === 'completed' || goal.current >= goal.target;

              return (
                <Card key={goal._id} className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground leading-snug">{goal.title}</h3>
                      <Badge variant={isCompleted ? 'success' : 'secondary'} className="text-[10px] shrink-0">
                        {isCompleted ? 'Completed' : 'Active'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>Progress</span>
                      <span>
                        {goal.current} / {goal.target} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: goal._id,
                          data: { current: Math.max(0, goal.current - 1) },
                        })
                      }
                      className="px-2 py-1 rounded text-xs text-muted-foreground hover:bg-muted"
                    >
                      -1
                    </button>
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: goal._id,
                          data: {
                            current: goal.current + 1,
                            status: goal.current + 1 >= goal.target ? 'completed' : 'active',
                          },
                        })
                      }
                      className="px-3 py-1 rounded text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      +1 Progress
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Set Target Goal"
        description="Add a measurable goal to track your development output."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({ title, period, target: Number(target) });
          }}
          className="space-y-4"
        >
          <Input
            label="Goal Title"
            placeholder="e.g. Ship 10 pull requests or complete 12 focus blocks"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Horizon"
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />

            <Input
              label="Target Number"
              type="number"
              min={1}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit" isLoading={createMutation.isPending}>
              Create Goal
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
