import { z } from 'zod';

const createProjectInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must contain at least 2 characters.')
    .max(80, 'Name must contain at most 80 characters.'),
});

const projectIdSchema = z.string().uuid('Invalid project ID.');

type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export { createProjectInputSchema, projectIdSchema };
export type { CreateProjectInput };
