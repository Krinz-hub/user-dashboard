import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Header } from '@/components/nav/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatRelativeTime } from '@/lib/utils';
import {
  Github,
  GitCommit,
  GitPullRequest,
  Star,
  GitFork,
  RefreshCw,
  ExternalLink,
  Flame,
} from 'lucide-react';

interface GitHubProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
}

interface GitHubRepoItem {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string;
  private: boolean;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  updatedAt: string;
}

interface GitHubStats {
  totalCommits: number;
  totalPullRequests: number;
  totalRepositories: number;
  streakDays: number;
  languages: Array<{ name: string; percentage: number; color: string }>;
  weeklyActivity: Array<{ day: string; commits: number }>;
}

export function GitHubPage() {
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: profileLoading } = useQuery<{ profile: GitHubProfile }>({
    queryKey: ['github-profile'],
    queryFn: () => api.get<{ profile: GitHubProfile }>('/github/profile'),
  });

  const { data: reposData, isLoading: reposLoading } = useQuery<{ repos: GitHubRepoItem[] }>({
    queryKey: ['github-repos'],
    queryFn: () => api.get<{ repos: GitHubRepoItem[] }>('/github/repos'),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery<{ stats: GitHubStats }>({
    queryKey: ['github-stats'],
    queryFn: () => api.get<{ stats: GitHubStats }>('/github/stats'),
  });

  const syncMutation = useMutation({
    mutationFn: () => api.post('/github/sync'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-profile'] });
      queryClient.invalidateQueries({ queryKey: ['github-repos'] });
      queryClient.invalidateQueries({ queryKey: ['github-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const isLoading = profileLoading || reposLoading || statsLoading;

  if (isLoading) {
    return (
      <div>
        <Header title="GitHub Insights" />
        <div className="p-4 md:p-8 space-y-6">
          <Skeleton className="h-28 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const profile = profileData?.profile;
  const repos = reposData?.repos || [];
  const stats = statsData?.stats;

  return (
    <div className="animate-in fade-in duration-200">
      <Header
        title="GitHub"
        context="Synchronized activity and repository telemetry"
        actionLabel="Sync Now"
        onAction={() => syncMutation.mutate()}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Connected Profile Summary */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatarUrl}
              alt={profile?.username}
              className="h-12 w-12 rounded-full border border-border/80 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-foreground">{profile?.name}</h2>
                <span className="text-xs text-muted-foreground font-mono">@{profile?.username}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{profile?.bio}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => syncMutation.mutate()}
            isLoading={syncMutation.isPending}
            className="text-xs gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Repos</span>
          </Button>
        </div>

        {/* 4 Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Total Commits</span>
            <div className="mt-2 text-2xl font-semibold tracking-tight font-mono">
              {stats?.totalCommits.toLocaleString()}
            </div>
            <span className="mt-1 text-[11px] text-muted-foreground block">Across connected repos</span>
          </Card>

          <Card className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Pull Requests</span>
            <div className="mt-2 text-2xl font-semibold tracking-tight font-mono">
              {stats?.totalPullRequests}
            </div>
            <span className="mt-1 text-[11px] text-muted-foreground block">Merged & reviewed</span>
          </Card>

          <Card className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Repositories</span>
            <div className="mt-2 text-2xl font-semibold tracking-tight font-mono">
              {stats?.totalRepositories}
            </div>
            <span className="mt-1 text-[11px] text-muted-foreground block">Active codebases</span>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Commit Streak</span>
              <Flame className="h-4 w-4 text-warning" />
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight font-mono text-warning">
              {stats?.streakDays} Days
            </div>
            <span className="mt-1 text-[11px] text-muted-foreground block">Continuous shipping</span>
          </Card>
        </div>

        {/* Contribution Heatmap Preview & Language Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Heatmap Activity */}
          <Card className="lg:col-span-2 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Weekly Contribution Velocity</h3>
              <span className="text-xs text-muted-foreground font-mono">Past 7 days</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {stats?.weeklyActivity.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-full h-20 rounded-md bg-primary/10 border border-primary/20 flex items-end justify-center pb-2 hover:bg-primary/20 transition-colors group relative"
                  >
                    <div
                      className="w-full bg-primary rounded-b-md transition-all"
                      style={{ height: `${Math.min(100, (day.commits / 15) * 100)}%` }}
                    />
                    <span className="absolute bottom-1 text-[10px] font-mono text-primary-foreground font-semibold">
                      {day.commits}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Languages Breakdown */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Language Distribution</h3>
            <div className="space-y-3 pt-2">
              {stats?.languages.map((lang) => (
                <div key={lang.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{lang.name}</span>
                    <span className="text-muted-foreground font-mono">{lang.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Synchronized Repositories List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Tracked Repositories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <Card key={repo.id} className="p-4 flex flex-col justify-between hover:border-border/80 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-foreground hover:text-primary transition-colors truncate flex items-center gap-1.5"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    <Badge variant={repo.private ? 'secondary' : 'outline'} className="text-[9px]">
                      {repo.private ? 'Private' : 'Public'}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[11px] font-mono">{repo.language}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" /> {repo.forks}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
