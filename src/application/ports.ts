import type { Task } from '../domain/entities/task.ts';

// Ports are the boundaries the application layer codes against.
// The infrastructure layer implements them; presentation wires them in.
// Keep every port minimal: only what a use case actually calls.

export interface TaskRepository {
  load(): Promise<readonly Task[]>;
  save(tasks: readonly Task[]): Promise<void>;
}

export interface IdGenerator {
  next(): string;
}

export interface Clock {
  now(): number;
}

export interface Dependencies {
  readonly taskRepository: TaskRepository;
  readonly idGenerator: IdGenerator;
  readonly clock: Clock;
}