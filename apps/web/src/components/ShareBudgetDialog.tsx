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
import { useId, useState } from "react";
import type { BudgetRole } from "@/domain/budget/Budget";
import type { BudgetMember } from "@/domain/budget/BudgetMember";
import { useTranslation } from "react-i18next";
import { useInviteUser } from "@/hooks/useInviteUser";
import { MemberList } from "./MemberList";

interface ShareBudgetDialogProps {
  budgetId: string;
  members: BudgetMember[];
}

export function ShareBudgetDialog({
  budgetId,
  members,
}: ShareBudgetDialogProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const emailId = useId();
  const roleId = useId();
  const [role, setRole] = useState<BudgetRole>("VIEWER");

  const roleOptions: { value: BudgetRole; label: string }[] = [
    { value: "VIEWER", label: "Viewer" },
    { value: "EDITOR", label: "Editor" },
    { value: "ADMIN", label: "Admin" },
  ];

  const inviteMutation = useInviteUser(budgetId);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate(
      { email, role },
      {
        onSuccess: () => {
          setEmail("");
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="main-button">{t("Share")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-white rounded-3xl shadow-2xl">
        <form onSubmit={handleInvite}>
          <DialogHeader>
            <DialogTitle>{t("Share budget")}</DialogTitle>
            <DialogDescription>
              {t("Invite others to collaborate on this budget.")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <LabeledInput
              id={emailId}
              label="Email"
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
              disabled={inviteMutation.isPending}
              className="bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              {inviteMutation.isPending
                ? t("Sending...")
                : t("Send invitation")}
            </Button>
          </DialogFooter>
        </form>
        <MemberList budgetId={budgetId} members={members} />
      </DialogContent>
    </Dialog>
  );
}
