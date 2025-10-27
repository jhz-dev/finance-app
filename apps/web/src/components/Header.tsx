import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { AddBudgetDialog } from './AddBudgetDialog';
import { useTranslation } from 'react-i18next';
import { useSidebarStore } from '@/domain/sidebar/sidebar.store';

export function Header() {
  const { t } = useTranslation();
  const { toggle } = useSidebarStore();

  return (
    <header className="flex items-center justify-between p-4 glass-effect">
      <Button
        onClick={toggle}
        variant="outline"
        size="icon"
        className="bg-transparent hover:bg-white/10 text-white"
      >
        <Menu className="h-6 w-6" />
      </Button>
      <h1 className="text-2xl font-bold text-white">{t('Dashboard')}</h1>
      <AddBudgetDialog />
    </header>
  );
}