import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Budget } from "@/domain/transaction/budget";

interface BudgetCardProps {
	budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
	const { t } = useTranslation();
	const formattedBalance = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(budget.balance);

	return (
		<Link to="/budgets/$budgetId" params={{ budgetId: budget.id }}>
			<Card className="bg-white rounded-3xl shadow-2xl p-6">
				<CardHeader>
					<CardTitle className="text-slate-500">{budget.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-4xl font-extrabold text-slate-900">{formattedBalance}</div>
					<p className="text-xs text-slate-500">{t("Current Balance")}</p>
				</CardContent>
			</Card>
		</Link>
	);
}
