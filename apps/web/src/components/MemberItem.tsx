import { Button } from "@/components/ui/button";
import { LabeledSelect } from "@/components/ui/LabeledSelect";
import type { BudgetMember } from "@/domain/budget/BudgetMember";
import { useTranslation } from "react-i18next";
import { useUpdateBudgetMember } from "@/hooks/useUpdateBudgetMember";
import { useRemoveBudgetMember } from "@/hooks/useRemoveBudgetMember";
import type { BudgetRole } from "@/domain/budget";

interface MemberItemProps {
  member: BudgetMember;
  budgetId: string;
}

const roleOptions: { value: BudgetRole; label: string }[] = [
    { value: "VIEWER", label: "Viewer" },
    { value: "EDITOR", label: "Editor" },
    { value: "ADMIN", label: "Admin" },
];

export function MemberItem({ member, budgetId }: MemberItemProps) {
  const { t } = useTranslation();
  const updateRoleMutation = useUpdateBudgetMember(budgetId);
  const removeMemberMutation = useRemoveBudgetMember(budgetId);

  return (
    <div
      key={member.id}
      className="flex items-center justify-between"
    >
      <span>{member.userId}</span>
      <div className="flex items-center space-x-2">
        <LabeledSelect
          value={member.role}
          onValueChange={(value) =>
            updateRoleMutation.mutate({
              memberId: member.id,
              role: value,
            })
          }
          options={roleOptions}
          className="w-[120px]"
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeMemberMutation.mutate(member.id)}
          disabled={removeMemberMutation.isPending}
        >
          {t("Remove")}
        </Button>
      </div>
    </div>
  );
}
