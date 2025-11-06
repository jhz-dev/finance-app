import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateGoalForm } from "@/domain/goal/components/UpdateGoalForm";
import type { FinancialGoal } from "@/domain/goal/goal";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function EditGoalDialog({
	goal,
	children,
}: {
	goal: FinancialGoal;
	children: React.ReactNode;
}) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[525px] bg-white rounded-xl border shadow-sm">
				<DialogHeader>
					<DialogTitle>{t("Edit Goal")}</DialogTitle>
				</DialogHeader>
        <div className="py-4">
          <UpdateGoalForm
            goal={goal}
            onDone={() => {
              setOpen(false);
            }}
          />
        </div>
			</DialogContent>
		</Dialog>
	);
}
