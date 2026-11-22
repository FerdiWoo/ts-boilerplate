import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

import * as schema from './schema';

const CONNECTION_OPTIONS = { max: 1, prepare: false } as const;

let client: Sql | undefined;
let database: PostgresJsDatabase<typeof schema> | undefined;

function resolveTestDatabaseUrl() {
  const url = process.env.TEST_DB_URL;
  if (!url) {
    throw new Error('TEST_DB_URL must be set before using the test database.');
  }
  return url;
}

function ensureDatabase() {
  if (!client) {
    client = postgres(resolveTestDatabaseUrl(), CONNECTION_OPTIONS);
  }
  if (!database) {
    database = drizzle(client, { schema });
  }
  return database;
}

const testDb = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, property, receiver) {
    const instance = ensureDatabase();
    const value = Reflect.get(instance as object, property, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

async function resetTestDatabaseConnection() {
  await closeTestDatabaseConnection();
  client = postgres(resolveTestDatabaseUrl(), CONNECTION_OPTIONS);
  database = drizzle(client, { schema });
}

async function closeTestDatabaseConnection() {
  if (!client) return;

  const connection = client;
  client = undefined;
  database = undefined;

  try {
    await connection.end({ timeout: 0 });
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !/closed|terminating/i.test(error.message)
    ) {
      throw error;
    }
  }
}

export { closeTestDatabaseConnection, resetTestDatabaseConnection, testDb };
