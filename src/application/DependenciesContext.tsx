import { createContext, useContext, type ReactNode } from 'react';
import type { Dependencies } from './ports.ts';

// Presentation (main.tsx) constructs the infrastructure implementations and
// passes them here. Application code consumes them via useDependencies(),
// never by importing infrastructure directly.

const DependenciesContext = createContext<Dependencies | null>(null);

export function DependenciesProvider({ value, children }: { value: Dependencies; children: ReactNode }) {
  return <DependenciesContext.Provider value={value}>{children}</DependenciesContext.Provider>;
}

export function useDependencies(): Dependencies {
  const dependencies = useContext(DependenciesContext);
  if (!dependencies) throw new Error('useDependencies requires a DependenciesProvider.');
  return dependencies;
}