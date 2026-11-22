import 'server-only';

import { db } from '@/server/db';
import { projects } from '@/server/db/schema';

import { desc, eq } from 'drizzle-orm';

type CreateProjectRecord = {
  name: string;
  slug: string;
};

async function createProjectRecord(input: CreateProjectRecord) {
  const [created] = await db.insert(projects).values(input).returning();
  return created;
}

async function listActiveProjectRecords() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.status, 'active'))
    .orderBy(desc(projects.createdAt));
}

async function archiveProjectRecord(projectId: string) {
  const [archived] = await db
    .update(projects)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(projects.id, projectId))
    .returning({ id: projects.id });

  return archived ?? null;
}

export { archiveProjectRecord, createProjectRecord, listActiveProjectRecords };
