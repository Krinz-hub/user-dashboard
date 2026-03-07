import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth.context';
import { AppLayout } from '@/layouts/AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ProjectsPage } from '@/features/projects/ProjectsPage';
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage';
import { TasksPage } from '@/features/tasks/TasksPage';
import { GitHubPage } from '@/features/github/GitHubPage';
import { GoalsPage } from '@/features/goals/GoalsPage';
import { FocusPage } from '@/features/focus/FocusPage';
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage';
import { AIPage } from '@/features/ai/AIPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { AuthPage } from '@/features/auth/AuthPage';

export function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" replace />} />

      <Route element={user ? <AppLayout /> : <Navigate to="/auth" replace />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/github" element={<GitHubPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/focus" element={<FocusPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
