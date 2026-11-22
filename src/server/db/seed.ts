import { env } from '@/env';
import { logger } from '@/server/infrastructure/logger';

import { closeDatabaseConnection, db } from './index';
import { projects } from './schema';

async function seed() {
  if (env.NODE_ENV === 'production') {
    throw new Error('Database seeding is disabled in production.');
  }

  await db
    .insert(projects)
    .values({
      name: 'Example project',
      slug: 'example-project',
    })
    .onConflictDoNothing({ target: projects.slug });

  logger.info('Development database seeded');
}

seed()
  .catch((error: unknown) => {
    logger.error({ err: error }, 'Database seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });
