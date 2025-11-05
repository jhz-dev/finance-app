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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetRole } from "@/domain/budget/Budget";
import { BudgetMember } from "@/domain/budget/BudgetMember";
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
        <Button className="bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
          {t("Share")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl shadow-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleInvite();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("Manage Collaborators")}</DialogTitle>
            <DialogDescription>
              {t("Invite others to collaborate on this budget.")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("Email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">{t("Role")}</Label>
              <Select onValueChange={(value) => setRole(value as BudgetRole)}>
                <SelectTrigger className="bg-white rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400">
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
              disabled={inviteMutation.isPending}
              className="bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              {inviteMutation.isPending
                ? t("Sending...")
                : t("Send invitation")}
            </Button>
          </DialogFooter>
        </form>
        {inviteMutation.isError && (
          <Alert variant="destructive">
            <AlertTitle>{t("Error")}</AlertTitle>
            <AlertDescription>
              {t("Failed to send invitation.")}
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-4 pt-4">
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
