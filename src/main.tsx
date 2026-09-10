import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { DependenciesProvider } from './application/DependenciesContext.tsx';
import type { Dependencies } from './application/ports.ts';
import { LocalStorageTaskRepository } from './infrastructure/storage/LocalStorageTaskRepository.ts';
import { CryptoIdGenerator } from './infrastructure/ids/CryptoIdGenerator.ts';
import { SystemClock } from './infrastructure/time/SystemClock.ts';
import { App } from './presentation/App.tsx';
import './presentation/styles/global.scss';

// Composition root: the one place infrastructure is constructed and
// injected. Swapping localStorage for a backend API means changing this
// object only — every use case keeps working against the same port.

const dependencies: Dependencies = {
  taskRepository: new LocalStorageTaskRepository(),
  idGenerator: new CryptoIdGenerator(),
  clock: new SystemClock(),
};

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element in index.html.');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <DependenciesProvider value={dependencies}>
        <App />
      </DependenciesProvider>
    </BrowserRouter>
  </StrictMode>,
);