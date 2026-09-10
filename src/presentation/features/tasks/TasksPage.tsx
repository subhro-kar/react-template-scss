import { useState, type FormEvent } from 'react';
import { useTasks } from '../../../application/useTasks.ts';
import type { TaskFilter } from '../../../domain/entities/task.ts';
import { Button } from '../../components/Button.tsx';
import styles from './TasksPage.module.scss';

const FILTERS: readonly TaskFilter[] = ['all', 'active', 'done'];

// Presentation only: render state, forward intents to the use case.
// No business rules, no storage, no fetch — those live inward.

export function TasksPage() {
  const { tasks, loaded, stats, addTask, toggleTask, removeTask, clearDone, selectTasks } = useTasks();
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [error, setError] = useState('');

  const visible = selectTasks(filter);

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      addTask(draft);
      setDraft('');
      setError('');
    } catch (validation) {
      setError(validation instanceof Error ? validation.message : 'Invalid title.');
    }
  }

  if (!loaded) return <p className={styles.status}>Loading…</p>;

  return (
    <section>
      <h1>Tasks</h1>
      <p className={styles.stats}>
        {stats.done} done · {stats.active} active · {stats.total} total
      </p>

      <form className={styles.addRow} onSubmit={submit}>
        <input
          className={styles.input}
          value={draft}
          onChange={event => setDraft(event.target.value)}
          placeholder="What needs doing?"
          aria-label="New task title"
        />
        <Button type="submit">Add</Button>
      </form>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.filters} role="group" aria-label="Filter tasks">
        {FILTERS.map(value => (
          <label key={value}>
            <input type="radio" name="task-filter" checked={filter === value} onChange={() => setFilter(value)} />
            {value}
          </label>
        ))}
      </div>

      <ul className={styles.list}>
        {visible.map(task => (
          <li key={task.id} className={styles.item}>
            <label className={styles.itemLabel}>
              <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={() => toggleTask(task.id)}
                aria-label={`Mark "${task.title}" ${task.status === 'done' ? 'active' : 'done'}`}
              />
              <span className={task.status === 'done' ? styles.done : undefined}>{task.title}</span>
            </label>
            <Button variant="danger" onClick={() => removeTask(task.id)} aria-label={`Delete "${task.title}"`}>
              ✕
            </Button>
          </li>
        ))}
        {visible.length === 0 && <li className={styles.status}>Nothing here yet.{draft && ' Add the task above.'}</li>}
      </ul>

      {stats.done > 0 && (
        <Button variant="secondary" onClick={clearDone}>
          Clear {stats.done} completed
        </Button>
      )}
    </section>
  );
}