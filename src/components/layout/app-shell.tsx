import type { ReactNode } from 'react';
import { Header } from './header';
import { BottomNav } from './bottom-nav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <div className="relative mx-auto flex h-screen max-w-md flex-col overflow-hidden bg-card shadow-2xl">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
