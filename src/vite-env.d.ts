/// <reference types="vite/client" />

// Typed build environment. Every VITE_* variable in .env.example gets a
// field here, so import.meta.env access is checked by the compiler.
// Flags are 'true' | 'false' because they are literal strings in .env.

interface ImportMetaEnv {
  /** Example feature flag: gates the /tasks route. */
  readonly VITE_ENABLE_TASKS: 'true' | 'false' | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
