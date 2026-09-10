import assert from 'node:assert/strict';
import test from 'node:test';
import { createTask, filterTasks, taskStats, toggleStatus, validateTitle, withStatus } from './tasks.ts';

test('createTask validates id, title, and timestamp, and starts active', () => {
  const task = createTask('t1', '  Ship the template  ', 1000);
  assert.deepEqual(task, { id: 't1', title: 'Ship the template', status: 'active', createdAt: 1000 });
  assert.throws(() => createTask('', 'x', 1000));
  assert.throws(() => createTask('t1', 'x', Number.NaN));
  for (const bad of ['', '   ', 'x'.repeat(121)]) assert.throws(() => validateTitle(bad));
});

test('status updates are immutable and idempotent', () => {
  const task = createTask('t1', 'x', 1);
  const done = withStatus(task, 'done');
  assert.equal(done.status, 'done');
  assert.equal(task.status, 'active');
  assert.equal(withStatus(done, 'done'), done);
  assert.equal(toggleStatus(toggleStatus(task)).status, 'active');
});

test('filterTasks and taskStats cover every filter and count correctly', () => {
  const tasks = [
    createTask('a', 'first', 1),
    withStatus(createTask('b', 'second', 2), 'done'),
    withStatus(createTask('c', 'third', 3), 'done'),
  ];
  assert.equal(filterTasks(tasks, 'all').length, 3);
  assert.equal(filterTasks(tasks, 'active').length, 1);
  assert.equal(filterTasks(tasks, 'done').length, 2);
  assert.deepEqual(taskStats(tasks), { total: 3, active: 1, done: 2 });
  assert.deepEqual(taskStats([]), { total: 0, active: 0, done: 0 });
});
