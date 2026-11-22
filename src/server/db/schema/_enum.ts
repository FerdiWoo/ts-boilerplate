import { pgEnum } from 'drizzle-orm/pg-core';

const projectStatus = pgEnum('project_status', ['active', 'archived']);

export { projectStatus };
