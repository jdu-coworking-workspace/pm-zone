import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    workspaceId: z.string(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    status: z.enum(['ACTIVE', 'PLANNING', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).optional(),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    status: z.enum(['ACTIVE', 'PLANNING', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).optional(),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    progress: z.number().min(0).max(100).optional(),
  }),
});
