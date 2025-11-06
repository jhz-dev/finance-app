import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { LabeledInput } from "./ui/LabeledInput";

import { LabeledSelect } from "@/components/ui/LabeledSelect";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";

interface AddTransactionDialogProps {
	budgetId: string;
}

export function AddTransactionDialog({ budgetId }: AddTransactionDialogProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

	const descriptionId = useId();
	const amountId = useId();
	const typeId = useId();
	const dateId = useId();

	const typeOptions: { value: "INCOME" | "EXPENSE"; label: string }[] = [
		{ value: "INCOME", label: "Income" },
		{ value: "EXPENSE", label: "Expense" },
	];

	const mutation = useCreateTransaction(budgetId);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(
			{
				description,
				amount: Number(amount),
				type,
				date: new Date(date).toISOString(),
			},
			{
				onSuccess: () => {
					setOpen(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
					{t("Add Transaction")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px] bg-white rounded-3xl shadow-2xl">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{t("Add Transaction")}</DialogTitle>
						<DialogDescription>
							{t("Add a new transaction to this budget.")}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<LabeledInput
							id={descriptionId}
							label="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
						<LabeledInput
							id={amountId}
							label="Amount"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							required
						/>
						<div className="grid gap-0 grid-cols-2">
							<LabeledSelect
								id={typeId}
								label="Type"
								value={type}
								onValueChange={setType}
								options={typeOptions}
								placeholder="Select a type"
							/>
							<LabeledInput
								id={dateId}
								label="Date"
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="submit"
							disabled={mutation.isPending}
							className="bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
						>
							{mutation.isPending ? t("Saving...") : t("Save Transaction")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
