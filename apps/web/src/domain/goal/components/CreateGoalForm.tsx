import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateGoal } from "@/hooks/useCreateGoal";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const createGoalSchema = z.object({
	name: z.string().min(1, "Name is required"),
	targetAmount: z.number().min(1, "Target amount must be greater than 0"),
});

export function CreateGoalForm() {
	const { t } = useTranslation();
	const { mutate } = useCreateGoal();
	const form = useForm({
		defaultValues: {
			name: "",
			targetAmount: 0,
		},
		onSubmit: async ({ value }) => {
			mutate(value);
		},
		validators: {
			onChange: createGoalSchema,
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
			</div>
			<div className="mt-4 flex justify-end">
				<Button type="submit">{t("Add Goal")}</Button>
			</div>
		</form>
	);
}
