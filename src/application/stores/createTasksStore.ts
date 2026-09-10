import { create, type StoreApi } from 'zustand';
import type { Task } from '../../domain/entities/task.ts';
import { createTask, toggleStatus, withStatus } from '../../domain/rules/tasks.ts';
import type { Dependencies } from '../ports.ts';

export interface TasksStoreState {
  readonly tasks: readonly Task[];
  readonly loaded: boolean;
  hydrate: () => Promise<void>;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  setTaskStatus: (id: string, status: Task['status']) => void;
  removeTask: (id: string) => void;
  clearDone: () => void;
}

export type TasksStore = StoreApi<TasksStoreState>;

// Store factory pattern: main.tsx constructs the adapters and passes them in,
// so actions can call domain rules and persist through the port. A store
// factory keeps zustand stores testable — tests create one with fakes.

export function createTasksStore({ taskRepository, idGenerator, clock }: Dependencies): TasksStore {
  const store = create<TasksStoreState>()((set, getState) => ({
    tasks: [],
    loaded: false,
    hydrate: async () => {
      // One repository read at startup; a failure must never wedge the UI on "Loading…".
      const tasks = await taskRepository.load().catch(() => [] as readonly Task[]);
      set({ tasks, loaded: true });
    },
    addTask: (title) => {
      const task = createTask(idGenerator.next(), title, clock.now());
      set((state) => ({ tasks: [...state.tasks, task] }));
      void taskRepository.save(getState().tasks);
    },
    toggleTask: (id) => {
      set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? toggleStatus(task) : task)) }));
      void taskRepository.save(getState().tasks);
    },
    setTaskStatus: (id, status) => {
      set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? withStatus(task, status) : task)) }));
      void taskRepository.save(getState().tasks);
    },
    removeTask: (id) => {
      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
      void taskRepository.save(getState().tasks);
    },
    clearDone: () => {
      set((state) => ({ tasks: state.tasks.filter((task) => task.status === 'active') }));
      void taskRepository.save(getState().tasks);
    },
  }));

  return store;
}
