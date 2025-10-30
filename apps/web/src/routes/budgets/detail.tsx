import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { MetricCard } from "@/components/MetricCard";
import { TransactionChart } from "@/components/TransactionChart";
import { TransactionsTable } from "@/components/TransactionsTable";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";

export function BudgetDetailPage() {
	const { budgetId } = useParams({ from: "/budgets/$budgetId" });
	const [timePeriod, setTimePeriod] = React.useState("monthly");
	const { t } = useTranslation();

	const { isPending, isError, isSuccess, data, error } = useQuery({
		queryKey: ["budgets", budgetId],
		queryFn: () => budgetRepository.getById(budgetId),
		enabled: !!budgetId, // Only run the query if budgetId is available
	});

	const filteredTransactions = React.useMemo(() => {
		if (!data?.transactions) return [];
		const now = new Date();
		if (timePeriod === "yearly") {
			return data.transactions.filter(
				(t) => new Date(t.date).getFullYear() === now.getFullYear(),
			);
		}
		// Default to monthly
		return data.transactions.filter((t) => {
			const transactionDate = new Date(t.date);
			return (
				transactionDate.getFullYear() === now.getFullYear() &&
				transactionDate.getMonth() === now.getMonth()
			);
		});
	}, [data, timePeriod]);

	const balance = React.useMemo(() => {
		return filteredTransactions.reduce((acc, t) => {
			if (t.type === "INCOME") {
				return acc + Number(t.amount);
			}
			if (t.type === "EXPENSE") {
				return acc - Number(t.amount);
			}
			return acc;
		}, 0);
	}, [filteredTransactions]);

	const formattedBalance = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(balance);

	return (
		<div>
			{isPending && (
				<h1 className="text-3xl font-bold text-white">{t("Loading...")}</h1>
			)}
			{isError && (
				<h1 className="text-3xl font-bold text-red-500">
					{t("Error: {{message}}", { message: error.message })}
				</h1>
			)}
			{isSuccess && data && (
				<div>
					<Breadcrumb className="mb-4">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/">{t("Dashboard")}</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{data.name}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold text-white">{data.name}</h1>
						<AddTransactionDialog budgetId={budgetId} />
					</div>

					<div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mb-8">
						<MetricCard title={t("Current Balance")} value={formattedBalance} />
						<div className="lg:col-span-2 glass-effect p-4">
							<TransactionChart data={filteredTransactions} />
						</div>
					</div>

					<Tabs value={timePeriod} onValueChange={setTimePeriod}>
						<TabsList className="mb-4 bg-black/20 border-white/20 border">
							<TabsTrigger value="monthly">{t("Monthly")}</TabsTrigger>
							<TabsTrigger value="yearly">{t("Yearly")}</TabsTrigger>
						</TabsList>
						<TabsContent value="monthly">
							<TransactionsTable
								transactions={filteredTransactions}
								budgetId={budgetId}
							/>
						</TabsContent>
						<TabsContent value="yearly">
							<TransactionsTable
								transactions={filteredTransactions}
								budgetId={budgetId}
							/>
						</TabsContent>
					</Tabs>
				</div>
			)}
		</div>
	);
}
