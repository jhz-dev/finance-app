import { Link } from '@tanstack/react-router';
import { Home, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { useAuthStore } from '@/domain/auth/auth.store';
import { useNavigate } from '@tanstack/react-router';

export function Sidebar() {
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="flex flex-col h-full p-4 glass-effect">
      <h2 className="text-2xl font-bold text-white mb-10">FinanSync</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="flex items-center space-x-2 text-white hover:text-primary">
          <Home className="h-5 w-5" />
          <span>{t('Dashboard')}</span>
        </Link>
        <Link to="/profile" className="flex items-center space-x-2 text-white hover:text-primary">
          <User className="h-5 w-5" />
          <span>{t('Profile')}</span>
        </Link>
      </nav>
      <div className="mt-auto">
        <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent hover:bg-white/10 text-white">
          <LogOut className="h-5 w-5 mr-2" />
          {t('Logout')}
        </Button>
      </div>
    </div>
  );
}
