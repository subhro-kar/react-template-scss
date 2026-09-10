import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.scss';

// Feature-level boundary: wrap each route so one crashing feature never
// takes down the app shell. Reset by remounting (route change).

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Feature crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" className={styles.fallback}>
          <h2>Something went wrong</h2>
          <p>This part of the app hit an unexpected error. Reload the page to try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}