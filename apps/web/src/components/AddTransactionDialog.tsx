import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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

interface AddTransactionDialogProps {
	budgetId: string;
}

export function AddTransactionDialog({ budgetId }: AddTransactionDialogProps) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);

	const descriptionId = useId();
	const amountId = useId();
	const typeId = useId();
	const dateId = useId();

	const mutation = useMutation({
		mutationFn: () =>
			transactionRepository.create(budgetId, {
				description,
				amount: Number(amount),
				type,
				date: new Date(date).toISOString(),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
			setShowSuccessDialog(true);
			setOpen(false);
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				setErrorMessage(
					error.response?.data.message || t("Failed to add transaction."),
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
					setOpen(isOpen);
					if (!isOpen) {
						setErrorMessage(null);
					}
				}}
			>
				<DialogTrigger asChild>
					<Button>{t("Add Transaction")}</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] bg-background text-white border-white/20">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>{t("Add Transaction")}</DialogTitle>
							<DialogDescription>
								{t("Add a new transaction to this budget.")}
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
								<Label htmlFor={descriptionId}>{t("Description")}</Label>
								<Input
									id={descriptionId}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor={amountId}>{t("Amount")}</Label>
								<Input
									id={amountId}
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor={typeId}>{t("Type")}</Label>
								<Select
									onValueChange={(value: "INCOME" | "EXPENSE") =>
										setType(value)
									}
									defaultValue={type}
								>
									<SelectTrigger id={typeId}>
										<SelectValue placeholder={t("Select a type")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="INCOME">{t("Income")}</SelectItem>
										<SelectItem value="EXPENSE">{t("Expense")}</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor={dateId}>{t("Date")}</Label>
								<Input
									id={dateId}
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={mutation.isPending}>
								{mutation.isPending ? t("Saving...") : t("Save Transaction")}
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
							{t("Transaction added successfully!")}
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
