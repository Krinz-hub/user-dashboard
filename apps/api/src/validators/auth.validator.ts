import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    avatar: z.string().url().optional().or(z.literal('')),
    preferences: z
      .object({
        theme: z.enum(['dark', 'light']).optional(),
        focusDurationMinutes: z.number().min(5).max(120).optional(),
        breakDurationMinutes: z.number().min(1).max(30).optional(),
      })
      .optional(),
  }),
});
