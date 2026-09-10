import type { TaskRepository } from '../../application/ports.ts';
import type { Task } from '../../domain/entities/task.ts';

// Browser storage port implementation. All DOM access lives in this layer;
// application code only ever sees the TaskRepository interface.
// Invalid or corrupt persisted data fails soft to an empty list.

const STORAGE_PREFIX = 'react-template:tasks';

export class LocalStorageTaskRepository implements TaskRepository {
  constructor(
    private readonly storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = globalThis.localStorage,
    private readonly key: string = STORAGE_PREFIX,
  ) {}

  async load(): Promise<readonly Task[]> {
    try {
      const raw = this.storage.getItem(this.key);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isTask);
    } catch {
      return [];
    }
  }

  async save(tasks: readonly Task[]): Promise<void> {
    try {
      this.storage.setItem(this.key, JSON.stringify(tasks));
    } catch {
      // Quota errors and privacy modes must not crash the app; the feature degrades to in-memory.
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.removeItem(this.key);
    } catch {
      // Same policy as save: ignore and continue.
    }
  }
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    (candidate.status === 'active' || candidate.status === 'done') &&
    typeof candidate.createdAt === 'number'
  );
}