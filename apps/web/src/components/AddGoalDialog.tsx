import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";

export function AddGoalDialog() {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: goalRepository.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});

	const _nameId = useId();
	const _targetAmountId = useId();

	const form = useForm({
		defaultValues: {
			name: "",
			targetAmount: 0,
			currentAmount: 0,
		},
		onSubmit: async ({ value }) => {
			mutation.mutate(value);
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>{t("Add New Goal")}</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t("Add New Goal")}</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<div>
						<Label htmlFor={_nameId}>{t("Name")}</Label>
						<Input
							id={_nameId}
							name="name"
							value={form.state.values.name}
							onChange={(e) => form.setFieldValue("name", e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor={_targetAmountId}>{t("Target Amount")}</Label>
						<Input
							id={_targetAmountId}
							name="targetAmount"
							type="number"
							value={form.state.values.targetAmount}
							onChange={(e) =>
								form.setFieldValue("targetAmount", Number.parseInt(e.target.value))
							}
						/>
					</div>
					<Button type="submit">{t("Add Goal")}</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
