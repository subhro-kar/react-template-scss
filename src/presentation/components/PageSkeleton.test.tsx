import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageSkeleton } from '@/presentation/components/PageSkeleton.tsx';
import { Skeleton } from '@/presentation/components/Skeleton.tsx';

describe('Skeleton', () => {
  it('is hidden from assistive tech and applies its dimensions', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />);
    const piece = container.firstChild as HTMLElement;
    expect(piece).toHaveAttribute('aria-hidden', 'true');
    expect(piece.style.width).toBe('50%');
    expect(piece.style.height).toBe('2rem');
  });

  it('renders a pill radius when requested', () => {
    const { container } = render(<Skeleton radius="pill" />);
    expect((container.firstChild as HTMLElement).style.borderRadius).toBe('999px');
  });
});

describe('PageSkeleton', () => {
  it('announces loading exactly once, with decorative pieces hidden', () => {
    const { container } = render(<PageSkeleton />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(5);
  });
});
