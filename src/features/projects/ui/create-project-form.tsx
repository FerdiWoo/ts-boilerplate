'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { initialActionState } from '@/lib/actions/action-state';

import { createProjectAction } from '../actions/projects.actions';

function CreateProjectForm() {
  const [state, action, pending] = useActionState(
    createProjectAction,
    initialActionState
  );

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <div>
        <label className="sr-only" htmlFor="project-name">
          Project name
        </label>
        <Input
          aria-describedby={
            state.fieldErrors?.name?.[0] ? 'project-name-error' : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.name?.[0])}
          id="project-name"
          name="name"
          placeholder="New project name"
        />
        {state.fieldErrors?.name?.[0] ? (
          <p className="text-danger mt-2 text-sm" id="project-name-error">
            {state.fieldErrors.name[0]}
          </p>
        ) : null}
      </div>
      <Button disabled={pending} type="submit">
        {pending ? 'Creating…' : 'Create project'}
      </Button>
      {state.message ? (
        <p aria-live="polite" className="text-muted text-sm sm:col-span-2">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export { CreateProjectForm };
