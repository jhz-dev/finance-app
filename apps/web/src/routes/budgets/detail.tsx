import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { ShareBudgetDialog } from "@/components/ShareBudgetDialog";
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
		return data.transactions;
	}, [data]);

	const formattedBalance = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(data ? data.balance : 0);

	return (
		<div>
			{isPending && (
				<h1 className="text-3xl font-bold text-slate-900">{t("Loading...")}</h1>
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
						<h1 className="text-3xl font-bold text-slate-900">{data.name}</h1>
						<div className="flex space-x-2">
							<AddTransactionDialog budgetId={budgetId} />
							<ShareBudgetDialog budgetId={budgetId} members={data.members} />
						</div>
					</div>

					<div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mb-8">
						<MetricCard title={t("Current Balance")} value={formattedBalance} />
						<div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-6">
							<TransactionChart data={filteredTransactions} />
						</div>
					</div>

					<Tabs value={timePeriod} onValueChange={setTimePeriod}>
						<TabsList className="mb-4 bg-slate-200 rounded-full p-1 flex space-x-1">
							<TabsTrigger
								value="monthly"
								className="py-2 px-5 rounded-full text-slate-600 font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-emerald-600 data-[state=active]:font-semibold"
							>
								{t("Monthly")}
							</TabsTrigger>
							<TabsTrigger
								value="yearly"
								className="py-2 px-5 rounded-full text-slate-600 font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-emerald-600 data-[state=active]:font-semibold"
							>
								{t("Yearly")}
							</TabsTrigger>
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
