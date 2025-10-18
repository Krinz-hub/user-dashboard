import { z } from 'zod';

export const startFocusSessionSchema = z.object({
  body: z.object({
    projectId: z.string().optional().nullable(),
    taskId: z.string().optional().nullable(),
    duration: z.number().min(1).max(180).default(25),
    notes: z.string().max(1000).optional(),
  }),
});

export const updateFocusSessionSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(['active', 'completed', 'interrupted']).optional(),
    duration: z.number().min(1).optional(),
    notes: z.string().max(1000).optional(),
    endedAt: z.string().datetime().optional(),
  }),
});
