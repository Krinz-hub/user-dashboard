import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    title: z.string().min(1, 'Task title is required').max(200),
    description: z.string().max(2000).optional().default(''),
    status: z.enum(['Backlog', 'Todo', 'In Progress', 'Done']).optional().default('Todo'),
    priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional().default('Medium'),
    labels: z.array(z.string()).optional().default([]),
    dueDate: z.string().datetime().optional().nullable(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    projectId: z.string().optional().nullable(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    status: z.enum(['Backlog', 'Todo', 'In Progress', 'Done']).optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
    labels: z.array(z.string()).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    completedAt: z.string().datetime().optional().nullable(),
  }),
});
