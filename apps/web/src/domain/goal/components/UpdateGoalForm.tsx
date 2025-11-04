import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinancialGoal } from "@/domain/goal/goal";
import { useUpdateGoal } from "@/hooks/useUpdateGoal";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const updateGoalSchema = z.object({
	name: z.string().min(1, "Name is required"),
	targetAmount: z.number().min(1, "Target amount must be greater than 0"),
	currentAmount: z.number().min(0, "Current amount must be a positive number"),
});

export function UpdateGoalForm({ goal }: { goal: FinancialGoal }) {
	const { t } = useTranslation();
	const { mutate } = useUpdateGoal();
	const form = useForm({
		defaultValues: {
			name: goal.name,
			targetAmount: goal.targetAmount,
			currentAmount: goal.currentAmount,
		},
		onSubmit: async ({ value }) => {
			mutate({
				id: goal.id,
				...value,
			});
		},
		validators: {
			onChange: updateGoalSchema,
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div className="space-y-2">
				<form.Field
					name="name"
					children={(field) => (
						<div>
							<Label htmlFor={field.name}>{t("Name")}</Label>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</div>
					)}
				/>
				<form.Field
					name="targetAmount"
					children={(field) => (
						<div>
							<Label htmlFor={field.name}>{t("Target Amount")}</Label>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(Number(e.target.value))}
								type="number"
							/>
						</div>
					)}
				/>
				<form.Field
					name="currentAmount"
					children={(field) => (
						<div>
							<Label htmlFor={field.name}>{t("Current Amount")}</Label>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(Number(e.target.value))}
								type="number"
							/>
						</div>
					)}
				/>
			</div>
			<div className="mt-4 flex justify-end">
				<Button type="submit">{t("Update Goal")}</Button>
			</div>
		</form>
	);
}
