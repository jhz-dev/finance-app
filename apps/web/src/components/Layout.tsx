
import type React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/domain/auth/auth.store';
import { useNavigate } from '@tanstack/react-router';

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="flex h-screen p-4 gap-4">
      <aside className="w-64 glass-effect p-6 flex flex-col">
        <div>
          <h1 className="text-2xl font-bold text-white">FinanSync</h1>
          <nav className="mt-10">
            {/* Navigation links will go here */}
          </nav>
        </div>
        <div className="mt-auto">
          <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent hover:bg-white/10 text-white">
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 glass-effect p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
