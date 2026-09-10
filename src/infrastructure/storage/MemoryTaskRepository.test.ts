import assert from 'node:assert/strict';
import test from 'node:test';
import type { Task } from '../../domain/entities/task.ts';
import { createTask, withStatus } from '../../domain/rules/tasks.ts';
import { MemoryTaskRepository } from './MemoryTaskRepository.ts';

test('MemoryTaskRepository round-trips tasks and stays independent of its callers', async () => {
  const repository = new MemoryTaskRepository();
  const first = createTask('t1', 'first', 1);
  const second: Task = withStatus(createTask('t2', 'second', 2), 'done');

  assert.deepEqual(await repository.load(), []);
  await repository.save([first, second]);

  const loaded = await repository.load();
  assert.equal(loaded.length, 2);
  assert.deepEqual(loaded[0], first);
  assert.equal(loaded[1].status, 'done');

  // load() returns a copy, so callers cannot mutate repository state.
  const mutable = await repository.load();
  (mutable as Task[]).pop();
  assert.equal((await repository.load()).length, 2);
});
