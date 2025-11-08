import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteGoal } from "@/hooks/useDeleteGoal";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DeleteGoalDialog({ goalId }: { goalId: string }) {
	const { t } = useTranslation();
	const { mutate } = useDeleteGoal();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="icon">
					<Trash2 className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="dialog-content">
				<AlertDialogHeader>
					<AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("This action cannot be undone.")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
					<AlertDialogAction onClick={() => mutate(goalId)}>
						{t("Delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
