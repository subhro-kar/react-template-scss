import { existsSync, readFileSync } from 'node:fs';

// Build-time env validation, run before `dev` and `build`:
// - VITE_ENABLE_* flags must be known (catches VITE_ENABLE_TASK typos that
//   would otherwise silently disable a feature)
// - flag values must be exactly 'true' or 'false'
// - every VITE_* key must use the SNAKE_CASE shape Vite expects

// Keep in sync with src/application/featureFlags.ts.
const KNOWN_FLAGS = new Set(['VITE_ENABLE_TASKS']);

function readEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

const fileEnv = { ...readEnvFile('.env'), ...readEnvFile('.env.local') };
const env = { ...fileEnv, ...process.env };

const errors = [];
for (const [key, value] of Object.entries(env)) {
  if (!key.startsWith('VITE_')) continue;
  if (!/^VITE_[A-Z][A-Z0-9_]*$/.test(key)) {
    errors.push(`${key}: VITE_ keys must be UPPER_SNAKE_CASE.`);
    continue;
  }
  if (key.startsWith('VITE_ENABLE_')) {
    if (!KNOWN_FLAGS.has(key)) errors.push(`${key}: unknown flag. Known flags: ${[...KNOWN_FLAGS].join(', ')}.`);
    if (value !== 'true' && value !== 'false') errors.push(`${key}=${value}: flags must be 'true' or 'false'.`);
  }
}

if (errors.length > 0) {
  console.error(`Invalid environment configuration:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
  process.exit(1);
}
console.log(
  `Environment OK (${Object.keys(fileEnv).filter((key) => key.startsWith('VITE_')).length} VITE_ variable(s) checked).`,
);
