import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
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
import api from "@/lib/api";
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

export function AddBudgetDialog() {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);

	const mutation = useMutation({
		mutationFn: () => api.post("/budgets", { name }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
			setShowSuccessDialog(true);
			setOpen(false); // Close the dialog on success
			setName(""); // Reset the input
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				setErrorMessage(
					error.response?.data.message || t("Failed to create budget."),
				);
			} else {
				setErrorMessage(t("An unexpected error occurred."));
			}
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		if (name.trim()) {
			mutation.mutate();
		}
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
					<Button>{t("Add New Budget")}</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] bg-black/60 text-white border-white/20 glass-effect">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>{t("Create New Budget")}</DialogTitle>
							<DialogDescription>
								{t("Give your new budget a name. Click save when you're done.")}
							</DialogDescription>
						</DialogHeader>
						{errorMessage && (
							<Alert variant="destructive">
								<AlertTitle>{t("Error")}</AlertTitle>
								<AlertDescription>{errorMessage}</AlertDescription>
							</Alert>
						)}
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									{t("Name")}
								</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="col-span-3 bg-black/20 border-white/20"
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={mutation.isPending}>
								{mutation.isPending ? t("Saving...") : t("Save budget")}
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
							{t("Budget created successfully!")}
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
