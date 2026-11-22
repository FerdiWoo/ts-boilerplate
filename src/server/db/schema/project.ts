import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { projectStatus } from './_enum';

const projects = pgTable(
  'project',
  {
    id: uuid('project_id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    status: projectStatus('status').default('active').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('project_status_created_at_idx').on(table.status, table.createdAt),
  ]
);

export { projects };
