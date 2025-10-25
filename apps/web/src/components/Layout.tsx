
import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen p-4 gap-4">
      <aside className="w-64 glass-effect p-6">
        <h1 className="text-2xl font-bold text-white">FinanSync</h1>
        <nav className="mt-10">
          {/* Navigation links will go here */}
        </nav>
      </aside>
      <main className="flex-1 glass-effect p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
