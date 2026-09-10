import { useCallback, useEffect, useMemo, useReducer } from 'react';
import type { Task, TaskFilter } from '../domain/entities/task.ts';
import { createTask, filterTasks, taskStats, toggleStatus, withStatus } from '../domain/rules/tasks.ts';
import { useDependencies } from './DependenciesContext.tsx';

// Use cases own orchestration: load through the port, apply domain rules,
// persist the result. React lives in this layer; business rules do not.

interface TasksState {
  readonly tasks: readonly Task[];
  readonly loaded: boolean;
}

type TasksAction =
  | { type: 'loaded'; tasks: readonly Task[] }
  | { type: 'added'; task: Task }
  | { type: 'toggled'; id: string }
  | { type: 'statusSet'; id: string; status: Task['status'] }
  | { type: 'removed'; id: string }
  | { type: 'clearedDone' };

function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case 'loaded':
      return { tasks: action.tasks, loaded: true };
    case 'added':
      return { ...state, tasks: [...state.tasks, action.task] };
    case 'toggled':
      return { ...state, tasks: state.tasks.map(task => (task.id === action.id ? toggleStatus(task) : task)) };
    case 'statusSet':
      return { ...state, tasks: state.tasks.map(task => (task.id === action.id ? withStatus(task, action.status) : task)) };
    case 'removed':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.id) };
    case 'clearedDone':
      return { ...state, tasks: state.tasks.filter(task => task.status === 'active') };
  }
}

export function useTasks() {
  const { taskRepository, idGenerator, clock } = useDependencies();
  const [state, dispatch] = useReducer(tasksReducer, { tasks: [], loaded: false });

  useEffect(() => {
    let cancelled = false;
    taskRepository.load().then(tasks => {
      if (!cancelled) dispatch({ type: 'loaded', tasks });
    });
    return () => {
      cancelled = true;
    };
    // Load once through the port; later changes are persisted by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.loaded) return;
    void taskRepository.save(state.tasks);
  }, [state.loaded, state.tasks, taskRepository]);

  const addTask = useCallback(
    (title: string) => dispatch({ type: 'added', task: createTask(idGenerator.next(), title, clock.now()) }),
    [idGenerator, clock],
  );

  const toggleTask = useCallback((id: string) => dispatch({ type: 'toggled', id }), []);
  const removeTask = useCallback((id: string) => dispatch({ type: 'removed', id }), []);
  const clearDone = useCallback(() => dispatch({ type: 'clearedDone' }), []);

  const stats = useMemo(() => taskStats(state.tasks), [state.tasks]);
  const selectTasks = useCallback((filter: TaskFilter) => filterTasks(state.tasks, filter), [state.tasks]);

  const setTaskStatus = useCallback(
    (id: string, status: Task['status']) => dispatch({ type: 'statusSet', id, status }),
    [],
  );

  return { tasks: state.tasks, loaded: state.loaded, stats, addTask, toggleTask, removeTask, clearDone, selectTasks, setTaskStatus };
}