import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Header } from '@/components/nav/Header';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, CheckCircle2, Clock, GitCommit } from 'lucide-react';

interface AnalyticsData {
  range: string;
  velocity: {
    completedTasks: number;
    totalCommits: number;
    focusHoursTotal: number;
    velocityChangePercentage: string;
  };
  projectDistribution: Array<{ name: string; percentage: number; color: string }>;
  activityTrend: Array<{
    label: string;
    commits: number;
    tasksCompleted: number;
    focusMinutes: number;
  }>;
}

export function AnalyticsPage() {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const { data, isLoading, isError, error, refetch } = useQuery<{ analytics: AnalyticsData }>({
    queryKey: ['analytics', range],
    queryFn: () => api.get<{ analytics: AnalyticsData }>(`/analytics?range=${range}`),
  });

  const ranges: Array<{ id: '7d' | '30d' | '90d' | '1y'; label: string }> = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' },
  ];

  if (isLoading) {
    return (
      <div>
        <Header title="Analytics" />
        <div className="p-4 md:p-8 space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !data?.analytics) {
    return (
      <div>
        <Header title="Analytics" />
        <div className="p-4 md:p-8">
          <ErrorState
            title="Couldn't load analytics"
            message={error instanceof Error ? error.message : 'Please check your connection.'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  const analytics = data.analytics;

  return (
    <div className="animate-in fade-in duration-200">
      <Header
        title="Analytics"
        context="Developer velocity, completion metrics, and output distribution"
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1">
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors select-none ${
                  range === r.id
                    ? 'bg-muted text-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Velocity Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Tasks Completed</span>
            <div className="mt-2 text-2xl font-semibold tracking-tight font-mono text-foreground">
              {analytics.velocity.completedTasks}
            </div>
            <span className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>{analytics.velocity.velocityChangePercentage} vs prior</span>
            </span>
          </Card>

          <Card className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Git Commits</span>
            <div className="mt-2 text-2xl font-semibold tracking-tight font-mono text-foreground">
              {analytics.velocity.totalCommits}
            </div>
            <span className="mt-1 text-[11px] text-muted-foreground">Recorded in timeframe</span>
          </Card>

          <Card className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Focus Hours</span>
            <div className="mt-2 text-2xl font-semibold tracking-tight font-mono text-foreground">
              {analytics.velocity.focusHoursTotal}h
            </div>
            <span className="mt-1 text-[11px] text-muted-foreground">Logged deep work</span>
          </Card>

          <Card className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Output Momentum</span>
            <div className="mt-2 text-2xl font-semibold tracking-tight font-mono text-primary">
              High
            </div>
            <span className="mt-1 text-[11px] text-muted-foreground">Consistent cadence</span>
          </Card>
        </div>

        {/* Primary Velocity Chart (Commits & Focus) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Work Cadence & Commits ({range})
            </h3>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.activityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="commitsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="commits"
                  name="Commits"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#commitsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Project Attention Distribution */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Project Attention Share</h3>
          <div className="space-y-3 pt-2">
            {analytics.projectDistribution.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="text-muted-foreground font-mono">{item.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
