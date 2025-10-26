import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Budget } from '@/domain/budget';

interface BudgetCardProps {
  budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  return (
    <Card className="glass-effect text-white border-white/20 hover:bg-white/10 transition-colors cursor-pointer">
      <CardHeader>
        <CardTitle>{budget.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$0.00</div>
        <p className="text-xs text-white/60">Current Balance</p>
      </CardContent>
    </Card>
  );
}
