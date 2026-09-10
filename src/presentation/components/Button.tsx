import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from '@/presentation/components/Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
}
