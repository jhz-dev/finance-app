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
import { LabeledInput } from "@/components/ui/LabeledInput";
import { useCreateBudget } from "@/hooks/useCreateBudget";

export function AddBudgetDialog() {
	const { t } = useTranslation();
	const nameId = useId();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");

	const mutation = useCreateBudget();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			mutation.mutate(
				{ name },
				{
					onSuccess: () => {
						setOpen(false);
						setName("");
					},
				},
			);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
					{t("Add New Budget")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px] bg-white rounded-3xl shadow-2xl">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="text-slate-900 font-bold">
							{t("Create New Budget")}
						</DialogTitle>
						<DialogDescription className="text-slate-500">
							{t(
								"Give your new budget a name. Click save when you're done.",
							)}
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<div className="grid gap-4">
							<LabeledInput
								id={nameId}
								label="Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								orientation="horizontal"
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
	);
}
