# Optional Better Auth recipe

Better Auth is not required by this starter. Add it when the product needs user
accounts, sessions, OAuth, password login, organizations, or protected data.
For an anonymous prototype, public website, webhook service, or single-user
internal tool, leave it out until the requirement exists.

Install authentication as a complete vertical slice rather than scattering
provider, browser, and UI concerns across generic folders.

```text
src/features/auth/
├── actions/
├── client/
├── contracts/
└── ui/
src/server/auth/auth.ts
src/app/(public)/login/page.tsx
src/app/api/auth/[...all]/route.ts
src/server/db/schema/auth.ts
```

## 1. Install

```bash
npm install better-auth
```

Add these values to `.env.example` and `.env`:

```dotenv
BETTER_AUTH_SECRET="generate-at-least-32-random-characters"
BETTER_AUTH_URL="http://localhost:3000"
```

Add both fields to `src/env.ts`.

## 2. Generate the schema

Create `src/server/auth/auth.ts` first, then let the Better Auth CLI generate the
Drizzle tables into `src/server/db/schema/auth.ts`. Export them from the schema
barrel and generate a normal Drizzle migration.

```bash
npx auth@latest generate --config src/server/auth/auth.ts --output src/server/db/schema/auth.ts --yes
npm run db:generate
npm run db:migrate
```

Do not hand-maintain authentication tables unless there is a specific product
reason. Regenerate when adding a Better Auth plugin.

## 3. Server configuration

```ts
// src/server/auth/auth.ts
import { env } from '@/env';
import { db } from '@/server/db';
import * as schema from '@/server/db/schema';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.BETTER_AUTH_URL],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
  advanced: {
    database: { generateId: 'uuid' },
    useSecureCookies: env.NODE_ENV === 'production',
  },
});
```

## 4. Next.js route and client

```ts
// src/app/api/auth/[...all]/route.ts
import { auth } from '@/server/auth/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
```

```ts
// src/features/auth/client/auth.client.ts
'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient();
```

Add login forms and browser auth hooks under `src/features/auth`; keep the client
module free of server imports.

## 5. Protect the application boundary

Resolve and require the session in `src/app/(app)/layout.tsx`. Authenticate every
server action and route handler again because they are independently invocable
entry points. A proxy cookie check may provide an optimistic redirect, but it is
not an authorization boundary.

Keep the `nextCookies()` plugin last in the plugin list so server actions can
apply authentication cookies.

## References

- [Better Auth installation](https://better-auth.com/docs/installation)
- [Better Auth CLI](https://better-auth.com/docs/concepts/cli)
- [Better Auth Next.js integration](https://better-auth.com/docs/integrations/next)
