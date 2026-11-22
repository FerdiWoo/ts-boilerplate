import { describe, expect, it } from 'vitest';

import { createProjectInputSchema } from './projects.schemas';

describe('createProjectInputSchema', () => {
  it('trims and accepts a valid name', () => {
    expect(createProjectInputSchema.parse({ name: '  Atlas  ' })).toEqual({
      name: 'Atlas',
    });
  });

  it('rejects a one-character name', () => {
    expect(createProjectInputSchema.safeParse({ name: 'A' }).success).toBe(
      false
    );
  });
});
