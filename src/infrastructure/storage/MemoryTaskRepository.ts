import type { TaskRepository } from '../../application/ports.ts';
import type { Task } from '../../domain/entities/task.ts';

// In-memory port implementation: the default for tests and for features
// whose persistence is not part of the test contract.

export class MemoryTaskRepository implements TaskRepository {
  private tasks: readonly Task[] = [];

  constructor(initial: readonly Task[] = []) {
    this.tasks = initial;
  }

  async load(): Promise<readonly Task[]> {
    return [...this.tasks];
  }

  async save(tasks: readonly Task[]): Promise<void> {
    this.tasks = [...tasks];
  }
}