import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateGoal } from "@/hooks/useCreateGoal";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

export function CreateGoalForm() {
	const { mutate } = useCreateGoal();
	const form = useForm({
		defaultValues: {
			name: "",
			targetAmount: 0,
		},
		onSubmit: async ({ value }) => {
			mutate({
				name: value.name,
				targetAmount: value.targetAmount,
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
				<Button type="submit">Add Goal</Button>
			</div>
		</form>
	);
}
