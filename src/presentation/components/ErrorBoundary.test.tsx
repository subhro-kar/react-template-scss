import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '@/presentation/components/ErrorBoundary.tsx';

function Bomb(): never {
  throw new Error('boom');
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>Feature content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Feature content')).toBeInTheDocument();
  });

  it('renders the default fallback when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('renders a custom fallback that receives the error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary fallback={(error) => <p>Custom fallback: {error.message}</p>}>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Custom fallback: boom')).toBeInTheDocument();
  });
});
