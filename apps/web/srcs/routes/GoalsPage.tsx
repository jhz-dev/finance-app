import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";

function GoalsPage() {
	const { t } = useTranslation();

	const { isPending, isError, isSuccess, data, error } = useQuery({
		queryKey: ["goals"],
		queryFn: () => goalRepository.getAll(),
	});

	return (
		<div className="mt-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-white">
					{t("Financial Goals")}
				</h1>
				<AddGoalDialog />
			</div>
			{isPending && <p className="text-white/70">{t("Loading goals...")}</p>}
			{isError && (
				<p className="text-red-500">
					{t("Error fetching goals: {{message}}", { message: error.message })}
				</p>
			)}
			{isSuccess &&
				(data.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
						{data.map((goal) => (
							<div key={goal.id} className="glass-effect p-4 text-white">
								<h2 className="font-bold">{goal.name}</h2>
								<p className="text-sm text-white/70">
									{t("Target: {{amount}}", { amount: goal.targetAmount })}
								</p>
								<p className="text-sm text-white/70">
									{t("Current: {{amount}}", { amount: goal.currentAmount })}
								</p>
								<div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
									<div
										className="bg-primary h-2.5 rounded-full"
										style={{
											width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
										}}
									></div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center mt-20">
						<h2 className="text-2xl font-semibold text-white">
							{t("No Goals Yet")}
						</h2>
						<p className="text-white/70 mt-2">
							{t('Click the "Add New Goal" button to get started.')}
						</p>
					</div>
				))}
		</div>
	);
}

export default GoalsPage;
