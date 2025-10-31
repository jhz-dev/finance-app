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
	const nameId = useId();
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
					<Button className="bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
						{t("Add New Budget")}
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] bg-white rounded-3xl shadow-2xl">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle className="text-slate-900 font-bold">
								{t("Create New Budget")}
							</DialogTitle>
							<DialogDescription className="text-slate-500">
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
								<Label htmlFor={nameId} className="text-right">
									{t("Name")}
								</Label>
								<Input
									id={nameId}
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="col-span-3 bg-white rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
								{mutation.isPending ? t("Saving...") : t("Save budget")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
				<AlertDialogContent className="bg-white rounded-3xl shadow-2xl">
					<AlertDialogHeader>
						<AlertDialogTitle>{t("Success!")}</AlertDialogTitle>
						<AlertDialogDescription>
							{t("Budget created successfully!")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={() => setShowSuccessDialog(false)}
							className="bg-slate-200 text-slate-700 rounded-full py-3 px-6 font-semibold hover:bg-slate-300 transition-all"
						>
							{t("OK")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
