import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BudgetCard } from "@/components/BudgetCard";
import { Button } from "@/components/ui/button";
import type { PaginatedBudgets } from "@/domain/transaction/budget";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { useTranslation } from "react-i18next";
import { AddBudgetDialog } from "@/components/AddBudgetDialog";

const LIMIT = 6;

function DashboardPage() {
	const { t } = useTranslation();
	const [page, setPage] = useState(1);

	const { isPending, isError, isSuccess, data, error } = useQuery<
		PaginatedBudgets,
		Error
	>({
		queryKey: ["budgets", page],
		queryFn: () => budgetRepository.getAll(page, LIMIT),
	});

	const handlePrevPage = () => {
		setPage((prevPage) => Math.max(prevPage - 1, 1));
	};

	const handleNextPage = () => {
		if (data && data.totalBudgets > page * LIMIT) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	return (
		<div>
      <div className="flex items-center justify-end mb-6">
        <AddBudgetDialog />
      </div>
			{isPending && <p className="text-foreground-700">{t("Loading budgets...")}</p>}
			{isError && (
				<p className="text-red-500">
					{t("Error fetching budgets: {{message}}", { message: error.message })}
				</p>
			)}
			{isSuccess &&
				(data.budgets.length > 0 ? (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{data.budgets.map((budget) => (
								<BudgetCard key={budget.id} budget={budget} />
							))}
						</div>
						<div className="flex justify-center items-center mt-6 space-x-4">
							<Button
								onClick={handlePrevPage}
								disabled={page === 1}
							>
								{t("Previous")}
							</Button>
							<span className="text-foreground-700">
								{t("Page")} {page}
							</span>
							<Button
								onClick={handleNextPage}
								disabled={!data || data.totalBudgets <= page * LIMIT}
							>
								{t("Next")}
							</Button>
						</div>
					</>
				) : (
					<div className="text-center mt-20">
						<h2 className="text-2xl font-bold text-slate-900">
							{t("No Budgets Yet")}
						</h2>
						<p className="text-foreground-700 mt-2">
							{t('Click the "Add New Budget" button to get started.')}
						</p>
					</div>
				))}
		</div>
	);
}

export default DashboardPage;
