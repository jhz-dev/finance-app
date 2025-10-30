import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Transaction } from "@/domain/transaction/transaction";
import { transactionRepository } from "@/infrastructure/ApiTransactionRepository";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";

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
	const queryClient = useQueryClient();
	const [description, setDescription] = useState(transaction.description);
	const [amount, setAmount] = useState(String(transaction.amount));
	const [type, setType] = useState(transaction.type);
	const [date, setDate] = useState(
		new Date(transaction.date).toISOString().split("T")[0],
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);

	useEffect(() => {
		if (open) {
			setDescription(transaction.description);
			setAmount(String(transaction.amount));
			setType(transaction.type);
			setDate(new Date(transaction.date).toISOString().split("T")[0]);
		}
	}, [open, transaction]);

	const mutation = useMutation({
		mutationFn: () =>
			transactionRepository.update(transaction.id, {
				description,
				amount: Number(amount),
				type,
				date: new Date(date).toISOString(),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
			setShowSuccessDialog(true);
			onOpenChange(false);
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				setErrorMessage(
					error.response?.data.message || t("Failed to update transaction."),
				);
			} else {
				setErrorMessage(t("An unexpected error occurred."));
			}
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		mutation.mutate();
	};

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(isOpen) => {
					onOpenChange(isOpen);
					if (!isOpen) {
						setErrorMessage(null);
					}
				}}
			>
				<DialogContent className="sm:max-w-[425px] bg-black/60 text-white border-white/20 glass-effect">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>{t("Edit Transaction")}</DialogTitle>
							<DialogDescription>
								{t("Update the details of your transaction.")}
							</DialogDescription>
						</DialogHeader>
						{errorMessage && (
							<Alert variant="destructive">
								<AlertTitle>{t("Error")}</AlertTitle>
								<AlertDescription>{errorMessage}</AlertDescription>
							</Alert>
						)}
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="description">{t("Description")}</Label>
								<Input
									id="description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="amount">{t("Amount")}</Label>
								<Input
									id="amount"
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="type">{t("Type")}</Label>
								<Select
									onValueChange={(value: "INCOME" | "EXPENSE") =>
										setType(value)
									}
									defaultValue={type}
								>
									<SelectTrigger id="type">
										<SelectValue placeholder={t("Select a type")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="INCOME">{t("Income")}</SelectItem>
										<SelectItem value="EXPENSE">{t("Expense")}</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="date">{t("Date")}</Label>
								<Input
									id="date"
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={mutation.isPending}>
								{mutation.isPending ? t("Saving...") : t("Save Changes")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("Success!")}</AlertDialogTitle>
						<AlertDialogDescription>
							{t("Transaction updated successfully!")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
							{t("OK")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
