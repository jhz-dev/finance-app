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
import { LabeledSelect } from "@/components/ui/LabeledSelect";

import { useId } from "react";
import type { BudgetRole } from "@/domain/budget/Budget";
import type { BudgetMember } from "@/domain/budget/BudgetMember";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface ShareBudgetDialogProps {
  budgetId: string;
  members: BudgetMember[];
}

export function ShareBudgetDialog({
  budgetId,
  members,
}: ShareBudgetDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [email, setEmail] = React.useState("");
  const emailId = useId();
  const roleId = useId();
  const [role, setRole] = React.useState<BudgetRole>("VIEWER");

  const roleOptions: { value: BudgetRole; label: string }[] = [
    { value: "VIEWER", label: "Viewer" },
    { value: "EDITOR", label: "Editor" },
    { value: "ADMIN", label: "Admin" },
  ];

  const inviteMutation = useMutation({
    mutationFn: () => budgetRepository.inviteMember(budgetId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
      setEmail("");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: BudgetRole;
    }) => budgetRepository.updateMemberRole(budgetId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) =>
      budgetRepository.removeMember(budgetId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
    },
  });

  const handleInvite = () => {
    inviteMutation.mutate();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{t("Share")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Share budget")}</DialogTitle>
          <DialogDescription>
            {t("Invite others to collaborate on this budget.")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <LabeledInput
            id={emailId}
            label={t("Email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            orientation="horizontal"
          />
          <LabeledSelect
            id={roleId}
            label="Role"
            value={role}
            onValueChange={setRole}
            options={roleOptions}
            orientation="horizontal"
            placeholder="Select a role"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleInvite}
            disabled={inviteMutation.isPending}
          >
            {inviteMutation.isPending
              ? t("Sending...")
              : t("Send invitation")}
          </Button>
        </DialogFooter>
        {inviteMutation.isError && (
          <Alert variant="destructive">
            <AlertTitle>{t("Error")}</AlertTitle>
            <AlertDescription>
              {t("Failed to send invitation.")}
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <h3 className="font-semibold">{t("Existing Members")}</h3>
          {members.map((member) => (
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
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
