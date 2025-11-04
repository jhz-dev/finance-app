import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GoalCard } from "@/components/GoalCard";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";

export function GoalList() {
	const { t } = useTranslation();

	const { isPending, isError, isSuccess, data, error } = useQuery({
		queryKey: ["goals"],
		queryFn: () => goalRepository.getAll(),
	});

	if (isPending) {
		return <p className="text-slate-500">{t("Loading goals...")}</p>;
	}

	if (isError) {
		return (
			<p className="text-red-500">
				{t("Error fetching goals: {{message}}", { message: error.message })}
			</p>
		);
	}

	if (isSuccess && data.length > 0) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
				{data.map((goal) => (
					<GoalCard key={goal.id} goal={goal} />
				))}
			</div>
		);
	}

	return (
		<div className="text-center mt-20">
			<h2 className="text-2xl font-semibold text-slate-900">
				{t("No Goals Yet")}
			</h2>
			<p className="text-slate-500 mt-2">
				{t('Click the "Add New Goal" button to get started.')}
			</p>
		</div>
	);
}
