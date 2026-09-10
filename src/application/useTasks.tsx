import { createContext, type ReactNode, useContext } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { TaskFilter } from '../domain/entities/task.ts';
import { filterTasks, taskStats } from '../domain/rules/tasks.ts';
import type { TasksStore } from './stores/createTasksStore.ts';

// The provider binds one store instance to the tree; main.tsx creates it
// with the real adapters, tests create one with fakes.

const TasksStoreContext = createContext<TasksStore | null>(null);

export function TasksStoreProvider({ store, children }: { store: TasksStore; children: ReactNode }) {
  return <TasksStoreContext.Provider value={store}>{children}</TasksStoreContext.Provider>;
}

// The component-facing API. One subscription per field keeps rerenders minimal;
// useShallow groups the stable action references.

export function useTasks() {
  const store = useContext(TasksStoreContext);
  if (!store) throw new Error('useTasks requires a TasksStoreProvider.');

  const tasks = useStore(store, (state) => state.tasks);
  const loaded = useStore(store, (state) => state.loaded);
  const actions = useStore(
    store,
    useShallow((state) => ({
      addTask: state.addTask,
      toggleTask: state.toggleTask,
      setTaskStatus: state.setTaskStatus,
      removeTask: state.removeTask,
      clearDone: state.clearDone,
    })),
  );

  return {
    tasks,
    loaded,
    stats: taskStats(tasks),
    selectTasks: (filter: TaskFilter) => filterTasks(tasks, filter),
    ...actions,
  };
}
