import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AddTransactionToGoalForm } from "@/domain/goal/components/AddTransactionToGoalForm";
import type { FinancialGoal } from "@/domain/goal/goal";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function AddTransactionToGoalDialog({
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
					<DialogTitle>{t("Add Transaction to Goal")}</DialogTitle>
					<DialogDescription>
						{t("Add a transaction to this goal to update its progress.")}
					</DialogDescription>
				</DialogHeader>
        <div className="py-4">
          <AddTransactionToGoalForm
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
