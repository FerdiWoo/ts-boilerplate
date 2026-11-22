import 'server-only';

import {
  createProjectInputSchema,
  projectIdSchema,
} from '../contracts/projects.schemas';
import {
  archiveProjectRecord,
  createProjectRecord,
  listActiveProjectRecords,
} from './projects.repository';

class ProjectNotFoundError extends Error {
  constructor() {
    super('Project not found.');
    this.name = 'ProjectNotFoundError';
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function createProject(input: unknown) {
  const parsed = createProjectInputSchema.parse(input);
  const suffix = crypto.randomUUID().slice(0, 8);

  return createProjectRecord({
    name: parsed.name,
    slug: `${slugify(parsed.name) || 'project'}-${suffix}`,
  });
}

async function listProjects() {
  return listActiveProjectRecords();
}

async function archiveProject(projectId: string) {
  const parsedId = projectIdSchema.parse(projectId);
  const archived = await archiveProjectRecord(parsedId);

  if (!archived) throw new ProjectNotFoundError();
  return archived;
}

export { archiveProject, createProject, listProjects, ProjectNotFoundError };
