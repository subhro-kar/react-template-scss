import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import type { Dependencies } from '@/application/ports.ts';
import { createTasksStore } from '@/application/stores/createTasksStore.ts';
import { TasksStoreProvider } from '@/application/useTasks.tsx';
import { CryptoIdGenerator } from '@/infrastructure/ids/CryptoIdGenerator.ts';
import { LocalStorageTaskRepository } from '@/infrastructure/storage/LocalStorageTaskRepository.ts';
import { SystemClock } from '@/infrastructure/time/SystemClock.ts';
import { App } from '@/presentation/App.tsx';
import '@/presentation/styles/global.scss';

// Composition root: the one place infrastructure is constructed and
// injected. Swapping localStorage for a backend API means changing this
// object only — every use case keeps working against the same port.

const dependencies: Dependencies = {
  taskRepository: new LocalStorageTaskRepository(),
  idGenerator: new CryptoIdGenerator(),
  clock: new SystemClock(),
};

const tasksStore = createTasksStore(dependencies);
// Kick off the initial load once, outside React, so StrictMode remounts never duplicate it.
void tasksStore.getState().hydrate();

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element in index.html.');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <TasksStoreProvider store={tasksStore}>
        <App />
      </TasksStoreProvider>
    </BrowserRouter>
  </StrictMode>,
);
