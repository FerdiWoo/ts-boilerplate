import 'server-only';

import { env } from '@/env';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

// prepare:false is required when using Neon's pooled connection string.
const client = postgres(env.DATABASE_URL, { prepare: false });

const db = drizzle(client, { schema });

async function closeDatabaseConnection() {
  await client.end({ timeout: 5 });
}

export { closeDatabaseConnection, db };
