import {
  archiveProject,
  createProject,
  listProjects,
} from '@/features/projects/server/projects.service';

import { describe, expect, it } from 'vitest';

import { projectFactory } from './factories';

describe('projects service', () => {
  it('creates and lists an active project', async () => {
    const created = await createProject({ name: 'Integration project' });

    const projects = await listProjects();

    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      id: created.id,
      name: 'Integration project',
      status: 'active',
    });
  });

  it('excludes archived projects', async () => {
    const project = await projectFactory();

    await archiveProject(project.id);

    await expect(listProjects()).resolves.toEqual([]);
  });
});
