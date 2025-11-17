import { GoalList } from "@/domain/goal/components/GoalList";
import { useTranslation } from "react-i18next";

export function GoalsPage() {
  const { t } = useTranslation();
  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold tracking-tight">{t("goals.title")}</h1>
      <GoalList />
    </div>
  );
}
