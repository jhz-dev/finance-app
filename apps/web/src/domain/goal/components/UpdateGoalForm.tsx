import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinancialGoal as Goal } from "@/domain/goal/goal";
import { useUpdateGoal } from "@/hooks/useUpdateGoal";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

export function UpdateGoalForm({ goal }: { goal: Goal }) {
	const { mutate } = useUpdateGoal();
	const form = useForm({
		defaultValues: {
			name: goal.name,
			targetAmount: goal.targetAmount,
		},
		onSubmit: async ({ value }) => {
			mutate({
				id: goal.id,
				...value,
        currentAmount: goal.currentAmount,
			});
		},
		validatorAdapter: zodValidator,
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
					validators={{
						onChange: z.string().min(1, "Name is required"),
					}}
					children={(field) => (
						<div>
							<Label htmlFor={field.name}>Name</Label>
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
					validators={{
						onChange: z.number().min(1, "Target amount must be greater than 0"),
					}}
					children={(field) => (
						<div>
							<Label htmlFor={field.name}>Target Amount</Label>
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
				<Button type="submit">Update Goal</Button>
			</div>
		</form>
	);
}
