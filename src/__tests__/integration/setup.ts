import path from 'node:path';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import {
  GenericContainer,
  type StartedTestContainer,
  Wait,
} from 'testcontainers';
import { afterAll, beforeAll, beforeEach, vi } from 'vitest';

const DB_USER = 'test_user';
const DB_PASSWORD = 'test_password';
const DB_NAME = `ts_boilerplate_it_${process.pid}`;
const POSTGRES_IMAGE =
  process.env.TESTCONTAINERS_POSTGRES_IMAGE ?? 'postgres:17-alpine';

let containerPromise: Promise<StartedTestContainer> | undefined;
let container: StartedTestContainer | undefined;

function dockerNotRunningError(error: unknown) {
  const details =
    error instanceof Error ? `\n${error.message}` : '\nUnknown Docker error.';
  return new Error(
    'Docker must be running to execute integration tests. Start Docker Desktop and try again.' +
      details,
    { cause: error }
  );
}

async function ensureTestContainer() {
  if (container) return container;

  if (!containerPromise) {
    containerPromise = (async () => {
      try {
        const started = await new GenericContainer(POSTGRES_IMAGE)
          .withEnvironment({
            POSTGRES_USER: DB_USER,
            POSTGRES_PASSWORD: DB_PASSWORD,
            POSTGRES_DB: DB_NAME,
          })
          .withTmpFs({ '/var/lib/postgresql/data': 'rw' })
          .withExposedPorts(5432)
          .withWaitStrategy(
            Wait.forLogMessage(
              'database system is ready to accept connections',
              2
            )
          )
          .start();

        container = started;
        const url = `postgresql://${DB_USER}:${DB_PASSWORD}@${started.getHost()}:${started.getMappedPort(5432)}/${DB_NAME}`;
        process.env.TEST_DB_URL = url;
        process.env.DATABASE_URL = url;
        return started;
      } catch (error) {
        containerPromise = undefined;
        if (
          error instanceof Error &&
          /(?:ECONNREFUSED|ECONNRESET|ENOENT|Docker is not running|working container runtime strategy)/i.test(
            error.message
          )
        ) {
          throw dockerNotRunningError(error);
        }
        throw error;
      }
    })();
  }

  return containerPromise;
}

function testDatabaseUrl() {
  const url = process.env.TEST_DB_URL;
  if (!url) throw new Error('Integration database has not been started.');
  return url;
}

async function applyMigrations() {
  const client = postgres(testDatabaseUrl(), { max: 1, prepare: false });
  const migrationDb = drizzle(client);

  try {
    await migrate(migrationDb, {
      migrationsFolder: path.join(process.cwd(), 'drizzle'),
    });
  } finally {
    await client.end({ timeout: 0 });
  }
}

async function truncateApplicationTables() {
  const client = postgres(testDatabaseUrl(), { max: 1, prepare: false });

  try {
    const tables = await client<{ tablename: string }[]>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `;
    if (!tables.length) return;

    const tableList = tables
      .map(({ tablename }) => `"public"."${tablename}"`)
      .join(', ');
    await client.unsafe(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`);
  } finally {
    await client.end({ timeout: 0 });
  }
}

vi.mock('@/server/db', async () => {
  await ensureTestContainer();
  const { testDb } = await import('@/server/db/test-db');
  return { db: testDb };
});

beforeAll(async () => {
  await ensureTestContainer();
  await applyMigrations();
});

beforeEach(async () => {
  vi.clearAllMocks();
  await truncateApplicationTables();
});

afterAll(async () => {
  const { closeTestDatabaseConnection } = await import('@/server/db/test-db');
  await closeTestDatabaseConnection();

  if (container) {
    await container.stop();
    container = undefined;
    containerPromise = undefined;
  }
});
