import 'server-only';

import { cache } from 'react';

import { listProjects } from './projects.service';

const listProjectsQuery = cache(async () => listProjects());

export { listProjectsQuery };
