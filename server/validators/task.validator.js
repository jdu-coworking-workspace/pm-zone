import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    projectId: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    assigneeId: z.string().nullable().optional(),
    due_date: z.string().nullable().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    type: z.enum(['TASK', 'BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    assigneeId: z.string().optional(),
    due_date: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    type: z.enum(['TASK', 'BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  }),
});
