import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required').max(100),
    description: z.string().max(1000).optional().default(''),
    status: z.enum(['Planning', 'Building', 'Paused', 'Completed', 'Archived']).optional().default('Planning'),
    progress: z.number().min(0).max(100).optional().default(0),
    repository: z.string().url().optional().or(z.literal('')),
    technologies: z.array(z.string()).optional().default([]),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(['Planning', 'Building', 'Paused', 'Completed', 'Archived']).optional(),
    progress: z.number().min(0).max(100).optional(),
    repository: z.string().url().optional().or(z.literal('')),
    technologies: z.array(z.string()).optional(),
  }),
});
