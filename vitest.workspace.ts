import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/shared',
  'packages/ui',
  'packages/database',
  'apps/admin',
  'apps/parent',
]);
