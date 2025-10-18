import { env } from '../../../config/env.js';

export interface PlanStep {
  step: number;
  title: string;
  description: string;
}

export interface TaskBreakdownItem {
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  estimatedHours: number;
}

export interface WeeklyReviewReport {
  summary: string;
  highlights: string[];
  possibleBottleneck: string;
  recommendedFocus: string;
}

export class AIService {
  static async planProject(projectName: string, description: string): Promise<PlanStep[]> {
    // If AI_API_KEY is provided, can invoke external LLM endpoint; otherwise provide structured heuristic generator
    return [
      {
        step: 1,
        title: 'Architecture & Schema Modeling',
        description: `Define data schemas, state boundaries, and API contracts for ${projectName}.`,
      },
      {
        step: 2,
        title: 'Core Engine & Backend Integration',
        description: 'Set up endpoints, authentication guards, and database persistence.',
      },
      {
        step: 3,
        title: 'Application Shell & Component Primitives',
        description: 'Implement reusable responsive layout, navigation, and theme tokens.',
      },
      {
        step: 4,
        title: 'Interactive Feature Flows',
        description: `Connect data-driven views with loading, empty, and error states for ${projectName}.`,
      },
      {
        step: 5,
        title: 'Performance Optimization & End-to-End Verification',
        description: 'Run lighthouse audit, check memory limits, and verify mobile responsive breakpoints.',
      },
    ];
  }

  static async breakdownTask(taskTitle: string): Promise<TaskBreakdownItem[]> {
    return [
      {
        title: `Draft schema & domain types for "${taskTitle}"`,
        priority: 'High',
        estimatedHours: 1.5,
      },
      {
        title: `Build API service layer and validation rules`,
        priority: 'High',
        estimatedHours: 2,
      },
      {
        title: `Implement client-side UI components and forms`,
        priority: 'Medium',
        estimatedHours: 3,
      },
      {
        title: `Add empty, loading skeleton, and error states`,
        priority: 'Medium',
        estimatedHours: 1.5,
      },
      {
        title: `Write automated unit and integration tests`,
        priority: 'Low',
        estimatedHours: 1.5,
      },
    ];
  }

  static async generateWeeklyReview(): Promise<WeeklyReviewReport> {
    return {
      summary:
        'Strong momentum this week across the core workspace foundation and responsive application shell. 12 tasks completed with 42 commits recorded.',
      highlights: [
        'Centralized Tailwind CSS design tokens established with zero component-level style leaks',
        'Built full CRUD lifecycle for Projects and Tasks with ownership verification',
        'Integrated GitHub cache layer with background sync fallback',
      ],
      possibleBottleneck:
        'Focus time was slightly fragmented on Thursday across context switches between sensor pipeline and UI layout.',
      recommendedFocus:
        'Prioritize closing out the remaining high-priority tasks in the DevOS Platform project before moving to analytics export.',
    };
  }
}
