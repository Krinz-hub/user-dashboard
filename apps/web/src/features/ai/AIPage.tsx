import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Header } from '@/components/nav/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, ArrowRight, CheckCircle2, FileText, SplitSquareVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AIPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<'planner' | 'breakdown' | 'review'>('planner');

  // Planner state
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<any[] | null>(null);

  // Task breakdown state
  const [taskTitle, setTaskTitle] = useState('');
  const [generatedBreakdown, setGeneratedBreakdown] = useState<any[] | null>(null);

  // Review state
  const [weeklyReview, setWeeklyReview] = useState<any | null>(null);

  const planMutation = useMutation({
    mutationFn: () => api.post('/ai/plan', { name: projectName, description: projectDesc }),
    onSuccess: (res: any) => setGeneratedPlan(res.plan),
  });

  const breakdownMutation = useMutation({
    mutationFn: () => api.post('/ai/breakdown', { title: taskTitle }),
    onSuccess: (res: any) => setGeneratedBreakdown(res.breakdown),
  });

  const reviewMutation = useMutation({
    mutationFn: () => api.get('/ai/weekly-review'),
    onSuccess: (res: any) => setWeeklyReview(res.report),
  });

  const createProjectFromPlan = async () => {
    if (!projectName.trim()) return;
    await api.post('/projects', {
      name: projectName,
      description: projectDesc,
      status: 'Planning',
      progress: 0,
      technologies: ['Architecture', 'API', 'UI'],
    });
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    navigate('/projects');
  };

  const addTasksFromBreakdown = async () => {
    if (!generatedBreakdown) return;
    for (const item of generatedBreakdown) {
      await api.post('/tasks', {
        title: item.title,
        priority: item.priority,
        status: 'Todo',
      });
    }
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    navigate('/tasks');
  };

  return (
    <div className="animate-in fade-in duration-200">
      <Header
        title="AI Assistant Layer"
        context="Practical project planning, task decomposition, and weekly retrospectives"
      />

      <div className="p-4 md:p-8 space-y-6 max-w-4xl">
        {/* Tool Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Button
            variant={activeTool === 'planner' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTool('planner')}
            className="text-xs gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" /> Project Planner
          </Button>
          <Button
            variant={activeTool === 'breakdown' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTool('breakdown')}
            className="text-xs gap-1.5"
          >
            <SplitSquareVertical className="h-3.5 w-3.5" /> Task Breakdown
          </Button>
          <Button
            variant={activeTool === 'review' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveTool('review');
              if (!weeklyReview) reviewMutation.mutate();
            }}
            className="text-xs gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" /> Weekly Review
          </Button>
        </div>

        {/* 1. PROJECT PLANNER */}
        {activeTool === 'planner' && (
          <div className="space-y-5">
            <Card className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Generate Structured Project Plan</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Input your initiative to generate phased architecture steps and milestones.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  label="Project Title"
                  placeholder="e.g. Distributed In-Memory Cache with Raft"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <Input
                  label="Technical Scope / Notes"
                  placeholder="High throughput, snapshotting, cluster discovery..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={() => planMutation.mutate()}
                  isLoading={planMutation.isPending}
                  disabled={!projectName.trim()}
                  className="gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Generate Plan
                </Button>
              </div>
            </Card>

            {generatedPlan && (
              <Card className="p-5 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Generated Phased Milestones
                  </h4>
                  <Button size="sm" onClick={createProjectFromPlan} className="text-xs">
                    Create Project from this Plan
                  </Button>
                </div>

                <div className="space-y-3">
                  {generatedPlan.map((step) => (
                    <div key={step.step} className="p-3 rounded-md bg-muted/40 border border-border/40 text-xs">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">
                          {step.step}
                        </span>
                        {step.title}
                      </div>
                      <p className="mt-1 text-muted-foreground ml-6 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* 2. TASK BREAKDOWN */}
        {activeTool === 'breakdown' && (
          <div className="space-y-5">
            <Card className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Task Decomposition</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Break down large user stories or complex features into discrete engineering tasks.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  label="Feature / Epic Title"
                  placeholder="e.g. Implement Zero-Trust OAuth 2.0 PKCE Flow"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={() => breakdownMutation.mutate()}
                  isLoading={breakdownMutation.isPending}
                  disabled={!taskTitle.trim()}
                  className="gap-1.5"
                >
                  <SplitSquareVertical className="h-3.5 w-3.5" /> Decompose into Tasks
                </Button>
              </div>
            </Card>

            {generatedBreakdown && (
              <Card className="p-5 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actionable Task Steps
                  </h4>
                  <Button size="sm" onClick={addTasksFromBreakdown} className="text-xs">
                    Add all to Tasks Board
                  </Button>
                </div>

                <div className="divide-y divide-border/60">
                  {generatedBreakdown.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-mono">{item.estimatedHours}h est</span>
                        <Badge
                          variant={
                            item.priority === 'High' ? 'warning' : 'secondary'
                          }
                          className="text-[9px]"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* 3. WEEKLY REVIEW */}
        {activeTool === 'review' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Automated Weekly Retrospective</h3>
                <p className="text-xs text-muted-foreground">Synthesized from real project and commit telemetry.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => reviewMutation.mutate()}
                isLoading={reviewMutation.isPending}
              >
                Regenerate
              </Button>
            </div>

            {weeklyReview && (
              <Card className="p-6 space-y-5 animate-in fade-in">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</h4>
                  <p className="mt-1 text-xs text-foreground leading-relaxed">{weeklyReview.summary}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Highlights
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {weeklyReview.highlights.map((h: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-md bg-warning/10 border border-warning/20 text-xs">
                  <span className="font-semibold text-warning">Potential Bottleneck: </span>
                  <span className="text-muted-foreground">{weeklyReview.possibleBottleneck}</span>
                </div>

                <div className="p-3 rounded-md bg-primary/10 border border-primary/20 text-xs">
                  <span className="font-semibold text-primary">Recommended Next Focus: </span>
                  <span className="text-muted-foreground">{weeklyReview.recommendedFocus}</span>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
