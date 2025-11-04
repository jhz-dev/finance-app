import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinancialGoal } from "@/domain/goal/goal";
import { useAddTransactionToGoal } from "@/hooks/useAddTransactionToGoal";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const addTransactionSchema = z.object({
	amount: z.number().min(1, "Amount must be greater than 0"),
});

export function AddTransactionToGoalForm({ goal }: { goal: FinancialGoal }) {
	const { t } = useTranslation();
	const { mutate } = useAddTransactionToGoal();
	const form = useForm({
		defaultValues: {
			amount: 0,
		},
		onSubmit: async ({ value }) => {
			mutate({ id: goal.id, amount: value.amount });
		},
		validators: {
			onChange: addTransactionSchema,
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
					name="amount"
					children={(field) => (
						<div>
							<Label htmlFor={field.name}>{t("Amount")}</Label>
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
				<Button type="submit">{t("Add Transaction")}</Button>
			</div>
		</form>
	);
}
