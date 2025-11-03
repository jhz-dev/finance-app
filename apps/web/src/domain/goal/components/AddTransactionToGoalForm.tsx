import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Goal } from "@/domain/goal/goal";
import { useUpdateGoal } from "@/hooks/useUpdateGoal";
import { useForm } from "@tanstack/react-form";

export function AddTransactionToGoalForm({ goal }: { goal: Goal }) {
	const { mutate } = useUpdateGoal();
	const form = useForm({
		defaultValues: {
			amount: 0,
		},
		onSubmit: async ({ value }) => {
			mutate({
				...goal,
				currentAmount: goal.currentAmount + value.amount,
			});
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
							<Label htmlFor={field.name}>Amount</Label>
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
				<Button type="submit">Add Transaction</Button>
			</div>
		</form>
	);
}
