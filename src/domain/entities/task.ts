export type TaskStatus = 'active' | 'done';

export type TaskFilter = 'all' | TaskStatus;

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly status: TaskStatus;
  readonly createdAt: number;
}
