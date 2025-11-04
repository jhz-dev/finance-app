import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CreateGoalForm } from "@/domain/goal/components/CreateGoalForm";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function AddGoalDialog({ children }: { children: React.ReactNode }) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("Add New Goal")}</DialogTitle>
				</DialogHeader>
        <div className="py-4">
					<CreateGoalForm
						onDone={() => {
							setOpen(false);
						}}
					/>
        </div>
			</DialogContent>
		</Dialog>
	);
}
