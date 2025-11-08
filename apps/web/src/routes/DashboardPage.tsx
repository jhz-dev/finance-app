import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BudgetList } from "@/components/BudgetList";
import type { PaginatedBudgets } from "@/domain/budget";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { useTranslation } from "react-i18next";
import { AddBudgetDialog } from "@/components/AddBudgetDialog";
import { Message } from "@/components/Message";
import { PaginationControl } from "@/components/PaginationControl";

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

	return (
		<div>
      <div className="flex items-center justify-end mb-6">
        <AddBudgetDialog />
      </div>
			{isPending && <p className="text-foreground-700">{t("Loading budgets...")}</p>}
			{isError && (
        <Message
          type="error"
          title={t("Error")}
          message={t("Error fetching budgets: {{message}}", { message: error.message })}
        />
			)}
			{isSuccess &&
				(data.budgets.length > 0 ? (
					<>
            <BudgetList budgets={data.budgets} />
						<PaginationControl
							currentPage={page}
							totalPages={Math.ceil(data.totalBudgets / LIMIT)}
							onPageChange={setPage}
						/>
					</>
				) : (
            <Message
              type="info"
              title={t("No Budgets Yet")}
              message={t('Click the "Add New Budget" button to get started.')}
            />
				))}
		</div>
	);
}

export default DashboardPage;
