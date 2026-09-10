import { Suspense, lazy } from 'react';
import { NavLink, Route, Routes } from 'react-router';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { featureFlags } from '../application/featureFlags.ts';
import { PageSkeleton } from './components/PageSkeleton.tsx';
import { Home } from './pages/Home.tsx';
import styles from './App.module.scss';

// Feature routes lazy-load so each feature's code and SCSS split into
// their own chunk; a hidden (flag=false) feature costs zero bytes.
const TasksPage = lazy(() =>
  import('./features/tasks/TasksPage.tsx').then(module => ({ default: module.TasksPage })),
);

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand}>
          React SCSS Template
        </NavLink>
        <nav className={styles.nav}>
          <NavLink to="/" end>
            Home
          </NavLink>
          {featureFlags.tasks && (
            <NavLink to="/tasks" className={({ isActive }) => (isActive ? styles.active : undefined)}>
              Tasks
            </NavLink>
          )}
        </nav>
      </header>
      <main className={styles.main}>
        <ErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/" element={<Home />} />
              {featureFlags.tasks && <Route path="/tasks" element={<TasksPage />} />}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}