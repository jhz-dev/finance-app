import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { LabeledSelect } from "@/components/ui/LabeledSelect";
import type { Transaction } from "@/domain/transaction/Transaction";
import { useUpdateTransaction } from "@/hooks/useUpdateTransaction";
import { LabeledInput } from "./ui/LabeledInput";

interface EditTransactionDialogProps {
	transaction: Transaction;
	budgetId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({
	transaction,
	budgetId,
	open,
	onOpenChange,
}: EditTransactionDialogProps) {
	const { t } = useTranslation();
	const descriptionId = useId();
	const amountId = useId();
	const typeId = useId();
	const dateId = useId();
	const [description, setDescription] = useState(transaction.description);
	const [amount, setAmount] = useState(String(transaction.amount));
	const [type, setType] = useState(transaction.type);
	const [date, setDate] = useState(
		new Date(transaction.date).toISOString().split("T")[0],
	);

	const typeOptions: { value: "INCOME" | "EXPENSE"; label: string }[] = [
		{ value: "INCOME", label: "Income" },
		{ value: "EXPENSE", label: "Expense" },
	];

	useEffect(() => {
		if (open) {
			setDescription(transaction.description);
			setAmount(String(transaction.amount));
			setType(transaction.type);
			setDate(new Date(transaction.date).toISOString().split("T")[0]);
		}
	}, [open, transaction]);

	const mutation = useUpdateTransaction(budgetId);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(
			{
				transactionId: transaction.id,
				transaction: {
					description,
					amount: Number(amount),
					type,
					date: new Date(date).toISOString(),
				},
			},
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px] bg-black/60 text-white border-white/20 glass-effect">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{t("Edit Transaction")}</DialogTitle>
						<DialogDescription>
							{t("Update the details of your transaction.")}
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
						<LabeledSelect
							id={typeId}
							label="Type"
							value={type}
							onValueChange={(value: "INCOME" | "EXPENSE") => setType(value)}
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
					<DialogFooter>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? t("Saving...") : t("Save Changes")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

