import { projects } from '@/server/db/schema';
import { testDb } from '@/server/db/test-db';

type ProjectInsert = typeof projects.$inferInsert;

async function projectFactory(overrides: Partial<ProjectInsert> = {}) {
  const suffix = crypto.randomUUID().slice(0, 8);
  const [created] = await testDb
    .insert(projects)
    .values({
      name: overrides.name ?? 'Test project',
      slug: overrides.slug ?? `test-project-${suffix}`,
      status: overrides.status ?? 'active',
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
      id: overrides.id,
    })
    .returning();

  if (!created) throw new Error('Project factory failed to create a record.');
  return created;
}

export { projectFactory };
