import type { Task, TaskFilter, TaskStatus } from '../entities/task.ts';

const MAX_TITLE_LENGTH = 120;

export function validateTitle(rawTitle: string): string {
  const title = rawTitle.trim();
  if (title.length === 0) throw new Error('A task title cannot be empty.');
  if (title.length > MAX_TITLE_LENGTH) throw new Error(`A task title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
  return title;
}

export function createTask(id: string, rawTitle: string, createdAt: number): Task {
  if (id.length === 0) throw new Error('A task needs a non-empty id.');
  if (!Number.isFinite(createdAt)) throw new Error('A task needs a finite creation timestamp.');
  return { id, title: validateTitle(rawTitle), status: 'active', createdAt };
}

export function withStatus(task: Task, status: TaskStatus): Task {
  if (task.status === status) return task;
  return { ...task, status };
}

export function toggleStatus(task: Task): Task {
  return withStatus(task, task.status === 'active' ? 'done' : 'active');
}

export function filterTasks(tasks: readonly Task[], filter: TaskFilter): readonly Task[] {
  if (filter === 'all') return tasks;
  return tasks.filter(task => task.status === filter);
}

export interface TaskStats {
  readonly total: number;
  readonly active: number;
  readonly done: number;
}

export function taskStats(tasks: readonly Task[]): TaskStats {
  const done = tasks.reduce((count, task) => count + (task.status === 'done' ? 1 : 0), 0);
  return { total: tasks.length, active: tasks.length - done, done };
}