import type { BudgetMember } from "@/domain/budget/BudgetMember";
import { useTranslation } from "react-i18next";
import { MemberItem } from "./MemberItem";

interface MemberListProps {
  members: BudgetMember[];
  budgetId: string;
}

export function MemberList({ members, budgetId }: MemberListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{t("Existing Members")}</h3>
      {members.map((member) => (
        <MemberItem key={member.id} member={member} budgetId={budgetId} />
      ))}
    </div>
  );
}
