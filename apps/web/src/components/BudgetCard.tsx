import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Budget } from '@/domain/transaction/budget';
import { Link } from '@tanstack/react-router';

import { useTranslation } from 'react-i18next';

interface BudgetCardProps {
  budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const { t } = useTranslation();
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(budget.balance);

  return (
    <Link to="/budgets/$budgetId" params={{ budgetId: budget.id }}>
      <Card className="glass-effect text-white border-white/20 hover:bg-white/10 transition-colors">
        <CardHeader>
          <CardTitle>{budget.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedBalance}</div>
          <p className="text-xs text-white/60">{t('Current Balance')}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
