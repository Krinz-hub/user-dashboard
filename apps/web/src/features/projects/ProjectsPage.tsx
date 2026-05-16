import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Header } from '@/components/nav/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ProjectModal } from './ProjectModal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FolderGit2, Plus, ExternalLink, Search } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  repository?: string;
  technologies: string[];
  updatedAt: string;
}

export function ProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const isNewOpen = searchParams.get('new') === '1';

  const { data, isLoading, isError, error, refetch } = useQuery<{ projects: Project[] }>({
    queryKey: ['projects', selectedStatus],
    queryFn: () =>
      api.get<{ projects: Project[] }>(
        selectedStatus === 'All' ? '/projects' : `/projects?status=${selectedStatus}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newProject: any) => api.post('/projects', newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const filteredProjects = (data?.projects || []).filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.technologies?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const statuses = ['All', 'Building', 'Planning', 'Paused', 'Completed'];

  return (
    <div className="animate-in fade-in duration-200">
      <Header
        title="Projects"
        context="Active codebases and development initiatives"
        actionLabel="New Project"
        onAction={() => setSearchParams({ new: '1' })}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors select-none whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-card text-foreground border border-border shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-card/60 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Skeleton key={n} className="h-44 w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <ErrorState
            title="Couldn't load projects"
            message={error instanceof Error ? error.message : 'Please check your connection.'}
            onRetry={() => refetch()}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredProjects.length === 0 && (
          <EmptyState
            icon={<FolderGit2 className="h-8 w-8 text-muted-foreground/60" />}
            title={searchQuery ? 'No matching projects' : 'No projects yet'}
            description={
              searchQuery
                ? 'Try a different search term or clear the filter.'
                : 'DevOS helps you keep your development initiatives organized and focused.'
            }
            actionLabel={searchQuery ? undefined : 'Create your first project'}
            onAction={() => setSearchParams({ new: '1' })}
          />
        )}

        {/* Projects Grid */}
        {!isLoading && !isError && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <Card
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="p-5 cursor-pointer hover:border-primary/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {project.name}
                    </h3>
                    <Badge
                      variant={
                        project.status === 'Building'
                          ? 'default'
                          : project.status === 'Completed'
                          ? 'success'
                          : 'secondary'
                      }
                      className="text-[10px] shrink-0"
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Technologies tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/70 text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] text-muted-foreground font-mono self-center">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress bar and repository link */}
                <div className="mt-5 pt-3 border-t border-border/40 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <ProjectModal
        open={isNewOpen}
        onClose={() => {
          searchParams.delete('new');
          setSearchParams(searchParams);
        }}
        onSubmit={async (data) => {
          await createMutation.mutateAsync(data);
        }}
      />
    </div>
  );
}
