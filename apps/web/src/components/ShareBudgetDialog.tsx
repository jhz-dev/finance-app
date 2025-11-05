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
import { LabeledInput } from "@/components/ui/LabeledInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import type { BudgetMember, BudgetRole } from "@/domain/budget";

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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={roleId} className="text-right">
              {t("Role")}
            </Label>
            <Select onValueChange={(value) => setRole(value as BudgetRole)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t("Select a role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">{t("Viewer")}</SelectItem>
                <SelectItem value="EDITOR">{t("Editor")}</SelectItem>
                <SelectItem value="ADMIN">{t("Admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                <Select
                  value={member.role}
                  onValueChange={(value) =>
                    updateRoleMutation.mutate({
                      memberId: member.id,
                      role: value as BudgetRole,
                    })
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEWER">{t("Viewer")}</SelectItem>
                    <SelectItem value="EDITOR">{t("Editor")}</SelectItem>
                    <SelectItem value="ADMIN">{t("Admin")}</SelectItem>
                  </SelectContent>
                </Select>
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
