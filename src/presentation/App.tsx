import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router';
import { featureFlags } from '@/application/featureFlags.ts';
import styles from '@/presentation/App.module.scss';
import { ErrorBoundary } from '@/presentation/components/ErrorBoundary.tsx';
import { PageSkeleton } from '@/presentation/components/PageSkeleton.tsx';
import { Home } from '@/presentation/pages/Home.tsx';

// Feature routes lazy-load so each feature's code and SCSS split into
// their own chunk; a hidden (flag=false) feature costs zero bytes.
const TasksPage = lazy(() =>
  import('@/presentation/features/tasks/TasksPage.tsx').then((module) => ({ default: module.TasksPage })),
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
