// Build-time feature flags, mirroring .env.example:
//   VITE_ENABLE_TASKS=false hides the tasks feature and its route.
//
// A flag must default to false in code so a missing .env never leaks a
// half-built feature; .env.example documents the opt-in. Vite inlines these
// constants at build time — there is no runtime toggle. scripts/validate-env.mjs
// fails the dev server and build when a flag name is misspelled or its value
// is not 'true'/'false'. Types come from src/vite-env.d.ts.

export interface FeatureFlags {
  readonly tasks: boolean;
}

function flag(value: 'true' | 'false' | undefined): boolean {
  return value === 'true';
}

export const featureFlags: FeatureFlags = {
  tasks: flag(import.meta.env.VITE_ENABLE_TASKS),
};
