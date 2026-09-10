import type { TaskRepository } from '../../application/ports.ts';

// Minimal typed fetch wrapper for JSON APIs. Replace with the real endpoints
// of your project and keep this shape: ports in, promises out, no DOM leaks.

export class HttpTaskRepository implements TaskRepository {
  constructor(private readonly baseUrl: string) {}

  async load(): Promise<never> {
    throw new Error(`HttpTaskRepository is a placeholder: wire ${this.baseUrl}/tasks to your backend.`);
  }

  async save(): Promise<never> {
    throw new Error('HttpTaskRepository is a placeholder: implement save against your backend.');
  }
}
