import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Vitest + happy-dom provide the DOM; jest-dom adds the DOM matchers
// (toBeInTheDocument, toHaveClass, …). Component behavior comes from
// @testing-library/react. RTL's automatic cleanup requires global
// `afterEach`, which vitest doesn't expose by default — do it by hand.

afterEach(() => {
  cleanup();
});
