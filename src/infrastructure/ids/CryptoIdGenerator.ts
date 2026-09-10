import type { IdGenerator } from '../../application/ports.ts';

// Cryptographically unique ids without a dependency; crypto.randomUUID
// exists in all supported browsers, Node 22, and every modern worker.

export class CryptoIdGenerator implements IdGenerator {
  next(): string {
    return globalThis.crypto.randomUUID();
  }
}
