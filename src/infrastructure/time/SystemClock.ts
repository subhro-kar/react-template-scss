import type { Clock } from '../../application/ports.ts';

// Wall-clock adapter. Injectable so tests can pin time and components
// never call Date directly outside the domain rules that receive it.

export class SystemClock implements Clock {
  now(): number {
    return Date.now();
  }
}
