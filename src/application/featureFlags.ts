// Build-time feature flags, mirroring .env.example:
//   VITE_ENABLE_TASKS=false hides the tasks feature and its route.
//
// A flag must default to false in code so a missing .env never leaks a
// half-built feature; .env.example documents the opt-in. Vite inlines these
// constants at build time — there is no runtime toggle.

export interface FeatureFlags {
  readonly tasks: boolean;
}

function flag(name: string): boolean {
  return import.meta.env[name] === 'true';
}

export const featureFlags: FeatureFlags = {
  tasks: flag('VITE_ENABLE_TASKS'),
};