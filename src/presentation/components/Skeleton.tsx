import styles from '@/presentation/components/Skeleton.module.scss';

// Decorative loading placeholder — screen readers skip it (aria-hidden);
// the surrounding region owns the status announcement (see PageSkeleton).

interface SkeletonProps {
  /** CSS length, e.g. '100%', '16rem'. */
  width?: string;
  /** CSS length, e.g. '1rem', '6rem'. */
  height?: string;
  /** Border radius; 'pill' gives a fully rounded bar. */
  radius?: string | 'pill';
}

export function Skeleton({ width = '100%', height = '1rem', radius }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={styles.skeleton}
      style={{ width, height, borderRadius: radius === 'pill' ? '999px' : radius }}
    />
  );
}
