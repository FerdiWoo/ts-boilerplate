'use server';

import { revalidatePath } from 'next/cache';

import type { ActionState } from '@/lib/actions/action-state';
import { logger } from '@/server/infrastructure/logger';

import { createProjectInputSchema } from '../contracts/projects.schemas';
import { archiveProject, createProject } from '../server/projects.service';

async function createProjectAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = createProjectInputSchema.safeParse({
    name: formData.get('name'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please check the form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createProject(parsed.data);
    revalidatePath('/dashboard');
    return { status: 'success', message: 'Project created.' };
  } catch (error) {
    logger.error({ err: error }, 'Failed to create project');
    return { status: 'error', message: 'Project could not be created.' };
  }
}

async function archiveProjectAction(formData: FormData) {
  const projectId = formData.get('projectId');
  if (typeof projectId !== 'string') return;

  await archiveProject(projectId);
  revalidatePath('/dashboard');
}

export { archiveProjectAction, createProjectAction };
