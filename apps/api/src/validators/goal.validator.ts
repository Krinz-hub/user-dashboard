import { z } from 'zod';

export const createGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Goal title is required').max(200),
    period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('weekly'),
    target: z.number().min(1),
    current: z.number().min(0).default(0),
    deadline: z.string().datetime().optional().nullable(),
  }),
});

export const updateGoalSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    target: z.number().min(1).optional(),
    current: z.number().min(0).optional(),
    deadline: z.string().datetime().optional().nullable(),
    status: z.enum(['active', 'completed', 'missed']).optional(),
  }),
});
